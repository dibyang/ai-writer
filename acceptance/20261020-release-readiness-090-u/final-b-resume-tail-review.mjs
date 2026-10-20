import path from 'node:path';import {U,W,write,json,run} from './final-b-run.mjs';
const s=json(path.join(U,'final-b-revision-session.json'));const B=s.workspace;const x=json(path.join(B,'.writer/drafts/final-b-resume-tail-review-before.json'));
const data=[
 [2,{goal:['核真正受托收还及退款安排','老梁，九点十分了，底联找着没？'],obstacle:['钱袋/还箱单在铺里，箱在码头，另有送单期限','钱在铺里借具本最后夹的袋子里，袋面写着你爸名字。'],choice:['明确委托后实际去送单取物，留箱候船室','先把她的单子送过去，再进铺。九点四十前回来。'],consequence:['原单按时送到，箱钱仍等待验收','原单收到 周师傅送的 明早按新的做 你别再跑店里了'],relationship_change:['沈禾接受具体安排但不替未点过的箱保证完整','等照单看。']}],
 [3,{goal:['真实清点并交箱退款给据','你帮我念，念一个拿一个。'],obstacle:['八件需真点，旧锤柄缝需问原主','这个要算坏的吗？'],choice:['先照片核实而不认损或擅免，再点交现金','我先问一句。'],consequence:['箱转周岸、80元点给沈禾、两纸带回家','周岸等她点头，才将四张钞票拢齐，放进她摊开的手掌。'],relationship_change:['父女只在一顿家常饭中互相让位，旧事不被解释','那扇拆下来的柜门还靠在墙边，父亲伸手拉了拉椅子，让她坐得宽一些。']}]
];
x.chapter_functions=data.map(([unit,fields])=>({unit,...Object.fromEntries(Object.entries(fields).map(([k,[text,quote]])=>[k,{status:'observed',text,evidence:[{unit,quote}]}]))}));
x.operation_id='final-b-resume-final-tail-2-3-r13';x.report='审查/final-b-resume-0002-0003-最终尾段连读.md';
x.comparison={similar_structures:[{units:[2,3],judgment:'两章均用电话/纸据核清信息，不能据此判作无收益重复。',differences:'第2章使代收退钱安排可执行且实际送原单，第3章核实工具状态并真正交付箱钱据。',preserve:'保留周岸不擅定账、许蓉安置又按时关门、沈禾快问但不代保证的选择差异。',optional_adjustments:[],uncertainty:'知情模型实读，尚无F全新会话或真实读者节奏反馈。',evidence:[{unit:2,quote:'对。你替我把这一箱收回来。'},{unit:3,quote:'“我交给你了，梁家这箱。”'}]}],distinct_gains:['第2章口述安排转成授权和实际往返，原单得到送达确认。','第3章照单点齐后完成交箱、80元和两联各自归位，白漆实际跨卷使用。'],preserve:['35元维修与80元押金独立，月底未付，原观察三项不变。','小车不外借、柜门未装、父亲旧事未知的有限后果。'],optional_adjustments:['物件整理偏细、照片快语补清及饼干计量词仅作后续F观察，不在本轮自动修改。'],limits:'第3章重登后以最终SHA按2→3完整实读2章1—164与3章1—243行；第1章仅回看1—15行观察锚点。未冒充完整1—3新鲜审查、真人盲读或F验收。'};
write(path.join(B,'.writer/drafts/final-b-resume-tail-review-valid.json'),x);
run('40-record-final-tail-review',['review','--input','.writer/drafts/final-b-resume-tail-review-valid.json','--revision-token',s.token],B);
run('41-check-final-branch',['check'],B);
