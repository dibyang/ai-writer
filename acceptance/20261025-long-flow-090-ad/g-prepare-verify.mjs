import fs from'node:fs';import path from'node:path';import assert from'node:assert/strict';import{fileURLToPath}from'node:url';
const A=path.dirname(fileURLToPath(import.meta.url)),P=path.join(A,'scenario','东岸末班船-60章独立验证'),[label,id]=process.argv.slice(2);
const reasons={
I_AD_F21_DISTANCE:'同ID当前60章完整知情报告：9面摊只隔两家门面、21当前送过去只隔两家门面、42廖隔着几步问吃不吃相容；17修鞋人/40料店两条街为别处。保留9/21/42三证、原采用、原commit及事务，仅21正文实际变化，9未变参考、42原文未变重登。',
V_A_U5_TIME_METADATA:'当前4首日清晨约当晚18:30，5同日晚量柜，6回切同日16点；核完整4—6正文及当前summary/timeline，追踪首日与正文相符。原tracking应用与commit不动，不二次apply。',
I_F19_TITLE_TIME:'当前19正文标题为提前的一个半钟头，14:30相对原16点提前1.5小时，值班14:30—17共2.5小时；旧文件名保留不作现标题。原应用/commit不动。',
I_X_DR36_BOOK_KNOWLEDGE:'当前35女孩实买14花册，沈18册未买；36先口述给母，再沈告父未买，父原8册才取来读，父未先知。全60上下文及原应用保持。',
I_AC_B_42_GLASSES_TARGET:'当前42父亲眼镜在本人领口，沈提醒低头；对照父女动作及前后文无对象错置。保留原应用、commit及origin/resolution。',
I_AC_B_42_TYPO_KONGPA:'当前42恐怕字形及句意正确；全章话轮自然，原错字不恢复。原同commit应用不动，不二次apply。',
I_AC_C45_MEAL_DISH:'当前45为一小饭盒加菜浅碟，父先吃一只馒头；46余一馒头与最后整芋分父女，无额外二碟。核43—47购买、分份、携回、热食链，原应用保持。',
I_AD_AR51_HE_TITLE:'当前51女孩称何师傅，人物为男同事；只告旧灯取回未修/无费，49—54灯与人物知情链一致。保留原应用和commit。',
I_AD_DR58_SPEAKER:'当前58明确沈成林问老板怎么说，沈禾听出父问结果再作回答；不是沈自问自答。核整章父读报/沈店事互听及59衔接，原应用不动。'
};assert(reasons[id]);assert(/^[a-z][a-z0-9-]*$/.test(label));
const s=JSON.parse(fs.readFileSync(path.join(P,'.writer/state.json'))), review=JSON.parse(fs.readFileSync(path.join(A,'cli-logs/g-current-full-review/stdout.txt')));
const input={expected_revision:s.revision,operation_id:`${label}-current60-r${s.revision}`,id,review_ref:review.ref,reviewer:'Codex原生同ID G两程完整387页知情自检',conclusion:'resolved',reason:reasons[id]+' 本报告1—30来自同ID首程143页，31—60来自本次244页；非真人/盲读/市场或作者定稿。'};
fs.writeFileSync(path.join(A,`${label}-input.json`),JSON.stringify(input,null,2)+'\n',{flag:'wx'});console.log(JSON.stringify({input:`${label}-input.json`,expected_revision:s.revision,id,review_ref:review.ref}));
