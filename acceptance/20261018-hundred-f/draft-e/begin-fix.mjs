import {session} from '../session-support.mjs';
const s=session('draft-e'),st=s.state();
const workflow={...st.governance,stage:'revision',task:'101—103已首登；98—103实读确认102一处动作搭配，按当前实跑授权仅修102并保守重登至当前末103，不改1—100；随后暂停复盘。',authorization:{allowed_actions:['discuss','plan','revise'],draft_range:null,revise_range:{from:102,to:103},stop_conditions:['仅102最小语言修订，103完整实读核后重登；完成尾段复核和当前review即暂停。','不写104、不改1—100或四处砖词。']}};
console.log(s.run('authorize-local-fix',['workflow','set'],{input:{expected_revision:st.revision,operation_id:'f-e-fix-102-through-103-20261018',author_evidence:s.evidence(),workflow},entry:'embedded'}).value);
const r=s.run('revision-begin-fix',['revision','begin'],{input:{expected_revision:s.state().revision,owner:'actual-Codex-draft-e-authorized-local-language-fix',from:102,through:103},entry:'embedded'});s.write('revision-local.json',r.value);console.log(r.value);
const q=session('draft-e',{project:r.value.workspace,token:r.value.token});
const h=q.run('rewind-help',['rewind','--help']);console.log(h.value);
