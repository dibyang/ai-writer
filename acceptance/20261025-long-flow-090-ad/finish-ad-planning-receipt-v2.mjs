import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';import assert from 'node:assert/strict';import {fileURLToPath} from 'node:url';
const base=path.dirname(fileURLToPath(import.meta.url)),sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const project=JSON.parse(fs.readFileSync(path.join(base,'project.json'))).project;
const stateFile=path.join(project,'.writer/state.json'),stateSha=sha(fs.readFileSync(stateFile));
const reportPath=path.join(base,'ad-planning.json'),handoffPath=path.join(base,'交接-规划完成.md');
const report=JSON.parse(fs.readFileSync(reportPath));
assert.equal(report.final.revision,264);assert.equal(report.read_coverage.current_pages,49);
fs.copyFileSync(reportPath,path.join(base,'ad-planning-before-receipt-failure.json'),fs.constants.COPYFILE_EXCL);
fs.copyFileSync(handoffPath,path.join(base,'交接-规划完成-回执失败前.md'),fs.constants.COPYFILE_EXCL);
const failure={kind:'auxiliary-receipt-generation-error',script:'finalize-ad-planning.mjs',exit_code:1,error:'ReferenceError: protected_state is not defined',location:'line 82 receipt object',effect:'全部核验断言已通过，ad-planning.json及交接已保存；仅最后回执未创建。没有state/正文/来源改动。',correction:'保留原失败脚本及两份失败前证据，由finish-ad-planning-receipt-v2.mjs补记后生成回执；不重跑独占写入生成脚本。'};
report.failures_and_limits.push(failure);report.receipt_recovery={script:'finish-ad-planning-receipt-v2.mjs',state_sha256:stateSha,original_artifacts_preserved:true};
fs.writeFileSync(reportPath,JSON.stringify(report,null,2)+'\n');
fs.appendFileSync(handoffPath,'\n## 回执辅助失败与恢复\n\nfinalize-ad-planning.mjs最后生成回执时退出1：ReferenceError: protected_state is not defined（第82行）。此前681项字节、受保护状态、92页覆盖、正式文件/CLI核验断言均已通过；ad-planning.json与本交接已写成，只有回执未创建。原失败脚本保留，两份原证据另存ad-planning-before-receipt-failure.json及交接-规划完成-回执失败前.md。finish-ad-planning-receipt-v2.mjs补记真实失败并生成回执，没有重跑/覆盖正式规划，没有改变state、正文或来源。此为验收辅助脚本变量名错误，不是当前writer工具缺陷。\n');
for(const x of report.source_manifest){assert.equal(sha(fs.readFileSync(path.join(project,x.ref))),x.sha256,'source changed '+x.ref);}
for(const x of report.checkpoint_byte_checks){assert.equal(sha(fs.readFileSync(path.join(project,x.ref))),x.sha256,'checkpoint changed '+x.ref);}
assert.equal(sha(fs.readFileSync(stateFile)),stateSha,'state changed during receipt recovery');
const receipt={ok:true,at:new Date().toISOString(),artifacts:['ad-planning.json','交接-规划完成.md'].map(ref=>{const b=fs.readFileSync(path.join(base,ref));return {ref,bytes:b.length,sha256:sha(b)};}),old_checkpoint_files:681,old_files_unchanged:true,protected_state:report.protected_state,old_issues_unchanged:true,body_pages:92,current_pages:49,old_pages:43,command_count:report.command_audit.length,cli_failures:0,auxiliary_failures:report.failures_and_limits.filter(x=>/error/.test(x.kind)).length,final_revision:264,new_prose:false,state_sha256:stateSha,recovered_auxiliary_failure:failure};
fs.writeFileSync(path.join(base,'ad-planning-final-receipt.json'),JSON.stringify(receipt,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({ok:true,revision:264,units:48,checkpoint_files:681,body_pages:92,current_pages:49,old_pages:43,command_count:report.command_audit.length,all_cli_success:true,old_issues_unchanged:true,state_changes:report.actual_top_level_state_changes,budget:report.budget_diagnosis.map(x=>({unit:x.unit,selected_file_chars:x.selected_file_chars,runtime_budget_tested:false})),handoff:'交接-规划完成.md',receipt:'ad-planning-final-receipt.json',failure_preserved:true},null,2));
