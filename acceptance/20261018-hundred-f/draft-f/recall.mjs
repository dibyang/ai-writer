import {session} from '../session-support.mjs';
const s=session('draft-f');
for(const query of ['椅','P_QIU','P_SELF_PAGE','T_PRIVATE']){const r=s.run('recall-'+({椅:'chair',P_QIU:'qiu',P_SELF_PAGE:'self-page',T_PRIVATE:'private'}[query]),['recall','--query',query],{entry:'embedded'});s.write('recall-'+({椅:'chair',P_QIU:'qiu',P_SELF_PAGE:'self-page',T_PRIVATE:'private'}[query])+'.json',r.value);console.log(JSON.stringify(r.value));}
const r=s.run('review-template-97-103',['review-template','--from','97','--to','103'],{entry:'embedded'});s.write('review-template-97-103.json',r.value);console.log(JSON.stringify(r.value));
