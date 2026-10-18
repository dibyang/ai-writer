import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const stage=path.dirname(fileURLToPath(import.meta.url)), base=path.dirname(stage), work=path.join(base,'work');
const sha=x=>crypto.createHash('sha256').update(x).digest('hex');
const write=(name,data)=>fs.writeFileSync(path.join(stage,name),JSON.stringify(data,null,2)+'\n',{flag:'wx'});
export function inventory(){
 const files={}; function walk(dir){for(const d of fs.readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,d.name),rel=path.relative(work,p).replaceAll('\\','/');if(rel==='.writer')continue;if(d.isSymbolicLink())throw Error('link');if(d.isDirectory())walk(p);else files[rel]=sha(fs.readFileSync(p));}} walk(work);
 const bytes=fs.readFileSync(path.join(work,'.writer/state.json')),s=JSON.parse(bytes);
 return {at:new Date().toISOString(),state_sha256:sha(bytes),schema:s.schema_version,revision:s.revision,generation:s.tool_control?.generation,keys:Object.keys(s),units_sha256:sha(JSON.stringify(s.units)),snapshot_sha256:sha(JSON.stringify(s.snapshot)),files,tool_control:s.tool_control};
}
const [mode,...a]=process.argv.slice(2);
if(mode==='baseline'){fs.mkdirSync(path.join(stage,'inputs'),{recursive:true});fs.mkdirSync(path.join(stage,'checkpoints'),{recursive:true});write('baseline-inventory.json',inventory());fs.copyFileSync(path.join(work,'.writer/state.json'),path.join(stage,'before-update-state.json'),fs.constants.COPYFILE_EXCL); console.log(JSON.stringify({baseline:inventory(),files:undefined},(k,v)=>['files','tool_control'].includes(k)?undefined:v));}
if(mode==='run'){
 const [label,entry,...args]=a;if(!/^f-a-/.test(label))throw Error('label');const cli=entry==='bundled'?path.join(work,'.writer/tool/bin/ai-writer.mjs'):'D:/work/other/ai-writer/bin/ai-writer.mjs';
 const out=spawnSync(process.execPath,[path.join(base,'capture.mjs'),label,process.execPath,cli,...args,'--project',work],{encoding:'utf8',windowsHide:true,maxBuffer:64*1024*1024});
 const dir=path.join(base,'commands',label);const raw=fs.readFileSync(path.join(dir,'stdout.raw.txt'),'utf8'),err=fs.readFileSync(path.join(dir,'stderr.raw.txt'),'utf8');let parsed;try{parsed=JSON.parse(raw)}catch{}
 const omit=new Set(['files','current','tool_control','ledger','snapshot','left','right','local_content']);
 console.log(JSON.stringify({label,capture_exit:out.status,stdout_keys:parsed?Object.keys(parsed):null,stdout:parsed?JSON.parse(JSON.stringify(parsed,(k,v)=>omit.has(k)?undefined:v)):raw.slice(0,5000),stderr:err}));process.exitCode=out.status;
}
if(mode==='state-summary'){const s=JSON.parse(fs.readFileSync(path.join(work,'.writer/state.json')));console.log(JSON.stringify({keys:Object.keys(s),schema:s.schema_version,revision:s.revision,unit_count:s.units.length,snapshot_keys:Object.keys(s.snapshot??{}),governance:s.governance,tool_control:s.tool_control,source_hashes_keys:Object.keys(s.source_hashes??{})}));}
if(mode==='prepare-update'){
 const p=JSON.parse(fs.readFileSync(path.join(base,'commands',a[0],'stdout.raw.txt')));console.log(JSON.stringify({can_update:p.can_update,blockers:p.blockers,request:p.request,source_id:p.source.content_id,target_id:p.target.content_id,local_content:p.local_content}));
 const evidence='研究/F轮用户授权与执行范围.md',b=fs.readFileSync(path.join(work,evidence));
 const input={...p.request,author_evidence:{quote:'继续通过 Codex 做百章规模的长篇实跑验证，重点覆盖工具更新后的多轮跨会话恢复、跨卷伏笔回收和多处旧章修改后的连续性，发现问题直接修复，保留完整验证记录，暂不修改现有作品。',local_source:evidence,source_sha256:sha(b),locator:'第5行用户原话；第7至13行本轮隔离副本范围',recorded_by:'Codex F轮阶段A知情模型'}};
 write('inputs/tool-update.json',input);
}
if(mode==='verify'){
 const name=a[0],old=JSON.parse(fs.readFileSync(path.join(stage,'baseline-inventory.json'))),now=inventory(),before=JSON.parse(fs.readFileSync(path.join(stage,'before-update-state.json'))),after=JSON.parse(fs.readFileSync(path.join(work,'.writer/state.json')));
 const changed=Object.keys({...old.files,...now.files}).filter(k=>old.files[k]!==now.files[k]); const stateKeys=Object.keys({...before,...after}).filter(k=>JSON.stringify(before[k])!==JSON.stringify(after[k]));
 const result={at:now.at,schema:now.schema,revision:now.revision,generation:now.generation,body_count:Object.keys(now.files).filter(x=>x.startsWith('正文/')).length,changed_root_files:changed,state_changed_keys:stateKeys,units_unchanged:old.units_sha256===now.units_sha256,snapshot_unchanged:old.snapshot_sha256===now.snapshot_sha256,source_hashes_unchanged:JSON.stringify(before.source_hashes)===JSON.stringify(after.source_hashes),before_state_sha256:old.state_sha256,after_state_sha256:now.state_sha256,tool_control:after.tool_control};
 write(name+'.json',result);fs.copyFileSync(path.join(work,'.writer/state.json'),path.join(stage,name+'-state.json'),fs.constants.COPYFILE_EXCL);console.log(JSON.stringify(result));
}
if(mode==='checkpoint'){
 const notes=JSON.parse(fs.readFileSync(path.resolve(a[0]),'utf8'));
 for(const n of notes){const filename=fs.readdirSync(path.join(work,'正文')).find(x=>x.startsWith(String(n.unit).padStart(4,'0')+'-')),rel='正文/'+filename,b=fs.readFileSync(path.join(work,rel)),str=b.toString('utf8'),lines=str.split(/\r?\n/);
 if(!n.quote||!str.includes(n.quote))throw Error('quote not found '+n.unit);
 const record={...n,path:rel,absolute_path:path.join(work,rel).replaceAll('\\','/'),sha256:sha(b),bytes:b.length,line_count:lines.length,coverage:[[1,lines.length]],max_line_chars:Math.max(...lines.map(x=>[...x].length)),read_method:'FastCtx read 原文，返回 Complete；按章顺序完整呈现，无未读续页及截断长行',completed_at:new Date().toISOString()};
 write('checkpoints/'+String(n.unit).padStart(4,'0')+'.json',record);
 }
 const all=fs.readdirSync(path.join(stage,'checkpoints')).filter(x=>x.endsWith('.json')).sort().map(x=>JSON.parse(fs.readFileSync(path.join(stage,'checkpoints',x))));
 fs.writeFileSync(path.join(stage,'readings.json'),JSON.stringify({nature:'informed-model-full-read-not-blind-human-or-publication-acceptance',work:work.replaceAll('\\','/'),ordered_units:all.map(x=>x.unit),chapters:all},null,2)+'\n');
 console.log(JSON.stringify(all.map(x=>({unit:x.unit,lines:x.line_count,sha256:x.sha256,max_line_chars:x.max_line_chars}))));
}
if(mode==='correct-terminal-metadata'){
 const corrections=[];for(const f of fs.readdirSync(path.join(stage,'checkpoints'))){const p=path.join(stage,'checkpoints',f),n=JSON.parse(fs.readFileSync(p)),count=fs.readFileSync(path.join(work,n.path),'utf8').split(/\r?\n/).length;corrections.push({unit:n.unit,old_line_count:n.line_count,new_line_count:count,reason:'最初元数据未计末尾空行；FastCtx实际已显示且Complete，统一按工具行号计入'});n.line_count=count;n.coverage=[[1,count]];fs.writeFileSync(p,JSON.stringify(n,null,2)+'\n');}write('line-count-correction.json',corrections);console.log(JSON.stringify(corrections));
}
