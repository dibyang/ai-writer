import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
const root = 'D:/work/other/ai-writer';
const expected = root + '/acceptance/20261015-usability-fix/works/雨后失物';
const args = process.argv.slice(2);
if (args.length !== 2 || args[0] !== '--project' || path.resolve(args[1]) !== path.resolve(expected)) throw new Error('作品路径不匹配');
if (path.resolve(process.cwd()) !== path.resolve(root)) throw new Error('必须从根目录运行');
const p = path.resolve(args[1]);
const stage = root + '/acceptance/20261015-usability-fix/novel-a';
const readJson = f => JSON.parse(fs.readFileSync(f, 'utf8'));
const sha = f => crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');
const index = readJson(path.join(p,'.writer/import.json'));
const state = readJson(path.join(p,'.writer/state.json'));
const manifest = readJson(path.join(stage,'export/manifest.json'));
const commands = fs.readFileSync(path.join(stage,'commands.jsonl'),'utf8').trim().split(/\r?\n/).map(JSON.parse);
const assertions = [];
const check = (name, pass) => assertions.push({name,pass:!!pass});
const comparisons = index.sources.map(source => {
  const draft = '正文/' + String(source.unit).padStart(4,'0') + '-导入.md';
  const hashes = {baseline:source.sha256,original:sha(source.original),frozen:sha(path.join(p,source.copy)),draft:sha(path.join(p,draft))};
  check('unit-'+source.unit+'-original-frozen-draft-identical', Object.values(hashes).every(h=>h===source.sha256));
  return {unit:source.unit,original:source.original,copy:source.copy,draft,hashes};
});
check('explicit-source-order',index.sources.map(s=>path.basename(s.original)).join(',')==='0001.md,0002.md');
check('schema2-revision2-unit1-only',state.schema_version===2 && state.revision===2 && state.units.length===1 && state.units[0].unit===1);
check('second-and-third-unit-plan-absent',![2,3].some(n=>fs.existsSync(path.join(p,'大纲/单元/'+String(n).padStart(4,'0')+'.json'))));
check('third-draft-absent',!fs.readdirSync(path.join(p,'正文')).some(n=>n.startsWith('0003')));
check('export-unit1-only',JSON.stringify(manifest.included_units)==='[1]');
check('export-explicitly-excludes-unit2',manifest.excluded_drafts.length===1 && manifest.excluded_drafts[0].draft==='正文/0002-导入.md' && manifest.excluded_drafts[0].reason==='unregistered');
const exportSha = sha(path.join(stage,'export/manuscript.md'));
check('export-byte-identical-to-original1',exportSha===index.sources[0].sha256 && exportSha===manifest.sha256);
check('logged-main-workflow-all-successful',commands.every(c=>c.status===0));
for (const command of ['status','import-status','check']) {
 const last=commands.filter(c=>c.argv[1]===command).at(-1);
 fs.writeFileSync(path.join(stage,command+'.json'),last.stdout,'utf8');
}
const git = spawnSync('git',['status','--short'],{cwd:root,encoding:'utf8'});
fs.writeFileSync(path.join(stage,'git-status-final.txt'),git.stdout||'','utf8');
const result = {checked_at:new Date().toISOString(),cwd:root,project:p,ok:assertions.every(a=>a.pass),scope:'文件与哈希核对；不读取展示第二章正文，不构成文学质量验收',assertions,comparisons,export_sha256:exportSha,successful_cli_commands:commands.length,git_status_exit_code:git.status};
fs.writeFileSync(path.join(stage,'verification.json'),JSON.stringify(result,null,2)+'\n','utf8');
console.log(JSON.stringify(result,null,2));
process.exitCode = result.ok ? 0 : 1;

