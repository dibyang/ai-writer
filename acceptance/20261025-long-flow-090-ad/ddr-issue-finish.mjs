import {fs,path,base,project,state,save,log,assert} from './c-utils.mjs';
const action=process.argv[2];assert(['apply','verify'].includes(action));
const s=state(),x={expected_revision:s.revision,operation_id:'ad-dr-speaker58-'+action+'-r'+s.revision,id:'I_AD_DR58_SPEAKER'};
if(action==='apply'){x.commit_id=log('ddr-revision-commit').transaction_id;x.reason='原已采纳意见经独立revision 6fa1ada9-fcb9-4f06-abd3-cfcf0fff7693只改58问话人沈禾为沈成林，58—60全章六字段重登、28页完整尾段复核后已完成真实本地writer事务；59/60正文未变。';}
else{x.review_ref=log('ddr-final-review55-60').ref;x.reviewer='Codex 同ID模型知情复核';x.conclusion='resolved';x.reason='55—60完整56页连读发现该处父问女答误署，修后58—60全部登记后再次完整连读28页；当前58为沈成林问/他自笑/她答老板，知识无漂移。主稿55—60与实际已读当前SHA逐项相同，当前有效六章review包含逐章五功能及重复代价/差异。本次仅修该处一次，未对原意见另造第二次修改，未把可选风格建议升必改。';}
const ref='.writer/drafts/ad-dr-speaker58-'+action+'.json';save(ref,x);console.log(JSON.stringify({ok:true,action,input:path.join(project,ref),revision:s.revision}));
