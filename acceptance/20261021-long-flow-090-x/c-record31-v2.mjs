import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';import {fileURLToPath} from 'node:url';
const P=path.join(path.dirname(fileURLToPath(import.meta.url)),'scenario','东岸末班船-再扩展验证');
const t=JSON.parse(fs.readFileSync(path.join(P,'.writer/c-inputs/record31-final-v1.json'),'utf8'));
t.changes.ledger.P_X_OWN_TROUSERS.character_known={
 '许蓉女儿':'30亲补里薄片/外灰线、夜穿坐放纸手平；31自己实穿半天/午间取纸手未挂，只发偏黄袖照/文字给沈，钥匙仍包，未洗。',
 '许蓉':'30夜亲摸里片/看外缝并见女穿坐、听本人课堂转述；31又晨见穿出门，未现场她半天工作。',
 '沈禾':'30文字知里薄片/外线合及夜坐试手平；31又收本人文字穿半天取纸手不挂，照看清黄袖饭盒、裤未看清，始终非亲见摸。'
};
t.changes.ledger.T_X_TEA_AFTER_WORK.character_known={
 '周岸':'25定周四14—16，26改另一房门至周六8:30、30对纱门客户说明朋友时段；31已发仍两点，亲收廖回家/两毛巾/勿带物及饭照玩笑，自己关铺到赴约途中，没见廖收摊备茶。',
 '面摊主':'25邀/26亲准备家两椅壶，27听周改门活至周六8:30；31亲完成午市关门/回家备茶，收周仍两点及饭照，知道他已吃饭；尚未迎到，不知折椅客与30修纱门细节。'
};
const out='.writer/c-inputs/record31-final-v2.json';fs.writeFileSync(path.join(P,out),JSON.stringify(t,null,2)+'\n',{encoding:'utf8',flag:'wx'});
console.log(JSON.stringify({out,sha256:crypto.createHash('sha256').update(fs.readFileSync(path.join(P,out))).digest('hex'),reason:'保留此前仍有效的各自知识，只加31新消息/实际行动，不抹成仅有当日知识'}));
