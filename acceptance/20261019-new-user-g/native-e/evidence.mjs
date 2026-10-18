import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
const here = path.dirname(fileURLToPath(import.meta.url));
const base = path.dirname(here), root = path.resolve(base, '../..');
const project = path.join(base, '作品/纸桥书店 规划');
const sha = b => crypto.createHash('sha256').update(b).digest('hex');
const json = f => JSON.parse(fs.readFileSync(f, 'utf8'));
const out = (rel, value) => { const p = path.join(here, rel); fs.mkdirSync(path.dirname(p), {recursive:true}); fs.writeFileSync(p, JSON.stringify(value, null, 2)+'\n', {flag:'wx'}); };
const slash = p => p.replaceAll('\\', '/');
function snapshot(file, stage, rel) {
  const b = fs.readFileSync(file), target = path.join(here, 'read-versions', stage, rel);
  fs.mkdirSync(path.dirname(target), {recursive:true}); fs.writeFileSync(target, b, {flag:'wx'});
  return {path:slash(file), snapshot:slash(path.relative(here,target)), bytes:b.length, sha256:sha(b), range:{from_line:1, to_line:b.toString('utf8').split('\n').length, byte_start:0, byte_end_exclusive:b.length}, coverage:'entire-file', read_at:new Date().toISOString()};
}
function files(dir) { return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?files(path.join(dir,e.name)):[path.join(dir,e.name)]); }
const stage = process.argv[2];
if(stage === 'baseline') {
  const build = json(path.join(base,'source-build-g4.json'));
  const current = build.files.map(r=>{const p=path.join(root,r.group==='skills'?'.agents/skills':'',r.file); const b=fs.readFileSync(p);return {...r,path:slash(p),actual_sha256:sha(b),matches:b.length===r.bytes&&sha(b)===r.sha256};});
  if(current.some(r=>!r.matches)) throw Error('g4 source mismatch');
  const g3=json(path.join(base,'source-build-g3.json'));
  const delta=build.files.filter(r=>g3.files.find(x=>x.group===r.group&&x.file===r.file)?.sha256!==r.sha256).map(r=>r.file);
  out('build-baseline.json',{g4: snapshot(path.join(base,'source-build-g4.json'),'inputs','source-build-g4.json'),current,delta_from_g3:delta,three_separation_docs_unchanged: ['docs/quickstart.md','docs/user-guide.md','docs/long-form.md'].every(f=>!delta.includes(f)),runtime_unchanged:!build.files.some(r=>r.group==='runtime'&&delta.includes(r.file))});
  const docs=['docs/quickstart.md','docs/user-guide.md','docs/long-form.md','.agents/skills/writer-project/SKILL.md','.agents/skills/writer-project/references/long-form.md','.agents/skills/writer-novel/SKILL.md','docs/workflow.md'];
  const rows=docs.map(r=>snapshot(path.join(root,r),'manuals',r));
  for(const r of ['writer.json','AGENTS.md','设定/作品定位.md','设定/文风.md','设定/权威规则.md','大纲/全书大纲.md','.writer/state.json']) rows.push(snapshot(path.join(project,r),'initialized',r));
  out('initial-readings.json',rows);
  const protectedFiles=files(base).filter(f=>!f.startsWith(here+path.sep)&&!f.startsWith(project+path.sep)&&!slash(path.relative(base,f)).startsWith('commands/e-'));
  out('protected-baseline.json',{note:'Captured after e-init, before any planning edits; excludes only new native-e, new project and e- captures. No old sample was edited before this snapshot.',files:protectedFiles.map(f=>{const b=fs.readFileSync(f);return {path:slash(f),bytes:b.length,sha256:sha(b)};})});
  console.log(JSON.stringify({g4_files:current.length,delta_from_g3:delta,protected_files:protectedFiles.length,templates_saved:true}));
} else if(stage === 'snapshot-final') {
  const relative=['writer.json','AGENTS.md','设定/作品定位.md','设定/文风.md','设定/权威规则.md','设定/人物.md','大纲/全书大纲.md','大纲/单元/0001.json','大纲/单元/0002.json','大纲/单元/0003.json','研究/作者任务原话.md','研究/本轮任务与交接.md','.writer/state.json'];
  const governance=files(path.join(project,'.writer/objects')).map(f=>slash(path.relative(project,f)));
  const volumes=files(path.join(project,'大纲')).filter(f=>f.endsWith('.json')&&!slash(f).includes('/单元/')).map(f=>slash(path.relative(project,f)));
  const rows=[...new Set([...relative,...governance,...volumes])].map(r=>snapshot(path.join(project,r),'final',r));
  out('final-readings.json',rows);
  console.log(JSON.stringify({files:rows.length,paths:rows.map(r=>r.path)}));
} else throw Error('Use baseline or snapshot-final');
