import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {spawnSync} from 'node:child_process';
export const root = process.cwd();
export const project = path.join(root,'acceptance/20261016-long/works/雨线档案');
export const revision = path.join(root,'acceptance/20261016-long/revision');
export const sha = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
export const read = p => JSON.parse(fs.readFileSync(p,'utf8'));
export function write(p,v){fs.mkdirSync(path.dirname(p),{recursive:true});fs.writeFileSync(p,typeof v==='string'?v:JSON.stringify(v,null,2)+'\n','utf8');}
export function cli(args,out){
  const full=['bin/ai-writer.mjs',args[0],'--project',project,...args.slice(1)];
  const r=spawnSync(process.execPath,full,{cwd:root,encoding:'utf8'});
  if(out)write(path.join(revision,out),r.stdout);
  fs.appendFileSync(path.join(revision,'cli-session.jsonl'),JSON.stringify({time:new Date().toISOString(),argv:[process.execPath,...full],exit:r.status,stdout:r.stdout,stderr:r.stderr})+'\n');
  if(r.status!==0)throw new Error(`CLI failed (${r.status}); raw stdout/stderr preserved: ${r.stdout}\n${r.stderr}`);
  return JSON.parse(r.stdout);
}
export function files(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?files(path.join(dir,e.name)):[path.join(dir,e.name)]);}
if(process.argv[2]==='backup'){
  const before=path.join(revision,'before');
  if(fs.existsSync(before))throw new Error('before already exists; refusing overwrite');
  fs.mkdirSync(before,{recursive:true});
  const rels=['writer.json','AGENTS.md','正文','设定','大纲','审查','.writer/state.json','.writer/journal','.writer/reviews',...fs.readdirSync(path.join(project,'.writer')).filter(n=>n.startsWith('record-')).map(n=>'.writer/'+n)];
  for(const rel of rels)fs.cpSync(path.join(project,rel),path.join(before,rel),{recursive:true,errorOnExist:true,force:false});
  write(path.join(before,'status.json'),cli(['status']));
  write(path.join(before,'check.json'),cli(['check']));
  write(path.join(before,'manifest.json'),files(before).map(p=>({path:path.relative(before,p).replaceAll('\\','/'),sha256:sha(p),bytes:fs.statSync(p).size})));
  const sources=['writer.json',...files(path.join(project,'设定')).map(p=>path.relative(project,p)),...files(path.join(project,'大纲')).map(p=>path.relative(project,p)),...files(path.join(project,'审查')).map(p=>path.relative(project,p)),...fs.readdirSync(path.join(project,'.writer')).filter(n=>n.startsWith('record-')).map(n=>'.writer/'+n)];
  write(path.join(revision,'references-before.tmp.md'),sources.map(rel=>'\n===== '+rel+' =====\n'+fs.readFileSync(path.join(project,rel),'utf8')).join('\n'));
  console.log(JSON.stringify({backup:before,files:files(before).length,revision:read(path.join(before,'.writer/state.json')).revision}));
}
