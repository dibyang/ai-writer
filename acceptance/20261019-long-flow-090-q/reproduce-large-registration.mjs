import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {fileURLToPath} from 'node:url';
import {initProject,savePlan,context,recordTemplate,record} from '../../lib/workspace.mjs';
const base=path.dirname(fileURLToPath(import.meta.url)),work=path.join(base,'large-registration-before');
initProject(work,'novel','预算扩容后登记验证',{legacy:true});
for(const name of ['作品定位','文风','权威规则'])fs.writeFileSync(path.join(work,'设定',name+'.md'),'# Synthetic size probe\n'+name+'\n'+'x'.repeat(350000));
savePlan(work,{unit:1,title:'单一动作',goal:'交还杯子',change:'杯子回到原处',beats:['交还杯子']});
fs.writeFileSync(path.join(work,'正文/0001.md'),'# 单一动作\n\n林照把杯子放回桌上。\n');
const full=context(work,1,2000000),before=fs.readFileSync(path.join(work,'.writer/state.json')),failures=[];
for(const [operation,fn] of [['record-template',()=>recordTemplate(work,1,'正文/0001.md')],['record',()=>record(work,{unit:1,expected_revision:full.revision,source_hashes:full.source_hashes,draft:'正文/0001.md',summary:'林照把杯子放回桌上。',snapshot:full.snapshot})]]){
  let failure;try{fn();}catch(e){failure={operation,code:e.code,message:e.message,budget:e.context_budget};}assert.equal(failure?.code,'CONTEXT_BUDGET_EXCEEDED');failures.push(failure);
}
assert.deepEqual(fs.readFileSync(path.join(work,'.writer/state.json')),before);
const result={reproduced:true,context_success_after_explicit_expansion:true,packet_chars:JSON.stringify(full).length,max_source_bytes:Math.max(...['作品定位','文风','权威规则'].map(x=>fs.statSync(path.join(work,'设定',x+'.md')).size)),state_unchanged:true,failures};
fs.writeFileSync(path.join(base,'large-registration-before.json'),JSON.stringify(result,null,2)+'\n',{flag:'wx'});console.log(JSON.stringify(result,null,2));
