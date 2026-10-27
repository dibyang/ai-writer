import fs from'node:fs';import path from'node:path';import crypto from'node:crypto';import assert from'node:assert/strict';import{functionsByUnit,comparison}from'./window-analysis.mjs';
const root=path.resolve('acceptance/20261024-long-flow-090-ac'),session=JSON.parse(fs.readFileSync(path.join(root,'cli-logs/br27-begin42/stdout.txt'))),project=session.workspace,sha=b=>crypto.createHash('sha256').update(b).digest('hex');const input=JSON.parse(fs.readFileSync(path.join(project,'.writer/drafts/AC-B-revision-review37-42-before.json')));delete input._instructions;const texts={},coverage=[];
for(const[ref,hash]of Object.entries(input.source_hashes)){const unit=Number(ref.match(/\/(\d{4})-/)[1]),b=fs.readFileSync(path.join(project,ref));assert.equal(sha(b),hash);texts[unit]=b.toString();const pages=Math.ceil(texts[unit].length/1800);for(let p=1;p<=pages;p++){const r=JSON.parse(fs.readFileSync(path.join(root,`read-pages/br-finalwindow${unit}-p${p}.json`)));assert.equal(r.sha256,hash);assert.equal(r.page,p);assert.equal(r.text,texts[unit].slice((p-1)*1800,p*1800));}coverage.push({unit,ref,sha256:hash,pages,bytes:b.length,body_han:(texts[unit].replace(/^#.*$/gm,'').match(/\p{Script=Han}/gu)||[]).length});}
input.chapter_functions=Object.entries(functionsByUnit).map(([u,vals])=>({unit:Number(u),...Object.fromEntries(['goal','obstacle','choice','consequence','relationship_change'].map((key,i)=>[key,{status:'observed',text:vals[i][0],evidence:[{unit:Number(u),quote:vals[i][1]}]}]))}));input.comparison=structuredClone(comparison);input.comparison.limits='42修订登记后，从独立区当前37—42顺序完整连读46页，br-finalwindow37-p1至br-finalwindow42-p7，不拼接初读短评。37—41与主区同SHA，42当前b1f908d5…；本报告随受管修订应用后仍须核主区当前字节。模型知情自检，非隔离盲读/真人验收/市场验证/作者定稿，非全书全读。';input.issues=[];
const validate=x=>{if(!x||typeof x!=='object')return;if(Number.isInteger(x.unit)&&typeof x.quote==='string')assert(texts[x.unit].includes(x.quote),`${x.unit}:${x.quote}`);for(const v of Object.values(x))validate(v);};validate(input);
const report='审查/AC-B窗口37-42-最终完整连读模型自检.md';input.report=report;
const reportText=`# AC-B窗口37—42最终完整连读模型自检

本报告由同一创作模型知情实读形成，不是隔离盲读、真人验收、市场验证或作者定稿。42小修已在正式独立区重新登记，随后按37→38→39→40→41→42再完整连续阅读46页；不是用初读报告改SHA，或把两处短评拼作整组读稿。最终阅读证据br-finalwindow37-p1…br-finalwindow42-p7，全页输出完整正文，见br-inputs/window-final-coverage.json。

## 当前版本

|章|页数|正文汉字（去标题）|字节|SHA256|
|---|---:|---:|---:|---|
${coverage.map(c=>`|${c.unit}|${c.pages}|${c.body_han}|${c.bytes}|${c.sha256}|`).join('\n')}

总计${coverage.reduce((n,c)=>n+c.body_han,0)}汉字。工具仅辅助核对页面/实际文件相同，不证明模型文学判断。当前42 SHA已从9d2d5f…改为b1f908d5…，初读和新全文版本分别保留；37—41字节未变。

## 六章逐章比较

${Object.entries(functionsByUnit).map(([u,v])=>`### 第${u}章\n\n`+v.map((a,i)=>`${['目标','阻力','选择','后果','关系变化'][i]}：${a[0]}\n\n证据：“${a[1]}”`).join('\n\n')).join('\n\n')}

## 结构回声与真正不同的收益

${comparison.similar_structures.map(s=>`${s.judgment}\n\n差异：${s.differences}\n\n保留：${s.preserve}\n\n可选：${s.optional_adjustments.join('；')}\n\n限制：${s.uncertainty}`).join('\n\n')}

六章关系变化最容易同形的是“先想替对方做—停下来问—留给本人”。38的学习对象是线松紧，39是母亲真实穿感，40是老人脚边风与门开度，41是让本人推门并付款，42则是真实补班饿累和父亲取盒。这些并非换物件复述一句道理；但杯、布、手机、笑一下及否定旁白密度高，会使阅读重音趋同。保留为建议I_AC_B_WINDOW_HELP_ECHO，没有宣称已修风格或陌生读者一定愿追。未来若压缩，应先减已经由动作表现过的解释，而不是砍掉老人的试门、女的补班或父的取盒。

## 两项已确认问题的新版本核查

I_AC_B_42_GLASSES_TARGET：当前“沈成林拿起遥控，想认屏幕上那行字，摸了两回上衣袋找眼镜，却没摸到。眼镜正挂在领口”，动作目标清楚。父亲仍扶杖/垫脚，无新增病症判断或物证线索。42全章七页及本轮窗口末七页都已实读。

I_AC_B_42_TYPO_KONGPA：当前“男人道那恐怕还得叫他去。”补字后顺口，仍是可能上门而没有预约/已经去修的事实。旧句保留在初读冻结报告，不倒改旧观察。

两项已在授权范围42—42正式独立区修改并重登；当前应用/verify仍须等受管修订prepare/commit及本报告绑定核验完成，不能将采用当应用。无其他新发现的高置信必改问题。没有偷偷改37—39；40、41亦保持本次现登记字节。

## 原文回收链与保留边界

- T_D_ROOM_DOOR_LOOK：34旧条裂/未做，37本人重约、38想留旧条、39现场工40料另问，40实际拆出原门/同意材料8且周支10找2，41固定、女主人开关/老人端空盆与坐处感受、50找2实收48。resolved仅指本处当次委托，不指冬季绝无风或全门长期质量。老人旧条箱/新余头另袋仍自己处；凭条归女主人票格，随周带离的旧钉42才入铺筐。
- P_AC_DRAWER：37客户留屉、38漏回电话后真认漏/明确18及周五午后、41试一侧后退、42完成且电话由客户改上午来取，毛巾试/实付18/抱走。有限resolved；周只文字知放回原柜/袜子关上，右侧原卡仍需抬，不推成修好原柜或长久承重。
- T_AC_SHARED_MEAL：37两姑娘各做一项/各付自己菜与厨房一次许可；39沈提出周一早半小时/12:30交并须周四今晚回复；40女以周六两小时换来窗口；41母实际收日期许可、沈当面向谭采用窗口，当天时限满足；42周六代价真付出、父周日一份饭菜真备冷藏、女10沈15真在各自包中。仍partial，周一真早到/交班、买菜、一起做吃洗收全未发生。沈选择熟悉拌饭暂不试焦底，是本次实际调整，不把旧想尝焦底愿望说成已经吃到。
- T_X_COAT_DAILY/P_W_COAT：37母交衣，38老师实看三洗原条/原衣且未拆，39母亲实试/周四短穿仍认角但想继续穿；41—42没有新拆洗，42洗的是女自己的衣。保持partial，不造长期软化或新洗后意见。纸未添老师结论，练布旧新段仍包着，42收桌书纸进内格/护纸。
- T_D_CABINET_PHOTOS：另一客户仍未归/侧图不足，不借抽屉原柜的新话把另户柜门结掉。父伤愈、复航日期、课程总期数、父辈全史和问路终点仍未知。

## 纲文实际差异

本卷粗排42结门款，实际41修完即收/票交妥，因此42改接抽屉和家庭安排；只在未消费的0042正式细纲写明，没有改已消费宏纲/V15/AC扩大骨架或旧章。42抽屉原午后约经新通话客户主动提前上午，原约不倒改。43粗排买菜入户仍只是未来骨架；当前两人选择各交班→许家先坐→再同买，后续应服从当前成稿。无需为了计划看似全中而刷旧来源。

## 真人语言别扭句

### 真人语言硬问题

没有

本轮确认的错目标及缺字已按新字节核查。保留老人“别站着催风来”、父亲“这个家里自己还没搬出去”等具体口气；米田玩笑/两家晚饭和停手旁白仍有可选风格取舍，不按词频删。未作真人语言验证或出版社审定。

## 实读范围和未覆盖

最终37—42六章46页全读；更早相关原文34p2—3、37p2—3/p5/p7、38p2/p6、39p5等读稿记录用于旧承诺回查，不称1—36全书重读。首停原41两段逐页读过后字节接续，未重写；详见恢复证据。施工仅小说内可实现性/人物动作检查，没有线下维修、食品保存或伤情实测；机械check不是文学验收。到42止，无43正文、无Git提交推送发布、无外部服务或其他聊天消息。
`;
fs.writeFileSync(path.join(project,report),reportText,{flag:'wx'});fs.writeFileSync(path.join(root,'br-inputs/window-final-coverage.json'),JSON.stringify(coverage,null,2)+'\n',{flag:'wx'});fs.writeFileSync(path.join(root,'br-inputs/review37-42-final.json'),JSON.stringify(input,null,2)+'\n',{flag:'wx'});console.log(JSON.stringify({report,pages:coverage.reduce((n,c)=>n+c.pages,0),body_han:coverage.reduce((n,c)=>n+c.body_han,0),unit42:coverage.find(c=>c.unit===42)},null,2));
