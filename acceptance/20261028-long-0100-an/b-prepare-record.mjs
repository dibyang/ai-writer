import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
const root=path.dirname(fileURLToPath(import.meta.url));
const receipt=JSON.parse(fs.readFileSync(path.join(root,'commands/b-004-revision-begin/stdout.raw.txt'))), work=receipt.workspace;
const [number,contextLabel]=process.argv.slice(2), unit=Number(number), serial=String(unit).padStart(4,'0');
if(![116,117,118].includes(unit)) throw Error('Only first-half replay authorized for this session');
const input=JSON.parse(fs.readFileSync(path.join(work,'.writer/drafts',`AN-b-replay-${serial}-raw.json`)));
const context=JSON.parse(fs.readFileSync(path.join(root,'commands',contextLabel,'stdout.raw.txt')));
assert.equal(input.unit,unit);assert.equal(context.unit,unit);assert.deepEqual(input.source_hashes,context.source_hashes);
assert.equal(input.expected_revision,context.revision);
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const draftBytes=fs.readFileSync(path.join(work,input.draft)), text=draftBytes.toString('utf8');
assert.equal(sha(draftBytes),input._replay.draft_sha256);
let evidenceCount=0;
for(const entry of Object.values(input.changes.ledger??{})) for(const e of entry.evidence??[]) {if(e.unit===unit) {assert(text.includes(e.quote),'Missing actual quote '+e.quote);evidenceCount++;}}
const notes={
116:{summary:'72日8:20后顾才答应远程时段；9:40只送入口图/原声/意见初版；9:49结束。读者知道顾点开后能分，不能把局部从头等到车声写成整份听完。240仍自用例价。原摘要符合当前原文，保留原章末语境下的“117未写”，不将此历史叙述当当前总章数。',characters:'当前沈/顾段逐句核：沈只家中接消息与截屏，不亲见送件；顾未收修后版，无新订单。人物状态为整段替换，原先保留的旧章时点串在本输入中不删不改；本会话没有重新逐章验证该历史串1—106全部原文。',timeline:'72日8:20准备、9:40发送、9:42/45回话、9:48不换/9:49结束，10点后自测而未发；与115末只发问未获答分开。',ledger:'五项实际差量逐项核：P_WORK_SCOPE_107初版/修后分存；T_REMOTE_EXAMPLE72_115只本次请求完成；P_GU_SAMPLE72_116顾持复制件；P_SAMPLE_REVISIONS72_116仅沈自测；I_REMOTE_RESULT72_116不扩大为价格/效果认可。previous_holder仍沈，顾新副本是新对象，不挪唯一原件。',evidence:'原输入本章引文全部对当前全文逐条匹配；唯一改句不在原登记引文中，不需捏造或改写引文。',downstream:'完整读过117—120原稿：117/118延续修后仅自测；119另询本人新录，不是旧例售出；120新单160收齐不回写顾已收72修后版。120候选的放开→放在只修文字，不改变补录步骤。',language:'原句“今天不用替自己换别的打开”省略播放器且“换别的打开”搭配需猜补。相邻56行明确她打了可以换播放器而未发，95行也说不要求换软件；改为“今天不必换播放器”。当面复述及动宾拆分均定位同一阅读代价，文本节奏模拟复读不再需补宾语；具体动作仍是不换，不新增操作。',gain:'高置信局部可读性修正，有净收益；不是受控测试替换，也不据此宣称全章文学提升。'},
117:{summary:'72日下午从收工、去葛铺邀请，落实一顿有限晚饭而非安排配角劳动；15:15问，约18:10，19点多想走，末尾鱼入锅仍未吃。原摘要符合正文，保留。',characters:'沈仍工作修后只自测，邀请前未先替葛量米；葛有收店/洗换/次晨活和清淡口味，明确来吃不跟锅走。整段状态里的旧有效内容不删不补；无顾新增所知。',timeline:'14点后收桌，15:15铺里，买鱼18/菜3/姜2，回家冷藏再备餐，17:50多消息，18:10葛到，鱼入锅。未跳到吃饭或照片。',ledger:'按原差量核晚饭邀请兑现到到场、食材与蓝衫；买鱼袋交接、回家冷藏、换浅盘试干布与实际入锅有动作。116修后版仍未发顾，旧私人纸页留架上不混进工作。',evidence:'本章变化引文对当前全文逐条核，正文与原主稿同字节；新增登记依赖含116候选哈希，不沿用旧来源哈希。',downstream:'118实际吃/选鱼尾与拍照是下一章；本章只来吃与入锅，不能提前写照片给沈。119余米接118；120新饭接119吃净。已读原稿范围支持这些边界，尾段最终候选连读留后续会话。',language:'知情自检用四项文字测试：邀请对白保留“先坐还是先洗手”、买鱼的犹豫和带糕误会；不是所有人用完整审核结论回答。无新的高置信别扭硬句，保留作者日常笑点。',gain:'本章正文不改；重登用于116小修后的下游连续性核对，不冒称本章文学改进。'},
118:{summary:'72日晚承接鱼入锅，砂菜梗剔除、鱼偏老，两人各选口味并添半碗；葛本人手机拍两张私留，19:18楼口分开，沈返屋留冷藏余米、清洗餐具。原摘要符合全文。',characters:'沈不再替葛换鱼尾、不取私人桥页让对方夸；葛只从沈口述知71日扶伞与湿裤，照片自留未传沈。只见街角前不扩成到家。人物整段状态保留既有历史时点。',timeline:'18:10后做菜/实吃，19:15告辞、19:18楼口分开、回家丢头骨砂菜/余米冷藏及洗两布；119翌晨收布和中午炒余米有明确承接。',ledger:'核剩饭、蓝衫/两照、晚饭的有限结果及桥页未读边界；实际手机交还葛有动作，不能把沈拍摄当取得自己相册副本。117已来吃不意味着本章前已吃完；119也不能把余米重置未动。',evidence:'原变化全部本章引文在当前全文找到。正文同原主稿字节，不以旧报告替代当前核读；原证据与本次来源分别保留。',downstream:'119将118余米炒热透并吃净洗盒，工作素材另建新夹；120晚饭煮新饭，160单款与72初版/修后试用分开。已读119/120原稿及120候选改句，不声称未重登尾段已通过最终连读。',language:'四项文字测试保留“鱼路走得不少”、等端鱼的路宽及辣酱自行加等人物声音；未把职业细节一概删掉。未发现需要新增修改的高置信语言硬问题。',gain:'本章正文不改；只做有范围的重登复核，不制造净收益。'}
}[unit];
const draftSha=sha(draftBytes), report=`审查/AN-b-${serial}-重登六项实读.md`;
const body=`# AN会话B 第${unit}章候选重登实读\n\n审查者：同一独立Codex会话知情模型自检，无子代理、真人或市场验证。不是文学验收或作者定稿。授权来源：研究/AN会话B真实用户授权.md；仅独立候选116—120，本会话停118，禁止prepare/commit。\n\n当前完整章：${input.draft}\nSHA256：${draftSha}\n原登记SHA256：${input._replay.old_unit_sha256}\n原基线state：${input._replay.base_state_sha256}\n写前context：commands/${contextLabel}/stdout.raw.txt；expected_revision=${input.expected_revision}；原生replay-input原件另存，不刷新其中来源。\n\n## 六项核读\n\n${['summary','characters','timeline','ledger','evidence','downstream'].map(k=>`- ${k}：${notes[k]}`).join('\n')}\n\n## 真人语言别扭句\n\n### 真人语言硬问题\n\n${unit===116?notes.language:'没有'}\n\n${unit===116?'':notes.language}\n\n### 漏检与误伤复核\n\n${unit===116?'回看可以换播放器和不要求换软件两处先行项，删去不清楚的自反指代，保留顾不必为本次试用换工具的语义；没有把顾局部听取改为整听。':'回看相邻句确认动作、指代、职业与日常语境，不凭抽象词或对称句式判错。正文无新增改写；本次未冒充真人实际朗读。'}\n\n## 结论与限度\n\n${notes.gain} summary/changes据当前全文复核后原样保留；新登记只更新原生来源与本次报告绑定，不凭脚本字段当语义结论。旧封存、主稿正文与不可变观察不改。其他1—102、104—106、108、110、113—114未在本会话全文重读；其旧报告不是本次文学证据。完整修订尾段最终连读与review留给后续独立会话，不在这里冒称完成。\n`;
fs.writeFileSync(path.join(work,report),body,{flag:'wx'});
input.replay_review={reviewer:'Codex-AN-session-b-informed-self-review',report,draft_sha256:draftSha,checked_fields:['summary','characters','timeline','ledger','evidence','downstream']};
input.draft_review={reviewer:'Codex-AN-session-b-informed-self-review',report,draft_sha256:draftSha,report_sha256:sha(Buffer.from(body))};
const inputRef=path.join(root,`session-b/record-${serial}-v1.json`);
fs.writeFileSync(inputRef,JSON.stringify(input,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({unit,draft_sha256:draftSha,report,report_sha256:input.draft_review.report_sha256,evidence_count:evidenceCount,expected_revision:input.expected_revision,source_hashes_unchanged_from_replay_and_context:true,summary_changes_unmodified:true}));
