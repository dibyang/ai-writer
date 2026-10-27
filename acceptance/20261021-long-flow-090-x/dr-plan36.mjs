import fs from 'node:fs';
const P=new URL('./scenario/东岸末班船-再扩展验证/',import.meta.url);
const put=(p,v)=>fs.writeFileSync(new URL(p,P),typeof v==='string'?v:JSON.stringify(v,null,2)+'\n',{flag:'wx'});
const base=JSON.parse(fs.readFileSync(new URL('.writer/drafts/dr-workflow-resume35.json',P)));
base.expected_revision=156;base.operation_id='x-dr-plan36-only';base.workflow.stage='outline';
base.workflow.task='35已真实登记；仅规划第36章，先plan建立真实细纲再采用已有引用。随后依原作者及本次续程授权恢复有限34—36正文；不启动37。';
base.workflow.authorization.allowed_actions=['discuss','plan'];base.workflow.authorization.draft_range=null;base.workflow.authorization.revise_range=null;
base.workflow.planning.outline={status:'draft',refs:['大纲/单元/0035.json','大纲/X-DR续程执行纲-35-36.md'],unresolved_ids:['待真实plan第36章后采用']};
put('.writer/drafts/dr-workflow-plan36.json',base);
put('大纲/X-DR第36章执行纲.md',`# X-DR第36章近期执行说明

沿扩大骨架X/V13/A13，35的远约已用一次实际同行和不同购否兑现。36不另造总架构，重心从确认安排移到共同时间回家以后如何使用物与时间。此文件为代理在真实作者有限授权内的执行选择，非作者逐项采纳新细节。

正文目标10500—11500汉字、至少10000、六个实际事件段：
1. 周日15:40前许家承35原动作，女拆自己12元花册，母更喜欢另一页，各自意见不须统一；母16点真出班，女用自己的下午看页/拍发，未到下一课。
2. 沈周日归家，父仍伤脚；亲告未买新书，与父看原八元册同图不同解释，收到花页照片实际回应；原20仍未花、旧白纸原页不乱移。
3. 明示回切周日午前至午后周岸：对柜门待问取得真实消息而不凭空修成，午后确实留给自己回家做饭歇息。另一房门仍待主人另排；茶32一次已兑现不套新茶约。
4. 周一许母亲收第三洗后真干工装、真实穿做值守，与老何小段生活交流/听戏；靠桌仍认角的具体后果留待下一学习关系，非自动变软全愈。既有纸/旧练布/母工装和女裤不混。
5. 周一沈正常班亲带自有册，在柜前工作与自己歇时看书之间有实际取舍，饭盒/旧册分放，休息有限并回到工作；不重演一次性早半小时，父腿不痊愈。
6. 周一许家晚间，女用自己的旧练布真折/缝少量，保留不齐的后果，不拿新花书作教程；母归家自己的衣感可记新一行，下一次课/实衣带老师/长期洗穿仍待后卷。女自由选花页与练习分配时间，朋友后续交流按真消息，不补成宏大承诺。

篇幅由实际行动、交流与后果产生。不要每段都照“误认—解释—重试”或“想帮—收手”排版，不靠审查口吻做人物心理。周日回切用***和人物/日期明示；后续周一再接；正文结束仅到36的生活位置，不写37开头。

未决至少保留：母衣实物给老师/下一次课与长期穿洗；女旧练布下一步；另一家房门后续拆看；柜门补侧图/真实报价。它们是计划/待办，不假结案。
`);
put('.writer/drafts/dr-plan36.json',{unit:36,title:'灯下还有一页',goal:'把一次同行的收获写成各自可支配时间和实际使用，而不是统一口味或一次性解决所有待办',change:'两姑娘实际把不同书页带回各自生活：女购花册/练自己的旧布，沈未买新书仍在休息时读自有册；母衣洗后再穿有具体反馈，周午后实休，各人保留不同未决',cast:['许蓉女儿','许蓉','沈禾','沈成林','周岸','谭老板','老何'],setting_refs:['设定/人物与声音.md','大纲/扩大骨架-X.md','大纲/X-D近期执行纲-34-36.md','大纲/X-DR第36章执行纲.md'],research_refs:[],forbidden:['至少10000正文汉字，目标10500—11500，至少五个实际事件段，本稿计划六段','不写37，不把后续课程/实衣给老师/长期洗穿或柜门/房门待办结案','父伤脚仍有限站立/垫脚；保留旧八元册白纸原页旧印，12元花册和18未购薄书分开','仅登记实际看见/听到/持有/收付；母女/朋友/周廖不共享全知','不改34及旧已消费骨架/卷文件，不灌水重复判断'],beats:['周日15:40前女归家接原书袋动作，母女翻不同花页；母16出班，女留自己的时间读书/实际拍发','沈周日归家亲告未买，与伤脚父看原册不同解释，收新页实际回应、旧册归位','明示周日午前回切周岸，柜门真实待问消息与仍未报价，午后真正回家做饭休息，另门仍待另排','周一许蓉收实干工装再穿值守，和老何生活交流，靠桌仍认角只记本件实际用感','周一沈按正常班携自有册，在实际工作间隙读有限页再回柜前，不重演一次性早到安排','周一许家夜女折缝旧练布一小段有不齐后果，母归家记具体新用感，原书/针纸归各处后继续读自己喜欢的花页'],recall_ids:['T_X_BOOK_COMPANY','P_DR_FLOWER_BOOK','P_W_PICTURE_BOOK','T_X_COAT_DAILY','P_W_COAT','P_CR_FEEDBACK_PAPER','T_W_EVENING_CLASS','P_X_OWN_TROUSERS','P_X_THIN_CLASS_CLOTH','T_D_ROOM_DOOR_LOOK','T_D_CABINET_PHOTOS','T_X_TEA_AFTER_WORK'],arc_id:'A13'});
console.log('saved planning input and actual execution outline; no state edited');
