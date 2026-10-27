import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const here=path.dirname(fileURLToPath(import.meta.url)), repo=path.resolve(here,'../..'), sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const legacy=path.resolve(here,'../20261024-candidate-plan-handoff-fix-aa/legacy-coordinator/.writer/tool');
const runName=process.argv[2]??'source', current=path.resolve(process.argv[3]??repo), runRoot=path.join(here,runName);
const mode=process.argv[4]??'direct',zTool=path.resolve(here,'../20261024-candidate-parent-addition-fix-z/extracted/ai-writer-0.9.0'),continuingTool=mode==='handoff'?zTool:current;
if(fs.existsSync(runRoot))throw Error('Run already exists, preserve evidence: '+runRoot);fs.mkdirSync(runRoot,{recursive:true});
const write=(root,ref,value)=>{const p=path.join(root,ref);fs.mkdirSync(path.dirname(p),{recursive:true});fs.writeFileSync(p,typeof value==='string'?value:JSON.stringify(value,null,2)+'\n');return p;};
const state=root=>JSON.parse(fs.readFileSync(path.join(root,'.writer/state.json')));
const observed=()=>({scope:'Independent acceptance files only; no actual author work or owner-token inputs read.'});
const before=observed();write(runRoot,'real-readonly-before.json',before);
// Copy only manifest-owned generic tool resources, never actual story bodies/state/token.
assert(fs.existsSync(legacy),'Read-only legacy generic tool must exist in sealed AA evidence');
let sequence=0,commandCount=0;
function cli(tool,args,expected=0){const index=++sequence;commandCount++;const result=spawnSync(process.execPath,[path.join(tool,'bin/ai-writer.mjs'),...args],{encoding:'utf8',windowsHide:true,timeout:60000,maxBuffer:16*1024*1024});
  write(runRoot,`commands/${String(index).padStart(3,'0')}.json`,{args,status:result.status,stdout:result.stdout,stderr:result.stderr,error:result.error?.message??null});if(expected===1)assert.ok(result.status!==0&&result.status!==null,result.stderr||result.stdout);else assert.equal(result.status,expected,result.stderr||result.stdout);let out;try{out=JSON.parse(result.stdout||result.stderr);}catch{out=result.stdout||result.stderr;}return out;}
function call(tool,root,command,action,input,token,expected=0){const args=[command,...(action?[action]:[]),'--project',root];if(input)args.push('--input',write(runRoot,`inputs/${++sequence}.json`,input));if(token)args.push('--revision-token',token);return cli(tool,args,expected);}
const root=path.join(runRoot,'original');let old=legacy;
cli(old,['init','--path',root,'--kind','novel','--title','桥账：独立兼容验证']);
old=path.join(root,'.writer/tool');
const author='允许独立验证作品试写六章、修订六章，并仅采纳封存的第七章候选；不切换主稿，第八章不写。';write(root,'研究/作者授权.md',author);
const evidence={quote:author,local_source:'研究/作者授权.md',source_sha256:sha(Buffer.from(author)),locator:'independent compatibility test, not actual author approval',recorded_by:'Codex synthetic fixture'};
function workflow(tool,work,mode,token){const w=call(tool,work,'workflow','show').workflow;w.stage=mode==='revise'?'revision':'trial';w.task='独立接口验证';w.authorization={allowed_actions:['discuss','plan',mode],draft_range:mode==='draft'?{from:1,to:7}:null,revise_range:mode==='revise'?{from:1,to:6}:null,stop_conditions:['只在独立验证作品内操作，第八章不写']};return call(tool,work,'workflow','set',{expected_revision:state(work).revision,operation_id:`phase-${++sequence}`,author_evidence:evidence,workflow:w},token);}
workflow(old,root,'draft');
function chapter(work,n,token,revised=false){const draft=`正文/${String(n).padStart(4,'0')}.md`;call(old,work,'plan',null,{unit:n,title:`桥账${n}`,goal:'核对交接',change:'留下回执',beats:['交接回执'],cast:['阿禾'],setting_refs:[],research_refs:[]},token);const input=cli(old,['record-template','--project',work,'--unit',String(n),'--draft',draft]);write(work,draft,`# 第${n}章\n\n阿禾走到第${n}处桥头，把回执压在桌边。${revised?'他核对了前一次写漏的日期。':'他请守桥人核对日期。'}\n守桥人没有替他签名，只把账册推过来。阿禾看清数目，再把回执收进布包。\n`);input.summary=`阿禾在第${n}处桥头核对回执日期。`;input.changes.characters={阿禾:`在第${n}处桥头，回执在布包`};input.changes.timeline_append=[`第${n}次核账`];call(old,work,'record',null,input,token);}
for(let n=1;n<=6;n++){chapter(root,n);console.log(`legacy main ${n}/6`);}
call(old,root,'plan',null,{unit:7,title:'继承的旧未登记计划',goal:'旧目标',change:'待写',beats:['待确认'],cast:[],setting_refs:[],research_refs:[]});
workflow(old,root,'revise');const branch=call(old,root,'revision','begin',{expected_revision:state(root).revision,owner:'legacy-six-chapters',from:1,through:6});
cli(old,['rewind','--project',branch.workspace,'--from','1','--expected-revision',String(state(branch.workspace).revision),'--revision-token',branch.token]);
for(let n=1;n<=6;n++){chapter(branch.workspace,n,branch.token,true);console.log(`legacy candidate ${n}/6`);}
workflow(old,branch.workspace,'draft',branch.token);
const pending='.writer/drafts/pending/0007.md',audit='.writer/drafts/pending/准备.md';write(branch.workspace,pending,'# 第七章\n\n昨夜回家时阿禾还急得坐不住，父亲一直记着。到早晨，他慢慢把回执压平。\n“没有那么急。”阿禾说。\n父亲把干净衣服叠好，替灯添油。\n“明日先去桥头找守桥人，带上回执。”父亲说。\n下一回去桥头，该带什么、先找谁，他也已问清。\n');write(branch.workspace,audit,'合成准备附件：清晨父子交代明日手续，明日尚未行动。');write(branch.workspace,'大纲/第七章依据.md','阿禾带回回执，在家与父亲交代明日先找守桥人并带回执；保留父亲叠衣添灯。');
assert.equal(call(old,branch.workspace,'plan',null,{unit:7,title:'明日核账',goal:'核对回执',change:'约定明日',beats:['交回执'],cast:['阿禾'],setting_refs:[],research_refs:['大纲/第七章依据.md']},branch.token,1).code,'REVISION_SCOPE_INVALID');
const refs=['writer.json','正文/0006.md','大纲/第七章依据.md','研究/作者授权.md',audit], manifest={nature:'pending-draft-source-manifest-not-official-record-template',revision:state(branch.workspace).revision,source_hashes:Object.fromEntries(refs.map(ref=>[ref,sha(fs.readFileSync(path.join(branch.workspace,ref)))]))};
const manifestRef='.writer/drafts/prewriting.json';write(root,manifestRef,manifest);
const addedRef='大纲/未消费第七章规划.md',addedBytes=fs.readFileSync(path.join(branch.workspace,audit));write(root,addedRef,addedBytes.toString('utf8'));
const originalBaseRef=`.writer/revisions/${branch.id}/base.json`,originalBaseSha=sha(fs.readFileSync(path.join(root,originalBaseRef)));
const inventory=work=>{const out={};const visit=rel=>{for(const name of fs.readdirSync(path.join(work,rel)).sort()){const ref=rel?rel+'/'+name:name;if(ref==='.writer/revisions')continue;const p=path.join(work,ref);if(fs.statSync(p).isDirectory())visit(ref);else out[ref]=sha(fs.readFileSync(p));}};visit('');return out;};
const mainBefore=inventory(root),candidateBefore=inventory(branch.workspace),oldSession=sha(fs.readFileSync(path.join(root,`.writer/revisions/${branch.id}/session.json`)));
const request={expected_revision:state(branch.workspace).revision,expected_state_sha256:sha(fs.readFileSync(path.join(branch.workspace,'.writer/state.json'))),expected_session_sha256:oldSession,token:branch.token,target:path.join(runRoot,mode==='handoff'?'stuck':'derived'),owner:'new-independent-continuation',unit:7,author_evidence:evidence,draft:pending,draft_sha256:sha(fs.readFileSync(path.join(branch.workspace,pending))),manifest:{root:'parent',ref:manifestRef,sha256:sha(fs.readFileSync(path.join(root,manifestRef))),audit_only_refs:[audit]}};
assert.equal(call(continuingTool,branch.workspace,'revision','continue',request,undefined,1).code,'BASELINE_CONFLICT');assert.equal(fs.existsSync(request.target),false);
request.acknowledged_parent_additions=[{ref:addedRef,sha256:sha(addedBytes),manifest_ref:audit}];
let derived=call(continuingTool,branch.workspace,'revision','continue',request),stuck=null,stuckBefore=null,stuckParentBefore=null,handoffInput=null;
if(mode==='handoff'){
  stuck=derived;write(runRoot,'stuck.json',stuck);call(zTool,stuck.workspace,'plan',null,{unit:7,title:'明日核账',goal:'核对回执',change:'约定明日',beats:['交回执'],cast:['阿禾'],setting_refs:[],research_refs:['大纲/第七章依据.md']},stuck.token);assert.equal(cli(zTool,['context','--project',stuck.workspace,'--unit','7']).unit,7);
  assert.equal(call(zTool,stuck.workspace,'revision','adopt',{unit:7,expected_revision:state(stuck.workspace).revision,draft:'正文/0007.md'},stuck.token,1).code,'CONTINUATION_PREFIX_CHANGED');assert.equal(fs.existsSync(path.join(stuck.workspace,'正文/0007.md')),false);
  stuckBefore=inventory(stuck.workspace);stuckParentBefore=inventory(stuck.parent);handoffInput={token:stuck.token,expected_revision:state(stuck.workspace).revision,expected_state_sha256:sha(fs.readFileSync(path.join(stuck.workspace,'.writer/state.json'))),expected_session_sha256:sha(fs.readFileSync(path.join(stuck.parent,`.writer/revisions/${stuck.id}/session.json`))),expected_base_sha256:sha(fs.readFileSync(path.join(stuck.parent,`.writer/revisions/${stuck.id}/base.json`))),expected_plan_sha256:sha(fs.readFileSync(path.join(stuck.workspace,'大纲/单元/0007.json'))),target:path.join(runRoot,'derived'),owner:'protected-handoff',reason:'旧Z包官方plan7/context成功但adopt拒绝，独立接管验证'};
  derived=call(current,stuck.workspace,'revision','continue-repair',handoffInput);
}
write(runRoot,'derived.json',derived);assert.deepEqual(state(derived.workspace).units,state(branch.workspace).units);assert.deepEqual(state(derived.workspace).snapshot,state(branch.workspace).snapshot);
const derivedBase=JSON.parse(fs.readFileSync(path.join(derived.parent,`.writer/revisions/${derived.id}/base.json`))),ack=derivedBase.continuation.parent_inventory_acknowledgment;assert.equal(ack.acknowledged_additions[0].manifest_ref,audit);assert.equal(fs.existsSync(path.join(derived.workspace,addedRef)),false);
assert.equal(call(old,derived.workspace,'plan',null,{unit:7,title:'旧构建不得写入',goal:'测试',change:'测试',beats:['测试'],cast:[],setting_refs:[],research_refs:[]},derived.token,1).code,'TOOL_BUILD_CHANGED');
call(current,derived.parent,'revision','resume',{id:derived.id,token:derived.token});
call(current,derived.workspace,'plan',null,{unit:7,title:'明日核账',goal:'核对回执',change:'约定明日',beats:['交回执'],cast:['阿禾'],setting_refs:[],research_refs:['大纲/第七章依据.md']},derived.token);
assert.equal(cli(current,['context','--project',derived.workspace,'--unit','7']).unit,7);
const adopted=call(current,derived.workspace,'revision','adopt',{unit:7,expected_revision:state(derived.workspace).revision,draft:'正文/0007.md'},derived.token);
assert.equal(sha(fs.readFileSync(path.join(derived.workspace,'正文/0007.md'))),request.draft_sha256);
adopted.summary='阿禾在家压平回执，父亲交代明日带回执先找守桥人，叠好衣服并添灯。';adopted.changes.characters={阿禾:'在家，回执在手，知道明日先找守桥人',父亲:'在家，交代明日手续，叠衣添灯'};adopted.changes.timeline_append=['第七章清晨父子交代明日手续，尚未发生明日行动'];
const report='审查/第七章采纳合成绑定.md';write(derived.workspace,report,'# 合成源候选登记绑定\n\n仅为建立旧AA已登记七章的CLI夹具，不冒充模型文学实读或真实作品验收。最终新包流程另行实际阅读旧六七章及修订稿，记录判断。\n');adopted.draft_review={reviewer:'synthetic-bootstrap-fixture',report,draft_sha256:request.draft_sha256,report_sha256:sha(fs.readFileSync(path.join(derived.workspace,report)))};
assert.equal(call(current,derived.workspace,'record-preview',null,adopted).ok,true);call(current,derived.workspace,'record',null,adopted,derived.token);
for(const [index,issues]of [[1,[{id:'I_COMPARE',type:'readability',severity:'minor',confidence:'high',statement:'比较对象省略',suggestion:'明确比较昨夜',evidence:[{unit:7,quote:'没有那么急'}]},{id:'I_TAIL',type:'optional_style',severity:'suggestion',confidence:'high',statement:'尾句重复手续',suggestion:'按本次限定修订删除尾句',evidence:[{unit:7,quote:'下一回去桥头，该带什么、先找谁，他也已问清。'}]}]],[2,[]]]){const reviewReport=`审查/源旧稿合成报告-${index}.md`;write(derived.workspace,reviewReport,'合成旧版本报告，仅测试旧AA源候选登记及过期报告保护，不作为实际文学验收。');const review=call(current,derived.workspace,'review',null,{from:6,to:7,kind:'model-self-review',report:reviewReport,source_hashes:Object.fromEntries(state(derived.workspace).units.slice(5).map(u=>[u.draft,u.sha256])),expected_revision:state(derived.workspace).revision,operation_id:`old-seven-${index}`,issues},derived.token);write(runRoot,`old-review-${index}.json`,review);}
call(current,derived.parent,'revision','resume',{id:derived.id,token:derived.token});assert.equal(cli(current,['check','--project',derived.workspace]).ok,true);
assert.equal(cli(current,['context','--project',derived.workspace,'--unit','8'],1).code,'ACTION_OUT_OF_SCOPE');
for(const action of ['prepare','commit'])assert.equal(call(current,derived.parent,'revision',action,{id:derived.id,token:derived.token},undefined,1).code,'CONTINUATION_PUBLICATION_BLOCKED');
const legacyCheck=cli(old,['check','--project',branch.workspace]);assert.equal(legacyCheck.ok,true);
assert.deepEqual(state(derived.workspace).units.slice(0,6),state(branch.workspace).units);assert.deepEqual(inventory(root),mainBefore);assert.deepEqual(inventory(branch.workspace),candidateBefore);assert.equal(sha(fs.readFileSync(path.join(root,`.writer/revisions/${branch.id}/session.json`))),oldSession);
const after=observed();assert.deepEqual(after,before);write(runRoot,'real-readonly-after.json',after);
assert.equal(sha(fs.readFileSync(path.join(root,originalBaseRef))),originalBaseSha);assert.equal(sha(fs.readFileSync(path.join(root,addedRef))),sha(addedBytes));
if(stuck){assert.deepEqual(inventory(stuck.workspace),stuckBefore);assert.deepEqual(inventory(stuck.parent),stuckParentBefore);assert.equal(sha(fs.readFileSync(path.join(stuck.parent,`.writer/revisions/${stuck.id}/session.json`))),handoffInput.expected_session_sha256);assert.equal(sha(fs.readFileSync(path.join(stuck.parent,`.writer/revisions/${stuck.id}/base.json`))),handoffInput.expected_base_sha256);write(runRoot,'handoff-verification.json',{ok:true,old_z_failure_reproduced:true,old_derived_unchanged:true,old_coordinator_unchanged:true,old_session_unchanged:true,old_base_unchanged:true,current_plan_copied:true,handoff:derived.handoff});}
write(runRoot,'parent-addition-verification.json',{ok:true,original_base_unchanged:true,original_added_file_unchanged:true,original_base_sha256:originalBaseSha,acknowledged:request.acknowledged_parent_additions,stored_acknowledgment:ack,private_audit_not_promoted_to_public_source:true});
write(runRoot,'verification.json',{ok:true,commands:commandCount,steps:sequence,units:state(derived.workspace).units.length,original_main_unchanged:true,original_candidate_unchanged:true,original_session_unchanged:true,real_observed_files_unchanged:true,preserved_prefix:true,prewriting_manifest_unchanged:sha(fs.readFileSync(path.join(root,manifestRef)))===request.manifest.sha256,draft_sha256:request.draft_sha256,tool:current,limits:'Independent short fixture; mechanical compatibility plus Codex sample reading, not real novel registration or literary acceptance.'});console.log('verified '+runRoot);
