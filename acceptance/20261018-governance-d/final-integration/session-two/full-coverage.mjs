import fs from 'node:fs';
import {dir,work,read,state,save,hash,input,run,snapshot,evidence} from './ops.mjs';
import {chapterFunctions,comparison} from './review-data.mjs';
const v=run('62-full-current-template',['review-template','--from','1','--to','6','--out','.writer/drafts/native-d-two-full-current.json']);delete v.output;
const report='审查/D批最终六章当前版本连读.md';
save(work+'/'+report,'# D批最终当前六章连续实读\n\nsynthetic acceptance；native-d-two知情模型实际在A提交及第一次暂停后，重新按1–6顺序完整读当前主稿（46/50/44/38/34/44行），不是拼接旧报告，也不是独立盲读。\n\n'+JSON.stringify(v.source_hashes,null,2)+'\n\n第一章老邵暂存箱、钥匙和簿，蓝布仅可见观察，伞的误怪未说开；第二章原清单缺年月去处，只留抄纸，未交箱、费用等母亲；第三章防潮合作、徐兰一行方向未知、约明早八点半，收好借物簿是本次唯一控制改句，不加新位置；第四章老邵承认混箱后才解释方向和开箱，蓝布针法/余料有限解释，纸样用途未定，旧簿由他带走；第五章周梅决定只记拿走的，纸样回箱、钥匙由林禾布袋抽屉暂管，正确句“林禾把钥匙放回布袋里，收紧袋口，搁进自己柜台下的抽屉。”未复发重复字；第六章签单、实际接钥匙、试锁、移箱并串圈后保管在周梅，林禾承认旧伞误怪，关系有限修复。\n\n观察与后续解释分开，老邵不是全知证人，第三章不可预知纸样，六章末箱/钥匙/纸样在周梅，原簿老邵，签单林禾。留镇、费用、用途与复制及from7候选核查仍未定；候选备忘没有改过去，也没有确认下一卷、扩店或经营安排。\n\nD_OPTIONAL_CLARITY_01已经通过真实A提交和apply落实，只是对象称谓的工程控制，不声称文学净收益或必改。旧NATIVE_C_READABILITY_01沿用原实际修复application，在此新版本实读重核；保留NATIVE_C_STYLE_02，延期NATIVE_C_PACING_03，不混作修复。\n\n第三、五、六章共同行动后日常收束相似，但防潮分饭、清点主动权和交接旧歉各有不同收益。第一章结尾保留作者原选择；不凭相似结构增加强冲突。\n\n真人语言别扭句\n\n真人语言硬问题：没有\n\n风格偏好观察：可选称谓澄清未证实文学收益。自然复述、主谓动宾、具体动作与默读改口核对没有构成新的高置信阅读损害；未做真人或声学朗读测试。\n\n本报告为当前覆盖补登；历史失效报告和原意见历史保留。结构化功能/引文均来自本次实读；工具只核字节及记录，不证明语义或文学质量。没有真人盲读、市场验证、全书文学验收、作者定稿或发布。完成后仍正文暂停、只讨论规划。\n');
v.operation_id='native-d-two-full-current-review';v.report=report;v.chapter_functions=chapterFunctions(1,6);v.comparison=comparison;v.issues=[];
const r=run('63-full-current-review',['review','--input',input('full-current-review',v)]);save(dir+'/full-current-review-result.json',r);
for(const [label,id] of [['64-full-verify-optional','D_OPTIONAL_CLARITY_01'],['65-full-reverify-typo','NATIVE_C_READABILITY_01']]){
 const why=id==='D_OPTIONAL_CLARITY_01'?'当前主稿完整六章顺读确认只改第三章对象名称，工程控制实际落实，文学收益仍可选且未证。':'当前主稿完整六章顺读确认第5章重复里未复发，沿用原真实修复application；新第3章依赖与后续保管一致，不伪造新修复。';
 save(dir+'/'+label+'-result.json',run(label,['review-issues','verify','--input',input(label,{expected_revision:state().revision,operation_id:'native-d-two-'+label,id,review_ref:r.ref,reviewer:'native-d-two Codex; complete current-six informed model reading',conclusion:'resolved',reason:why})]));
}
const quote=fs.readFileSync(work+'/研究/D批修订授权原话.md','utf8').split('\n')[4];
save(dir+'/final-paused-result.json',run('66-final-paused',['workflow','set','--input',input('final-paused',{expected_revision:state().revision,operation_id:'native-d-two-final-paused',author_evidence:evidence('研究/D批修订授权原话.md',quote),workflow:state().governance})]));
run('67-final-refuse-context-7',['context','--unit','7','--purpose','draft'],{expected:2});
run('68-final-refuse-template-7',['record-template','--unit','7','--draft','正文/0007-未授权工程探针.md'],{expected:2});
for(const [label,args] of [['69-final-status',['status']],['70-final-check',['check']],['71-final-doctor',['doctor']],['72-final-discussion',['context','--purpose','discussion']],['73-final-issues',['review-issues','list']]])save(dir+'/'+label+'-parsed.json',run(label,args));
snapshot('final-delivery');
