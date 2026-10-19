import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { userError } from './help.mjs';

export const RUNTIME_FILES = ['package.json', 'bin/ai-writer.mjs', 'lib/workspace.mjs', 'lib/journal.mjs', 'lib/longform.mjs', 'lib/help.mjs', 'lib/style.mjs', 'lib/governance.mjs', 'lib/tool-build.mjs', 'lib/sources.mjs', 'lib/revisions.mjs', 'lib/review-workflow.mjs', 'lib/tool-update.mjs'];
export const WORK_GUIDES = ['quickstart.md', 'user-guide.md', 'workflow.md', 'long-form.md', 'deslop.md', 'attribution.md', 'revision-and-sources.md', 'review-and-registration.md', 'tool-updates.md'];
export const WORK_ATTRIBUTION = ['LICENSE.md', 'docs/source-manifest.json', 'docs/oh-story-audit-manifest.json', 'docs/usability-sources.json', 'vendor/oh-story-reference/LICENSE', 'vendor/oh-story-reference-20261015/LICENSE', 'vendor/oh-story-deslop-reference/LICENSE', 'vendor/oh-story-deslop-reference/how-to-remove-ai-flavor-from-web-fiction.md'];
export const PACKAGE_CONTENT = [...WORK_GUIDES.map(x=>`docs/${x}`), ...WORK_ATTRIBUTION, 'examples/prompts.md', 'examples/history-fact-card.json'];
// 0.8 adds writing methods while retaining the 0.7 owned-resource/schema6 protocol.
export const currentProtocol = version => /^0\.[78]\./.test(version??'');
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
export function identifyBuild(value, { preparingManifest = false } = {}) {
  const root = toolRoot(value), embedded = path.basename(path.dirname(root)) === '.writer';
  const profile = embedded ? 'workspace-copy' : 'main', contentRoot = embedded ? path.resolve(root, '../..') : root;
  const files = [], missing = [];
  const pkgFile = path.join(root, 'package.json');
  const pkg = JSON.parse(fs.readFileSync(ordinary(pkgFile), 'utf8').replace(/^\uFEFF/, ''));
  // Legacy copies had fewer modules; their observed identity is useful without inventing provenance.
  const legacyFiles = pkg.version?.startsWith('0.1.') ? RUNTIME_FILES.slice(0, 3) : pkg.version?.startsWith('0.2.') ? RUNTIME_FILES.slice(0, 5) : pkg.version?.startsWith('0.3.') ? RUNTIME_FILES.slice(0, 7) : pkg.version?.startsWith('0.4.') ? RUNTIME_FILES.slice(0, 9) : pkg.version?.startsWith('0.5.')?RUNTIME_FILES.slice(0,11):pkg.version?.startsWith('0.6.')?RUNTIME_FILES.slice(0,12):RUNTIME_FILES;
  function add(file, group, ref) {
    if (!fs.existsSync(file)) { missing.push({ group, file: ref }); return; }
    const bytes = fs.readFileSync(ordinary(file)); files.push({ group, file: ref, bytes: bytes.length, sha256: sha(bytes) });
  }
  for (const ref of legacyFiles) add(path.join(root, ref), 'runtime', ref);
  const owned = currentProtocol(pkg.version), resources = owned ? root : contentRoot;
  for (const ref of owned ? PACKAGE_CONTENT : ['docs/quickstart.md', 'docs/user-guide.md', 'docs/workflow.md', 'docs/long-form.md', 'docs/deslop.md', 'docs/attribution.md', 'LICENSE.md']) add(path.join(resources, ref), 'content', ref);
  if (/^0\.[56]\./.test(pkg.version??'')) add(path.join(contentRoot, 'docs/revision-and-sources.md'), 'content', 'docs/revision-and-sources.md');
  if (pkg.version?.startsWith('0.6.')) add(path.join(contentRoot,'docs/review-and-registration.md'),'content','docs/review-and-registration.md');
  const skillRoot = path.join(resources, '.agents/skills');
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
  // A current embedded package is created with a manifest. Its disappearance is
  // damage, not evidence that this package predates the manifest protocol.
  if (owned && embedded && !preparingManifest && !fs.existsSync(manifestFile)) missing.push({ group: 'manifest', file: 'build-manifest.json' });
  if (fs.existsSync(manifestFile)) {
    declared = JSON.parse(fs.readFileSync(ordinary(manifestFile), 'utf8'));
    validateManifest(declared);
    const expected = new Map(declared.files.map(x => [`${x.group}/${x.file}`, x]));
    for (const row of files) { const key = `${row.group}/${row.file}`; if (expected.get(key)?.sha256 !== row.sha256 || expected.get(key)?.bytes !== row.bytes) mismatches.push(key); expected.delete(key); }
    mismatches.push(...expected.keys());
    if (declared.profile !== profile || declared.tool_version !== pkg.version) mismatches.push('manifest/profile-or-version');
  }
  const oldProfile = /^0\.[12]\./.test(pkg.version ?? '');
  const requiredMissing = missing.filter(row => !oldProfile || row.group !== 'content');
  return { ok: !requiredMissing.length && !mismatches.length, tool_root: root, tool_version: pkg.version, profile, observed_content_id, runtime_id,
    attestation: declared ? 'manifest-present-not-a-signature' : owned && embedded ? 'required-manifest-missing' : embedded ? 'legacy-unattested' : 'observed-source-tree', declared_build_id: declared?.build_id ?? null,
    provenance: declared?.provenance ?? (embedded ? { source_commit: 'unknown', dirty: 'unknown' } : sourceProvenance(root)),
    supported_state_schemas: owned ? [1,2,3,4,5,6] : pkg.version?.startsWith('0.6.') ? [1,2,3,4,5] : pkg.version?.startsWith('0.5.') ? [1, 2, 3, 4] : pkg.version?.startsWith('0.4.') ? [1, 2, 3] : pkg.version?.startsWith('0.1.') ? [1] : /^0\.[23]\./.test(pkg.version ?? '') ? [1, 2] : [],
    schema_support_basis: 'known-version-protocol; not a semantic execution probe', files, missing, mismatches,
    content_scope: owned ? 'tool-root' : 'workspace-root',
    note: '内容指纹为本次磁盘观测，非作者身份或供应链签名；识别/比较不升级工具。轻量包有意省略引擎，新包资源在tool-root，作品根定制另行保留。' };
}
export function writeBuildManifest(root, provenance = { source_commit: 'unknown', dirty: 'unknown' }, baselines) {
  const observed = identifyBuild(root, { preparingManifest: true });
  if (observed.missing.length) throw userError('不能为缺失文件的工具生成清单', { code: 'BUILD_INCOMPLETE' });
  const manifest = { schema_version: currentProtocol(observed.tool_version)?2:1, profile: observed.profile, tool_version: observed.tool_version, build_id: observed.observed_content_id,
    provenance, files: observed.files, supported_state_schemas: observed.supported_state_schemas };
  if(manifest.schema_version===2){manifest.content_scope='tool-root';manifest.workspace_baselines=baselines??workspaceBaselines(root);}
  validateManifest(manifest);
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
    limitations: '只读比较，不执行更新；作品根定制由update-plan另列，不能仅凭版本号推断可覆盖。' };
}

export function fileRef(row){return row.group==='skills'?`.agents/skills/${row.file}`:row.file;}
function validRef(ref){return typeof ref==='string'&&!path.isAbsolute(ref)&&!/[\\:\x00-\x1f]/.test(ref)&&ref.split('/').every(x=>x&&x!=='.'&&x!=='..'&&!/[. ]$/.test(x));}
export function validateManifest(value){
  const bad=()=>{throw userError('构建清单损坏、重复或路径不安全',{code:'BUILD_MANIFEST_INVALID'});};
  if(!value||![1,2].includes(value.schema_version)||!['main','workspace-copy'].includes(value.profile)||!Array.isArray(value.files)||value.build_id!==sha(JSON.stringify(value.files)))bad();
  const seen=new Set();for(const r of value.files){if(!['runtime','content','skills'].includes(r.group)||!validRef(r.file)||!Number.isSafeInteger(r.bytes)||r.bytes<0||!/^[a-f0-9]{64}$/.test(r.sha256??''))bad();const k=fileRef(r).toLowerCase();if(seen.has(k))bad();seen.add(k);}
  if(value.schema_version===2&&(value.content_scope!=='tool-root'||!Array.isArray(value.workspace_baselines)))bad();
  for(const r of value.workspace_baselines??[])if(!validRef(r.file)||!/^[a-f0-9]{64}$/.test(r.sha256??''))bad();
  return value;
}
export function workspaceBaselines(root){
  const work=path.basename(path.dirname(root))==='.writer'?path.resolve(root,'../..'):null;if(!work)return [];
  const rows=[];for(const ref of [...WORK_GUIDES.map(x=>`docs/${x}`),'AGENTS.md']){const f=path.join(work,ref);if(fs.existsSync(f))rows.push({file:ref,sha256:sha(fs.readFileSync(ordinary(f)))});}return rows;
}
export function packageFiles(value){
  const build=identifyBuild(value);if(!currentProtocol(build.tool_version)||!build.ok)throw userError('来源必须是完整0.7或0.8本地工具包；先核identify缺项或清单差异',{code:'TOOL_SOURCE_INVALID'});
  const required=new Set([...RUNTIME_FILES,...PACKAGE_CONTENT,...['project','novel','screenplay','history','essay','review','research'].map(x=>`.agents/skills/writer-${x}/SKILL.md`)]);for(const r of build.files)required.delete(fileRef(r));
  if(required.size)throw userError('更新来源缺少必需模块/手册/许可',{code:'TOOL_SOURCE_INCOMPLETE'});
  for(const r of build.files)if(r.bytes>1024*1024||fs.statSync(ordinary(path.join(build.tool_root,fileRef(r)))).nlink!==1)throw userError('更新包含硬链接或单文件超过1MiB',{code:'TOOL_SOURCE_INVALID'});
  if(build.files.reduce((n,r)=>n+r.bytes,0)>32*1024*1024)throw userError('轻量工具包超过32MiB',{code:'TOOL_SOURCE_INVALID'});
  return build;
}
