import fs from 'node:fs';import path from 'node:path';import{base,j,write}from'./ef-lib.mjs';
const r=j(path.join(base,'e-revision-private.json')),x=j(path.join(r.workspace,'.writer/drafts/er1-replay-55.json'));
const fix=v=>typeof v==='string'?v.replaceAll('料12','料16').replaceAll('包料12','包料16').replaceAll('包价12','包价16').replaceAll('58','62').replaceAll('五十八','六十二').replaceAll('料十二','料十六').replaceAll('自购68','自购72'):Array.isArray(v)?v.map(fix):v&&typeof v==='object'?Object.fromEntries(Object.entries(v).map(([k,a])=>[k,fix(a)])):v;
const characters={};for(const id of ['周岸','柜门客户','柜门常用者'])characters[id]=fix(x.changes.characters[id]);
characters['周岸']+=' 48清点原材料箱已有三张可用旧砂纸（一粗两细），55只见几片仍在，不新增采购或推定耗用数量。';
characters['许蓉女儿']=x.changes.characters['许蓉女儿']+' 晚向母回述昨日已知新灯72，不因此知道柜价。';
const ledger={};for(const id of ['T_D_CABINET_PHOTOS','P_AD_NEW_DESK_LAMP54','F_AD_CABINET_FEE55','P_AD_CABINET_NOTE55'])ledger[id]=fix(x.changes.ledger[id]);
write(path.join(base,'er1-delta-55.json'),{body_changed:true,summary:fix(x.summary),characters,ledger,timeline_append:fix(x.changes.timeline_append)});
write(path.join(base,'er1-notes-55.md'),`逐章写前取得r335的context、record-template和官方旧六字段参考。当前正文15455字符9页先完整返回，再仅把库存用料/小件包价12改16、工46加料16合62，以及女儿已知母灯价回述68改72；修后仍15455字符9页，全部逐页返回，未用哈希代替阅读。

纲文与语言：现场先取浅盘/大碗、桌小挪、确认门落处、男托稳才拆门，之后亲见下合页两孔松。先前视频不倒填现场；双方意见不同而选择有限补固，原门原漆/原合页留下。两次来去仍含工价，无新采购/新票据，库存包料16不是额外买料。客户虽有钱却拒先付，约装好本人试用再付，全章零收款；56的70/找8不提前进入。补后需待稳，原门垫布靠干墙、原件小碟干盒留户，暂用盖盒费劲有实际回声，照片不能说明胶稳。周只听女人11点安排，不替她见证出行。

summary同步62/16/未收；characters周及双方报价同步，周保留48三张一粗两细、55几片不推算耗用；女儿真实回述72，何/沈没有新增价格知情。timeline的报价/回铺/夜消息仅约定未收。ledger仅同步柜现场/费用/家存纸和灯的必要部分，其他增量继承：新灯72已自购，灯/戏纸母自用；旧坏灯未修、原门50和抽屉18不串账，14/8册与18未购20未动保留。逐条evidence均核修后原句，尤其工46料16合62、记工料62未收和夜62仅约定。

女工作只核两页/听后页另认；48练布最终小段平，52另一侧硬尾不新拆，原小废纸加问题，原母衣反馈纸重读不改/老师尚未见48夜行；母宽袋底薄自选不带本课，无新修衣承诺。周晚洗衣/告不赴茶并有普通玩笑，人物反应未大改风格。当前滚动C组/合同/56—60纲文来源已逐字核适用内容和生效范围，55不误替未来D/DR新版本；新依赖用当前报告重新绑定。

下游：56才装试、现场实际收款；57课、58/59/60各自实际发生时核，不预写。unknown如胶固化程度、后页核实结果、下一课老师意见和未来使用情况均未见，本章不宣称无影响或已完成；回放仍到60，本程止56。
`);
console.log('55 incremental semantic delta and current report notes saved');
