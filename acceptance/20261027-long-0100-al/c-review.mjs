import fs from 'node:fs';
import crypto from 'node:crypto';
const sha=b=>crypto.createHash('sha256').update(b).digest('hex'),read=p=>JSON.parse(fs.readFileSync(p,'utf8')),put=(p,v)=>fs.writeFileSync(p,typeof v==='string'?v:JSON.stringify(v,null,2)+'\n',{flag:'wx'});
const rows=read('../session-c-baseline.json').inventory.filter(r=>[107,109,111,112,113,114,115,116].includes(r.unit));
for(const unit of [117,118])rows.push({...read(`../session-c-length${unit}-final.json`)});
for(const r of rows){r.sha256=sha(fs.readFileSync(r.draft));r.reading='本会话完整实读；新章各版本合章后完整复读';delete r.observed_sha256;}
put('研究/AL-c-reading-manifest.json',{nature:'session-c-informed-model-full-text-reading',not_read:'未列出的章未宣称完整实读；不是全书覆盖',rows});
const lines=rows.filter(r=>r.unit>=111).map(r=>`|${r.unit}|${r.draft}|${r.sha256}|`).join('\n');
const report=`# 111—118本轮实际连读复核\n\n审查者：session-c同会话知情模型自检；非独立代理或真人盲读、非全书验收。\n\n本轮完整读取111—116最终稿，再逐章写117/118并对每个合章版本全文复读。107/109也完整读取作工作前因，未将未读旧章借摘要补成全书覆盖。此报告覆盖111—118连续8章，与逐章记录及实际哈希绑定；不覆盖旧欠审97—102、100—105。\n\n|章|实读文件|SHA256|\n|---|---|---|\n${lines}\n\n## 连读结论与动作证据\n\n111—112已从葛未吃好的饭及想剪得好看推进到实际自付35剪发，113走桥/购面蛋，114何实际读105并还，115沈另写自己独读、只问顾次晨时段，116顾才答并收到初版/局部反馈，修后只有沈自测。没有把这些已经完成的动作重置成117才首次知道。\n\n117承接116接受本次结束、留自测版，主动为相处提出一顿饭；葛的时段和不接灶使沈换做法，自己付23买做。118饭不完美但双方实吃，葛自己选鱼尾/吃临放小块，拍蓝衫照源于她的愿望而非替沈解题。111最好一块最后倒与112蓝衫没穿都有新动作回应；不是全线索结案或人物永久改好。\n\n115的湿砂与伞未修成原文再次核对，118数量误述已修，葛只获当晚口述，桥页没拿出；照片只为本人留看。105新页/划头稿/114回话、95半面、115桥页保管不混，周没有新增105阅读。顾初版副本未撤删，沈修后未外发；旧声与旧公开材料没有使用。\n\n72日时序：116上午9:40—9:49试送；117午后15:15邀约、买菜冷藏/备饭，18:10葛到/鱼入锅；118当晚饭成/吃完/拍照，19:15起身、19:18楼口分开，只见街角前。不会把此前69日返铺方向变成开门或销售，也不补72日到家。\n\n## 真人语言别扭句\n\n已用当面说话、动宾拆分、具体落地和逐句默读改口核对新稿。旧章本轮只读，未据个人偏好动旧章。\n\n### 真人语言硬问题\n\n没有\n\n### 风格偏好观察\n\n111—118包含多次小失落/收手/生活物件，仍有同型节奏风险。117—118以真实邀约、备饭错漏、口味与葛自要照片展开，减轻对工作说明的重复说明，但慢叙事是否能使真实读者追读未测试。不能把两章目标篇幅达标等同文学通过。\n\n## 未决与边界\n\n旧五条needs-recheck与欠审窗口不变；本轮无revise权限。旧余带/男声钟声同日/剪者、罗私因、旧经费/押金及长期公屋、修镜、离场后取送样等无新证。T_HAIRCUT69_111剩余待核仍partial；T_VOICE_CONSENT仍partial due100，未因本日口述与拍照变成新授权。\n\n本报告仅声明实际覆盖与知情自检发现，不给文学分数、不冒称作者定稿或产品发布验收。\n`;
const ref='审查/AL-c-111-118-连读回对.md';put(ref,report);
put('研究/AL-c-review111-118.json',{from:111,to:118,kind:'model-self-review',report:ref,source_hashes:Object.fromEntries(rows.filter(r=>r.unit>=111).map(r=>[r.draft,r.sha256]))});
console.log('reading manifest 10 chapters; contiguous review 111-118 prepared');
