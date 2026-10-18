import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
export const phase=path.dirname(fileURLToPath(import.meta.url)), root=path.dirname(phase);
export const handoff=JSON.parse(fs.readFileSync(path.join(root,'native-revise-partial/handoff.json'),'utf8'));
export const project=handoff.project, branch=handoff.workspace, token=handoff.token, id=handoff.id;
export const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
export const json=f=>JSON.parse(fs.readFileSync(f,'utf8'));
export const state=(p=project)=>json(path.join(p,'.writer/state.json'));
export function put(f,x){fs.mkdirSync(path.dirname(f),{recursive:true});fs.writeFileSync(f,typeof x==='string'||Buffer.isBuffer(x)?x:JSON.stringify(x,null,2)+'\n',{flag:'wx'});}
export function input(name,x){const f=path.join(phase,'inputs',name+'.json');put(f,x);return f;}
export function run(label,args,p=project,{expect=0,branchToken=p===branch}={}){
 const name='native-three-'+label;
 const argv=[path.join(root,'capture.mjs'),name,'node','bin/ai-writer.mjs',...args,'--project',p,...(branchToken?['--revision-token',token]:[])];
 const r=spawnSync('node',argv,{cwd:'D:/work/other/ai-writer',encoding:'utf8',windowsHide:true,maxBuffer:64*1024*1024});
 const d=path.join(root,'commands',name),meta=json(path.join(d,'result.json'));
 const raw=fs.readFileSync(path.join(d,r.status===0?'stdout.raw.txt':'stderr.raw.txt'),'utf8');
 let output;try{output=JSON.parse(raw);}catch{output=raw;}
 let displayed=args[0]==='context'&&output.ok?{ok:output.ok,unit:output.unit,revision:output.revision,plan:output.plan,characters:output.snapshot?.characters,reader:output.continuity?.reader,known:output.continuity?.characters,source_bindings:output.source_bindings}:output;
 if(args[0]==='source'&&args[1]==='list'&&output.ok)displayed={...output,versions:Object.keys(output.versions)};
 console.log(JSON.stringify({label:name,exit:r.status,state_unchanged:meta.before_state_sha256===meta.after_state_sha256,output:displayed}));
 if(r.status!==expect)throw Error('Unexpected CLI exit '+r.status+' '+label);
 return output;
}
export function fingerprint(p){const s=state(p);return {revision:s.revision,state_sha256:sha(fs.readFileSync(path.join(p,'.writer/state.json'))),units:s.units.map(u=>({...u,actual_sha256:sha(fs.readFileSync(path.join(p,u.draft)))}))};}
export function bundle(name,p,refs){let text='# 真实文件阅读副本\n\n';for(const ref of [...new Set(refs)]){const b=fs.readFileSync(path.join(p,ref));text+=`## ${ref}\n\nSHA256=${sha(b)}\n\n${b.toString('utf8')}\n\n`;}put(path.join(phase,'readings',name+'.md'),text);}
if(process.argv[2]==='start'){
 put(path.join(phase,'main-before-state.raw.json'),fs.readFileSync(path.join(project,'.writer/state.json')));
 put(path.join(phase,'branch-before-state.raw.json'),fs.readFileSync(path.join(branch,'.writer/state.json')));
 put(path.join(phase,'main-before-fingerprints.json'),fingerprint(project));
 for(const ref of ['session.json','base.json','base-state.json'])put(path.join(phase,'session-before',ref),fs.readFileSync(path.join(project,'.writer/revisions',id,ref)));
 bundle('resume-six',branch,handoff.units.map(u=>u.draft));
 bundle('resume-inputs',branch,['writer.json','设定/作品定位.md','设定/文风.md','设定/权威规则.md','大纲/全书大纲.md','大纲/分卷/V1.json','大纲/分卷/V2.json',...Array.from({length:6},(_,i)=>`大纲/单元/000${i+1}.json`),'研究/第二会话-合成作者修订原话.md']);
 run('restore-main-status',['status']);
 run('restore-revision-list',['revision','list']);
 run('restore-branch-status',['status'],branch);
}
if(process.argv[2]==='cli'){const [, , ,label,target,...args]=process.argv;run(label,args,target==='branch'?branch:project);}
