import path from 'node:path';import {W,write,json,run} from './final-b-run.mjs';
const x=json(path.join(W,'.writer/drafts/final-b-review-1-3-before.json'));
const data=[
 [1,{goal:['将不明来路箱子安置并弄清取还要求','我爸叫我来拿箱子。'],obstacle:['送箱与受托接收没有对上，电话未接','老梁下午只叫我来修门，没提这个。'],choice:['先听真实借用人并待授权，不直接交箱','那就等到九点十分。'],consequence:['箱仍临管，约到21:10回电','铁箱仍放在伸手能碰到的矮桌上。'],relationship_change:['沈禾不希望父亲被记丢失，许蓉说明记录为找人接上','我记下，等人接上就好找。']}],
 [2,{goal:['按约联系梁伯，核收还和退款安排','老梁，九点十分了，底联找着没？'],obstacle:['钱和两联在铺，箱在码头，沈禾另有备货单期限','钱在铺里借具本最后夹的袋子里，袋面写着你爸名字。'],choice:['周岸接受委托实际送单取物往返，许蓉留灯看箱','先把她的单子送过去，再进铺。九点四十前回来。'],consequence:['原单按时送达，箱钱仍待验交','原单收到 周师傅送的 明早按新的做 你别再跑店里了'],relationship_change:['沈禾不再替未点过的箱保证完整，许蓉陪她等具体核对','等照单看。']}],
 [3,{goal:['按清单验收原箱、退押金给凭据','你帮我念，念一个拿一个。'],obstacle:['八件须真点，锤柄浅缝需原主核问','这个要算坏的吗？'],choice:['不先认损，发照片获梁伯来电后再收，实给钱','我先问一句。'],consequence:['箱实际换手、80元实给、两联分开并带回','周岸等她点头，才将四张钞票拢齐，放进她摊开的手掌。'],relationship_change:['沈禾愿替父问清又坚持家用车不外借，回家照料保持边界','梁伯说他换。你坐稳，我去盛。']}]
];
x.chapter_functions=data.map(([unit,fields])=>({unit,...Object.fromEntries(Object.entries(fields).map(([k,[text,quote]])=>[k,{status:'observed',text,evidence:[{unit,quote}]}]))}));
x.operation_id='final-b-readback-1-3-r8';x.report='审查/final-b-0001-0003-连读.md';
x.comparison={similar_structures:[{units:[1,2,3],judgment:'三章都以电话/纸据校正不完整传话，功能相似不等于重复。',differences:'第1章找来路与借用人，第2章取可执行的代收退款授权且实际送单，第3章核器物状态、作交付选择并完成箱钱据动作。',preserve:'保留前章不擅接箱与后章实际验收的因果，不补犯罪反转。',optional_adjustments:[],uncertainty:'知情模型自审；没有真实读者节奏反馈。',evidence:[{unit:1,quote:'那就等到九点十分。'},{unit:2,quote:'对。你替我把这一箱收回来。'},{unit:3,quote:'“我交给你了，梁家这箱。”'}]}],distinct_gains:['第1章把谁借谁还说清，并留下具体联系时间。','第2章改变可执行安排并送达原单，保留实交义务。','第3章通过点具/核缝/交箱退钱分联兑现跨卷，生活未全解决。'],preserve:['许蓉先安置、周岸不擅定账、沈禾快问但肯承担的区别。','不全知叙事、原白漆观察、家用小车边界和柜门仍在墙边。'],optional_adjustments:['整篇整理物件偏细，可作为日后节奏选择；本轮不自动改。'],limits:'第3章登记后按顺序完整重读第1章1—281、第2章1—164、第3章1—243行，全部正文SHA见source_hashes；不是盲读或修后尾段复核。'};
write(path.join(W,'.writer/drafts/final-b-review-1-3-valid.json'),x);
run('17-review-three',['review','--input','.writer/drafts/final-b-review-1-3-valid.json']);
run('18-check-three',['check']);
