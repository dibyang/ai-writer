import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { userError } from './help.mjs';

export const RUNTIME_FILES = ['package.json', 'bin/ai-writer.mjs', 'lib/workspace.mjs', 'lib/journal.mjs', 'lib/longform.mjs', 'lib/help.mjs', 'lib/style.mjs', 'lib/governance.mjs', 'lib/tool-build.mjs', 'lib/sources.mjs', 'lib/revisions.mjs', 'lib/review-workflow.mjs'];
const sha = value => crypto.createHash('sha256').update(value).digest('hex');
function ordinary(file) {
  const absolute = path.resolve(file); let cursor = path.parse(absolute).root;
  for (const part of absolute.slice(cursor.length).split(path.sep).filter(Boolean)) {
    cursor = path.join(cursor, part);
    if (fs.lstatSync(cursor).isSymbolicLink()) throw userError(`构建检查拒绝符号链接：${file}`, { code: 'BUILD_UNSAFE_PATH' });
  }
  if (!fs.statSync(absolute).isFile()) throw userError(`构建输入不是普通文件：${file}`, { code: 'BUILD_INVALID_INPUT' });
  return absolute;
}
export function toolRoot(value) {
  const root = path.resolve(value);
  return fs.existsSync(path.join(root, 'writer.json')) ? path.join(root, '.writer/tool') : root;
}
export function identifyBuild(value) {
  const root = toolRoot(value), embedded = path.basename(path.dirname(root)) === '.writer';
  const profile = embedded ? 'workspace-copy' : 'main', contentRoot = embedded ? path.resolve(root, '../..') : root;
  const files = [], missing = [];
  const pkgFile = path.join(root, 'package.json');
  const pkg = JSON.parse(fs.readFileSync(ordinary(pkgFile), 'utf8').replace(/^\uFEFF/, ''));
  // Legacy copies had fewer modules; their observed identity is useful without inventing provenance.
  const legacyFiles = pkg.version?.startsWith('0.1.') ? RUNTIME_FILES.slice(0, 3) : pkg.version?.startsWith('0.2.') ? RUNTIME_FILES.slice(0, 5) : pkg.version?.startsWith('0.3.') ? RUNTIME_FILES.slice(0, 7) : pkg.version?.startsWith('0.4.') ? RUNTIME_FILES.slice(0, 9) : pkg.version?.startsWith('0.5.')?RUNTIME_FILES.slice(0,11):RUNTIME_FILES;
  function add(file, group, ref) {
    if (!fs.existsSync(file)) { missing.push({ group, file: ref }); return; }
    const bytes = fs.readFileSync(ordinary(file)); files.push({ group, file: ref, bytes: bytes.length, sha256: sha(bytes) });
  }
  for (const ref of legacyFiles) add(path.join(root, ref), 'runtime', ref);
  for (const ref of ['docs/quickstart.md', 'docs/user-guide.md', 'docs/workflow.md', 'docs/long-form.md', 'docs/deslop.md', 'docs/attribution.md', 'LICENSE.md']) add(path.join(contentRoot, ref), 'content', ref);
  if (/^0\.[56]\./.test(pkg.version??'')) add(path.join(contentRoot, 'docs/revision-and-sources.md'), 'content', 'docs/revision-and-sources.md');
  if (pkg.version?.startsWith('0.6.')) add(path.join(contentRoot,'docs/review-and-registration.md'),'content','docs/review-and-registration.md');
  const skillRoot = path.join(contentRoot, '.agents/skills');
  function walk(dir, ref = '') {
    if (!fs.existsSync(dir)) { missing.push({ group: 'skills', file: ref || '.agents/skills' }); return; }
    if (fs.lstatSync(dir).isSymbolicLink()) throw userError('技能目录不允许链接', { code: 'BUILD_UNSAFE_PATH' });
    for (const name of fs.readdirSync(dir).sort()) {
      const file = path.join(dir, name), next = ref ? `${ref}/${name}` : name;
      if (fs.lstatSync(file).isDirectory()) walk(file, next); else add(file, 'skills', next);
    }
  }
  walk(skillRoot); files.sort((a, b) => `${a.group}/${a.file}` < `${b.group}/${b.file}` ? -1 : `${a.group}/${a.file}` > `${b.group}/${b.file}` ? 1 : 0);
  const observed_content_id = sha(JSON.stringify(files));
  const runtime_id = sha(JSON.stringify(files.filter(x => x.group === 'runtime')));
  const manifestFile = path.join(root, 'build-manifest.json'); let declared = null, mismatches = [];
  if (fs.existsSync(manifestFile)) {
    declared = JSON.parse(fs.readFileSync(ordinary(manifestFile), 'utf8'));
    if (declared.schema_version !== 1 || !Array.isArray(declared.files) || declared.build_id !== sha(JSON.stringify(declared.files))) throw userError('构建清单损坏', { code: 'BUILD_MANIFEST_INVALID' });
    const expected = new Map(declared.files.map(x => [`${x.group}/${x.file}`, x]));
    for (const row of files) { const key = `${row.group}/${row.file}`; if (expected.get(key)?.sha256 !== row.sha256 || expected.get(key)?.bytes !== row.bytes) mismatches.push(key); expected.delete(key); }
    mismatches.push(...expected.keys());
    if (declared.profile !== profile || declared.tool_version !== pkg.version) mismatches.push('manifest/profile-or-version');
  }
  const oldProfile = /^0\.[12]\./.test(pkg.version ?? '');
  const requiredMissing = missing.filter(row => !oldProfile || row.group !== 'content');
  return { ok: !requiredMissing.length && !mismatches.length, tool_root: root, tool_version: pkg.version, profile, observed_content_id, runtime_id,
    attestation: declared ? 'manifest-present-not-a-signature' : embedded ? 'legacy-unattested' : 'observed-source-tree', declared_build_id: declared?.build_id ?? null,
    provenance: declared?.provenance ?? (embedded ? { source_commit: 'unknown', dirty: 'unknown' } : sourceProvenance(root)),
    supported_state_schemas: pkg.version?.startsWith('0.6.') ? [1,2,3,4,5] : pkg.version?.startsWith('0.5.') ? [1, 2, 3, 4] : pkg.version?.startsWith('0.4.') ? [1, 2, 3] : pkg.version?.startsWith('0.1.') ? [1] : /^0\.[23]\./.test(pkg.version ?? '') ? [1, 2] : [],
    schema_support_basis: 'known-version-protocol; not a semantic execution probe', files, missing, mismatches,
    note: '内容指纹为本次磁盘观测，非作者身份或供应链签名；不升级工具、不修改作品。main/workspace-copy 有意省略引擎，公共受管文件才可直接比较。' };
}
export function writeBuildManifest(root, provenance = { source_commit: 'unknown', dirty: 'unknown' }) {
  const observed = identifyBuild(root);
  if (observed.missing.length) throw userError('不能为缺失文件的工具生成清单', { code: 'BUILD_INCOMPLETE' });
  const manifest = { schema_version: 1, profile: observed.profile, tool_version: observed.tool_version, build_id: observed.observed_content_id,
    provenance, files: observed.files, supported_state_schemas: observed.supported_state_schemas };
  fs.writeFileSync(path.join(toolRoot(root), 'build-manifest.json'), JSON.stringify(manifest, null, 2) + '\n', { flag: 'wx' }); return manifest;
}
export function sourceProvenance(root) {
  const r = spawnSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8', timeout: 5000, windowsHide: true });
  if (r.status !== 0) return { source_commit: 'unknown', dirty: 'unknown' };
  const status = spawnSync('git', ['status', '--porcelain', '--untracked-files=normal'], { cwd: root, encoding: 'utf8', timeout: 5000, windowsHide: true });
  return { source_commit: r.stdout.trim(), dirty: status.status === 0 ? Boolean(status.stdout.trim()) : 'unknown' };
}
export function compareBuilds(leftRoot, rightRoot) {
  const left = identifyBuild(leftRoot), right = identifyBuild(rightRoot), byKey = new Map(right.files.map(x => [`${x.group}/${x.file}`, x])), differences = [];
  for (const row of left.files) { const key = `${row.group}/${row.file}`, other = byKey.get(key); if (!other || other.sha256 !== row.sha256) differences.push({ group: row.group, file: row.file, left_sha256: row.sha256, right_sha256: other?.sha256 ?? null }); byKey.delete(key); }
  for (const row of byKey.values()) differences.push({ group: row.group, file: row.file, left_sha256: null, right_sha256: row.sha256 });
  return { ok: true, read_only: true, same_version: left.tool_version === right.tool_version, same_content: left.observed_content_id === right.observed_content_id,
    left, right, differences, conclusion: left.tool_version === right.tool_version && differences.length ? '版本号相同、构建内容不同' : differences.length ? '构建内容不同' : '公共受管内容相同',
    limitations: '只读识别与比较；未实现安全更新、文件替换或本地定制合并。' };
}
