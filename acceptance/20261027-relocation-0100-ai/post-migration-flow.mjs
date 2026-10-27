import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const base=path.dirname(fileURLToPath(import.meta.url)),label=process.argv[2]??'post47',prior=JSON.parse(fs.readFileSync(path.join(base,process.argv[3]??'scale47-resume-verification.json'))),root=prior.root,cli=path.join(root,'.writer/tool/bin/ai-writer.mjs');
const sha=b=>crypto.createHash('sha256').update(b).digest('hex'),state=(p=root)=>JSON.parse(fs.readFileSync(path.join(p,'.writer/state.json')));let seq=0;
function write(p,v){fs.mkdirSync(path.dirname(p),{recursive:true});fs.writeFileSync(p,typeof v==='string'?v:JSON.stringify(v,null,2)+'\n',{flag:'wx'});return p;}
function run(name,args,expected=0){const id=`${label}-${String(++seq).padStart(3,'0')}-${name}`,r=spawnSync(process.execPath,[path.join(base,'capture.mjs'),id,process.execPath,cli,...args],{encoding:'utf8',windowsHide:true});assert.equal(r.status,expected,r.stderr||r.stdout);console.log(id);return JSON.parse(fs.readFileSync(path.join(base,'commands',id,expected===0?'stdout.raw.txt':'stderr.raw.txt'),'utf8'));}
function call(name,cmd,action,input,extra=[],p=root){const args=[cmd,...(action?[action]:[]),'--project',p];if(input)args.push('--input',write(path.join(base,'inputs',`${label}-${seq+1}.json`),input));return run(name,[...args,...extra]);}
const quote=fs.readFileSync(path.join(root,'研究/验证授权.md'),'utf8'),evidence={local_source:'研究/验证授权.md',source_sha256:sha(quote),quote,locator:'synthetic fixture line 1',recorded_by:'Codex synthetic CLI validation'};
const append=48,input=call('next-template','record-template',null,null,['--unit',String(append)]);assert.ok(input.draft.startsWith('正文/V5-再议号令/'));
write(path.join(root,input.draft),'# 第48次交接\n\n阿禾核对了上一站留下的清单，在新的一页记下收件数。柜上的木匣仍由原来的值守人保管。\n');input.summary='第48站核对清单';input.changes.timeline_append=['第48站完成核对'];input.changes.characters={阿禾:'第48站'};call('next-preview','record-preview',null,input);call('next-record','record',null,input);
const before=state(),w=call('workflow','workflow','show').workflow;w.stage='revision';w.task='合成验证：迁移后修订第45、46章并回查后续';w.authorization={allowed_actions:['discuss','plan','revise'],draft_range:null,revise_range:{from:45,to:48},stop_conditions:['仅合成样本，正文改动不改变账本事实']};call('authorize-revision','workflow','set',{expected_revision:state().revision,operation_id:label+'-revision',workflow:w,author_evidence:evidence});
const b=call('begin','revision','begin',{expected_revision:state().revision,owner:label,from:45,through:48});
call('resume-one','revision','resume',{id:b.id,token:b.token});
call('rewind','rewind',null,null,['--from','45','--expected-revision',String(state(b.workspace).revision),'--revision-token',b.token],b.workspace);
call('resume-two','revision','resume',{id:b.id,token:b.token});
for(let n=45;n<=48;n++){
  const old=before.units[n-1];call('context','context',null,null,['--unit',String(n),'--max-chars','250000','--revision-token',b.token],b.workspace);
  if(n<=46)fs.appendFileSync(path.join(b.workspace,old.draft),'\n阿禾又检查了一遍纸条的编号，确认没有漏项。\n');
  const replay=call('replay-input','revision','replay-input',null,['--unit',String(n),'--revision-token',b.token],b.workspace),report=`审查/迁移后-${n}.md`;
  write(path.join(b.workspace,report),`# 合成机械复核 ${n}\n正文仅增加核对动作，未改变物件保管、交接次序或来源结论。逐项核对登记摘要、角色、时间线、账本、引文与下游范围。这是合成工具流程验证，不声明文学质量。\n`);
  replay.replay_review={reviewer:'Codex synthetic flow',report,draft_sha256:sha(fs.readFileSync(path.join(b.workspace,old.draft))),checked_fields:['summary','characters','timeline','ledger','evidence','downstream']};
  call('replay-preview','record-preview',null,replay,['--revision-token',b.token],b.workspace);call('replay-record','record',null,replay,['--revision-token',b.token],b.workspace);
  if(n===46)call('resume-three','revision','resume',{id:b.id,token:b.token});
}
const report='审查/迁移后尾段复核.md';write(path.join(b.workspace,report),'# 合成尾段复核\n第45—48章仍按顺序交接，木匣保管人和位置不变；45、46章增加核对动作，47、48章正文不变。仅验证连续性追踪、哈希与流程。\n');
call('tail-review','review',null,{from:45,to:48,kind:'model-self-review',report,source_hashes:Object.fromEntries(state(b.workspace).units.slice(44).map(u=>[u.draft,u.sha256]))},['--revision-token',b.token],b.workspace);
call('prepare','revision','prepare',{id:b.id,token:b.token});call('commit','revision','commit',{id:b.id,token:b.token});const check=call('check','check');assert.equal(check.ok,true);assert.equal(check.findings.length,0);
const after=state();for(let n=1;n<=48;n++){assert.equal(after.units[n-1].draft,before.units[n-1].draft);if(![45,46].includes(n))assert.equal(after.units[n-1].sha256,before.units[n-1].sha256);}
assert.deepEqual(after.snapshot,before.snapshot);assert.equal(after.units.length,48);call('export','export',null,null,['--out',path.join(base,label+'-export')]);
write(path.join(base,label+'-verification.json'),{ok:true,migrated_chapters:47,appended:48,edited:[45,46],replayed:[45,46,47,48],same_session_resumes:3,paths_stable:true,unmodified_body_hashes_preserved:true,snapshot_unchanged:true,existing_works_modified:false,scope:'synthetic mechanical continuity validation, not literary acceptance'});
