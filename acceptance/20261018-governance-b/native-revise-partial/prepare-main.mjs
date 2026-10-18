import fs from 'node:fs';
import path from 'node:path';
import { project, phase, put, read, state, sha, input, run } from './session.mjs';
const quote = '本次修改仅限独立作品《铜桥来信》：从第二章开始，押钱改为三枚，第五章退回三枚，核对所有提及和后果；第一章仍保留当时旧规则。授权从实际最早影响章至第六章建立独立修订区，处理人物所知、铜片和缺角印的连续性，保持核心情节、人物声音和原有伏笔回收，不加新阴谋。本次会话只完成修订前半程，到第三章登记后停止并交接；主稿保留到下一会话完成全部尾段复核与事务提交。完成整轮修订后暂停正文，不写第七章。';
const evidenceRef = '研究/第二会话-合成作者修订原话.md';
put(path.join(project, evidenceRef), '# 合成测试授权证据：第二独立会话\n\n下段逐字保存本次用户给出的模拟作者新指令，仅用于本轮独立作品验收场景；不冒充真实作者授权或身份认证。\n\n' + quote + '\n');
const author_evidence = { quote, local_source: evidenceRef, source_sha256: sha(fs.readFileSync(path.join(project, evidenceRef))), locator: '本次用户消息中“本验证场景的模拟作者新指令”的完整引文；无可用消息ID，不编造', recorded_by: 'native-two-independent-codex-session' };
put(path.join(phase, 'author-evidence.json'), author_evidence);
const rules = '# 权威规则 v3（第二章起持续三枚）\n\n这是独立验证小说的候选修订规则，依据研究/第二会话-合成作者修订原话.md；经历史影响stage及独立修订区publish后才在候选生效，主稿须完成尾段复核和事务提交。细纲、卷契约表示计划，正文及增量追踪表示已发生。\n\n1. 主角阿禾；限制为她合理可知的近距离第三人称。铜片有折起的耳、一条浅划痕，封套方印右下缺角；观察、推断和查明分开，旧观察不逆改。\n2. 铜片每次交接写明交出人、接收人、存放地点和状态；在场或转述才构成人物所知。铜片第2章验记交回阿禾，第3章交周叔锁匣暂存，第5章归档留柜，第6章仍在柜中。\n3. 第一卷1–3章埋缺角印，第二卷4–6章查清：第4章只提修补可能，第5章以原印高差、软硬试印和字内短缺口对验，不凭相似缺角认定偷信；第6章保留私信与情感余波。\n4. 第1章保留旧规则和当时报价“押钱两枚”，仍绑定RULES_V1。第2章起借验押钱改为三枚，归凭并结清登记后全退三枚；第2章缴三枚，第3章尚未退，第5章退三枚，第6章收妥三枚。不抵扣、不漏退、不把第1章改成新版。第2章需交代次晨获悉三枚及补足一枚，不能让人物早在第1章知道新数额。\n5. 本版自第2章持续生效，替代原RULES_V1的2–6区间及RULES_V2_FROM7的7起安排；原提案、冻结字节和历史事件保留。新作者授权修订本次借验的数额，原第7章起方案不再是独立的未来切换点；不凭版本发布虚构第7章事件。\n6. 核心情节、人物声音和原伏笔回收不变，不加阴谋。修订范围2–6，本会话只重登2、3章即停止；4–6由下一独立会话完成全文尾段复核与事务提交。完成整轮后暂停正文，不写第7章。\n';
put(path.join(project, '研究/第二会话-权威规则v3候选.md'), rules);
const outlineOld = read(path.join(project, '大纲/全书大纲.md'));
put(path.join(project, '研究/第二会话-全书骨架旧输入.md'), outlineOld);
put(path.join(project, '研究/第二会话-全书骨架候选.md'), outlineOld.replace('第二章交两枚押钱', '第一章保留两枚旧报价；第二章次晨得知三枚，补足一枚交押').replace('退两枚', '退三枚'));
for (const [id, change] of [['V1', x => { x.promises[0] = '追踪铜片交接；第一章旧报价两枚保留，第二章获悉三枚并补足一枚交押'; }], ['V2', x => { x.promises[0] = '第5章查清缺角印并退三枚押钱'; x.arcs[0].forbidden[0] = '不改第一章两枚旧报价；第2章起依修订授权三枚，退款与收妥须一致'; }]]) {
  const x = JSON.parse(read(path.join(project, '大纲/分卷/' + id + '.json'))); change(x);
  put(path.join(project, '研究/第二会话-卷' + id + '候选.json'), x);
}
const report = '# 第二独立会话：历史影响实读（stage前）\n\n性质：Codex同会话知情实读，非真人或文学验收。已完整读当前六章实际字节、三份默认设定及其冻结对象、全书骨架、六章细纲、两卷契约及冻结对象、旧授权和两份旧复核/影响报告；阅读副本及真实SHA在阶段目录readings/。\n\n起始主revision=24、state SHA=71acee060b057f38cd31b9a075163e6b6297839d577fb54f74a4f63238e13c18，六章真实哈希与第一会话handoff一致。旧RULES_V1（92bfd781270dbb2c6e66c3a5cc6edf76f2d0191863c3f2e96137364257078e06）有效1–6；未来RULES_V2_FROM7（ec5021cc8a213492a094d051b950b4ef2a9700ef07e39824c5f6efa4c1c3c73f）有效7起。活动权威规则入口实际是v2，不能称六章已使用v2。入口及两版冻结对象均保留。\n\n新合成授权明确改变既往数额：最早影响2，保守修订尾段2–6。1章原报两枚不改；2章标题、洗钱、缴付、收条、钱数成本和知情承接均需最小修改。计划采用次晨柜面新告示、周叔当面说明，阿禾从钱绳补足一枚，避免不知为何多交或第一章人物提前知道。3章结尾收条上的两枚改三枚，铜片仍暂存，不提前退款。4章无金额直改需求，但柳婆不知押钱和铜片保管，必须重新登记知情。5章退款四处数额改三枚，结清对应原三枚收条；6章小碟收钱及人物状态/时间线改三枚。4–6本会话不重登、不宣称核定完成。\n\n相关计划输入：全书骨架有第二章交两枚、第五章退两枚；V1承诺两枚；V2承诺两枚且禁止倒填三枚；2章细纲标题/change/beats/forbidden冲突，5、6章细纲同样冲突。必须在独立区保留旧输入后按章发布/修改；不改冻结对象或源哈希，不使1章消费新版。独立候选骨架和卷契约在研究/先备好，后续版本发布实读另记。\n\n物件与知识：1铜片阿禾贴身衣袋→2周叔白布验记后还阿禾腰袋→3周叔旧库上层借验匣锁存→4不换手→5复验后归档锁回→6留柜。3章OBS_NOTCH是封套和旧页右下缺角相似，不改statement；4柳婆只据描样和转述提可能，5原印复验另记FACT_STAMP_REPAIR。第6章私信只阿禾知，回信未寄。保持折耳浅痕、钥匙蓝线、旧袄红线、不急于宽宥和手艺人认手艺。无新阴谋。\n\n版本替代意图：v3自2持续，RULES_V1仅留1；RULES_V2_FROM7的7起安排也被替代，提案及历史事件不删除。不能只替2–6而让7起又切回旧v2。待impact实际回包后逐条核对replaced_ranges并实读required_readings，再补充正式review。\n\n已知工作项：2–6重登及尾段完整复核待完成；此为明确修订任务，不是stage方案语义未决。第7章剧情仍未选择，不在本范围；不新增正文。工具不能理解报告结论的正确性。\n';
put(path.join(project, '审查/第二会话-历史影响实读.md'), report);
put(path.join(phase, 'historical-impact-before-stage.md'), report);
const oldWorkflow = structuredClone(state().governance.workflow ?? state().governance);
console.log(JSON.stringify({ governanceKeys: Object.keys(state().governance) }));
const workflow = { stage: 'revision', task: '独立修订2–6章押钱及连续性；第二会话仅重登至第3章停止交接，下一会话完成4–6和尾段复核事务提交；不写第7章', authorization: { allowed_actions: ['discuss', 'plan', 'revise'], draft_range: null, revise_range: { from: 2, to: 6 }, stop_conditions: ['本会话第3章登记后立即停止并交接；不重登4–6，不prepare/commit', '主稿保留到下一会话完成全部尾段复核和事务提交', '完成整轮修订后暂停正文，不写第7章'] }, planning: oldWorkflow.planning };
run('authorize-revision', ['workflow', 'set', '--input', input('workflow-revision', { expected_revision: state().revision, operation_id: 'native-two-revise-2-through-6', author_evidence, workflow })]);
run('freeze-rules-historical', ['source', 'freeze', '--input', input('freeze-rules-v3', { expected_revision: state().revision, operation_id: 'native-two-freeze-rules-v3', ref: '设定/权威规则.md', file: '研究/第二会话-权威规则v3候选.md', version_id: 'RULES_V3_FROM2', previous: 'RULES_V2_FROM7' })]);
const impact = run('impact-rules-historical', ['source', 'impact', '--input', input('impact-rules-v3', { version_id: 'RULES_V3_FROM2', from: 2, mode: 'historical' })]);
put(path.join(phase, 'historical-impact-output.json'), impact);
