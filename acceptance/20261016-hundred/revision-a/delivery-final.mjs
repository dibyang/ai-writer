import fs from 'node:fs';
import path from 'node:path';
import {stage,work,read,hash,save,runner,cli} from './stage.mjs';
const state=read(path.join(work,'.writer/state.json'));
if(state.revision!==128)throw Error('Expected final r128');
const report='审查/revision-a-最终25-42章模型知情审查.md';
const refs=Object.fromEntries(state.units.filter(u=>u.unit>=25).map(u=>[u.draft,hash(path.join(work,u.draft))]));
const windows=[[22,27],[25,30],[28,33],[31,36],[34,39],[37,42]];
save(path.join(work,report),`# 第一轮作者改稿：25—42章最终模型知情审查

审查对象为当前 revision128 的以下正文哈希。本模型参与了改稿；这是实际全文阅读后的知情自检，没有真人盲读、子代理、市场验证或产品正式验收。三组修订属于作者选择，不将旧稿全部差异归因为程序错误。

## 阅读覆盖和版本

改稿前完整读25—42章、对应章纲和相关资料/追踪，回查15、22—24章。重建按每三章完整连读当前三章与前三章，依次覆盖${windows.map(([a,b])=>a+'—'+b).join('、')}。正文重建后再次完整读25—42章，并结合相关前文核对人物所知和原物归宿。实际阅读路径、用途及哈希记录在本阶段reading.jsonl。

最终全文阅读发生于revision109；之后因辅助转换遗漏四条未变引文，使用真实rewind/record重建至128。该次修复仅恢复引文，不改正文。最终18章正文哈希逐一等同已完整读过的版本；这项哈希绑定用于说明阅读适用范围，本身不算再次语义实读。

## A1：开门、许可和动作顺序

来源统一为9:00—11:00、14:30—17:00；26章标题与约见改到两点半，三点孩子来、15:55返回仍能顺接。27章邱铺两点、29章客户交付、31章邱铺14:40约见及14:47抵达保持原时刻，不因阅览间改门点机械改动。

35章由邱上午亲口准许14:45—15:15，14:30进屋准备、14:40多父女到、14:45开始、15:13收纸、15:20离开；这次仍为半小时上限，未自行延长。何废纸正面是新版当次时段，背蓝笔17:10交校样、四折形状及后来实际送样/退一页重排的历史保留。

38章由邱亲口另准20日14:50—15:30，39章核场地，40章9:20再问邱。下午14:35准备、14:40多来客、14:50开始，父亲只读前两页自行停，15:26离，15:30前四页全收、通知邱，15:32告何之后再试门闩。不拍不录不带走、此后先不用、没有自动恢复日均实际执行。何提多十分钟没有成为许可。41/42章两点是贴暂不借阅告示的内部维修，不能当提前对外开放。T_PUBLIC_USE仍due40并兑现本阶段承诺，长期安排未被一场清账。

## A2：指定旧稿和保管链

31章仅指定的旧两页改为细夹夹合，平放邱柜上干净透明盒，与客户尺寸纸隔开；第一页姓名、第二页缺名的初始观察不变。32章沈的回想跟随新存放版本。35章邱从盒内取出当面比照，实际归还沈；登记previous_holder为邱阿兰。沈把旧缺名两页、新使用两页分别装袋，之后与大字四页再分开。未把客户纸、椅轮夹子或其他柜侧物件换成盒。何、陈父女未成为该旧稿保管人；其未亲见邱柜上存放处的知识不补成亲见。

## A3：谁先看、看到什么

28章唐愿看文字但不想每事到场的工作与生活边界保留。36章沈先向罗说明唐的意愿，罗只准唐一人连沈自页预看；新打三页袋仍由沈保管。37章唐在新库9:30—9:57工作空档完整看三页并当场还沈、不外拷，十点车到继续工作；沈步行二十余分钟10:22到阅览间，只给何看沈自己的单页。陈10:37便笺、何的校样送样及退页重排事件保留。唐并不因此亲听旧录音、亲见原签或知私人原因。

何在37—39章没有读罗完整工作段，正文、人物热状态、reader_known、character_known、thread/fact/object关联和嵌套历史中均不保留旧版“何37已读”为剧情事实。40章9:35沈向罗报告唐已看完归还无拷，新获只给何一人预看许可；10:05—10:38沈在场何读三页全文后归还，不拷不留，十一点前沈离屋回家收三页，下午另带邱大字四页。40章以后何才获得从完整文字来的首说、两短和改口知识；不等于听原声、见原签、公开许可或知道私人失约原因。42章三页为先唐后何看过的封袋，仍在沈家。

## 其他有效信息与自检修正

第一部1—24正文及完整units登记、24章末追踪快照和baseline逐字段保留。既有主线班次/通知结论和原物宋赵范接收链不改；私人原因仍intentional-open且author_truth无答案。纸缺名、椅轮两声、砖缺口、铜牌刻线、钥绳颜色及罗首说与改口并存。原ID和due全部保留，不把当前未解边界补为已解决。

作者改文之外，知情自检修正了候选稿中唐场景不足Han、罗未获唐愿看信息来源，以及39章“第二遍”误暗示何已看新稿的表述；41章计划按当前r90已修正正文恢复为沈忘带本子、严/何各持备用/常用钥，正文不变。这些是本次自检发现的文本/计划问题，不报告为产品程序bug。

辅助核验首轮发现四条原引文因同一行多个引文被错误合并而遗漏。已保留失败audit及旧导出，修正辅助按原证据索引取句，真实从25重建并复核；497条旧证据中487条原句全保留、10条因作者改文逐条有旧新映射，最终506条锚点全绑定当前正文。脚本核验与本节语义审查分开记账。

## 真人语言别扭句

有没有哪句话意思能够看懂，却让你觉得别扭、像为了写得漂亮硬拼出来，或者不像一个人当面会这样说？

### 真人语言硬问题

没有

本次按当面说话、动宾搭配、具体动作和逐句默读改口核对。唐的十点来车、枕套线口，何的送样排版，邱的缝纫劳动和许可边界均保留各自日常事务；没有用人名替换冒充角色重写。此项仅是模型知情判断。

## 历史报告和最终结论

旧报告保持原文件和原哈希，不篡改成新稿结论。失效历史review由当前匹配正文哈希的新review覆盖，失效记录仍可查。现有正文与计划、摘要及追踪已相容；本报告支持本轮授权改稿完成，不支持外部发布或文学市场验收。逐章Han、全量ID/due、证据映射、失败修复与源/状态/导出哈希见本阶段result.md/result.json及audit.json。

${Object.entries(refs).map(([p,h])=>'- '+p+'：'+h).join('\n')}
`);
const input=path.join(stage,'reviews/delivery-final-25-42.json');
save(input,{from:25,to:42,kind:'model-self-review',report,source_hashes:refs});
const review=cli('review',['--input',input],'delivery-review25-42');
if(review.exit_code!==0)throw Error(review.stderr);
const binding={at:new Date().toISOString(),kind:'previous-full-read-final-hash-binding',version:'after-r128',purpose:'r109完整全文阅读适用于r128同哈希正文；不是重新语义实读',paths:Object.entries(refs).map(([p,h])=>({path:path.join(work,p),sha256:h}))};
fs.appendFileSync(path.join(stage,'reading.jsonl'),JSON.stringify(binding)+'\n');
const previousExport=path.join(stage,'export'),preserved=path.join(stage,'r128-export-before-final-review');
if(fs.existsSync(preserved))throw Error('Preserved export already exists');
fs.renameSync(previousExport,preserved);
for(const cmd of ['status','check','doctor','export']){
 const r=cli(cmd,cmd==='export'?['--out',path.join(stage,'export')]:[],`final3-${cmd}`);
 console.log(JSON.stringify({label:r.label,exit_code:r.exit_code}));if(r.exit_code!==0)throw Error(r.stderr);
}
const git=runner.run('git',['status','--short'],'delivery-git-status');
if(git.exit_code!==0)throw Error(git.stderr);
console.log(JSON.stringify({report,git_status:git.stdout,revision:state.revision}));
