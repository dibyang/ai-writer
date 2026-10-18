import fs from 'node:fs';
import path from 'node:path';
import { root, project, phase, read, json, put as putNew, sha, state, output, fingerprints } from './session.mjs';
function put(f, x) {
  if (!fs.existsSync(f)) return putNew(f, x);
  const expected = Buffer.isBuffer(x) ? x : Buffer.from(typeof x === 'string' ? x : JSON.stringify(x, null, 2) + '\n');
  if (!fs.readFileSync(f).equals(expected)) throw Error('Refuse to overwrite existing evidence: ' + f);
}
const session = json(path.join(phase, 'revision-session.json'));
const p = session.workspace, parent = state(), branch = state(p);
const initial = json(path.join(phase, 'parent-start-state.raw.json'));
const oldHandoff = json(path.join(root, 'handoff.json'));
const sourceParent = output('final-parent-sources'), sourceBranch = output('final-branch-sources');
const baseFile = path.join(project, '.writer/revisions', session.id, 'base.json');
const base = json(baseFile);
const baseChecks = Object.entries(base.files).map(([ref, expected]) => ({ ref, expected, actual: fs.existsSync(path.join(project, ref)) ? sha(fs.readFileSync(path.join(project, ref))) : null }));
const cas = { checked: baseChecks.length, changed: baseChecks.filter(x => x.expected !== x.actual), all_match: baseChecks.every(x => x.expected === x.actual), files: baseChecks };
put(path.join(phase, 'parent-cas-baseline-check.json'), cas);
put(path.join(phase, 'revision-base.raw.json'), fs.readFileSync(baseFile));
put(path.join(phase, 'revision-session-metadata.raw.json'), fs.readFileSync(path.join(path.dirname(baseFile), 'session.json')));
const preservation = json(path.join(phase, 'preservation.json'));
const units = initial.units.map(u => {
  const bytes = fs.readFileSync(path.join(p, u.draft)), s = bytes.toString('utf8'), b = branch.units.find(x => x.unit === u.unit);
  return { unit: u.unit, draft: u.draft, original_sha256: u.sha256, current_branch_sha256: sha(bytes), current_branch_body_han: [...s.split('\n').slice(1).join('\n')].filter(c => /\p{Script=Han}/u.test(c)).length, registered_in_branch: !!b, source_hashes: b?.source_hashes, source_bindings: b?.source_bindings };
});
put(path.join(phase, 'unit-comparison.json'), units);
const oldVersionChecks = Object.values(oldHandoff.versions).map(v => ({ id: v.id, sha256: v.sha256, parent_frozen_matches: sha(fs.readFileSync(path.join(project, v.object_ref))) === v.sha256, branch_frozen_matches: sha(fs.readFileSync(path.join(p, v.object_ref))) === v.sha256, parent_version_unchanged: JSON.stringify(sourceParent.versions[v.id]) === JSON.stringify(v), branch_version_unchanged: JSON.stringify(sourceBranch.versions[v.id]) === JSON.stringify(v) }));
put(path.join(phase, 'old-version-preservation.json'), oldVersionChecks);
const initialEvents = initial.source_events.map(binding => ({ binding, event: json(path.join(project, binding.ref)), parent_bytes_match: sha(fs.readFileSync(path.join(project,binding.ref))) === binding.sha256, branch_bytes_match: sha(fs.readFileSync(path.join(p,binding.ref))) === binding.sha256, retained_in_parent: parent.source_events.some(e => e.ref === binding.ref && e.sha256 === binding.sha256), retained_in_branch: branch.source_events.some(e => e.ref === binding.ref && e.sha256 === binding.sha256) }));
put(path.join(phase, 'source-events-comparison.json'), { initial_events: initialEvents, parent_event_bindings: parent.source_events, branch_event_bindings: branch.source_events, all_old_events_preserved: initialEvents.every(e => e.parent_bytes_match && e.branch_bytes_match && e.retained_in_parent && e.retained_in_branch), initial_publish_events: initialEvents.filter(e => e.event.action === 'publish') });
const cmds = fs.readdirSync(path.join(root, 'commands')).filter(n => n.startsWith('native-two-')).map(label => {
  const dir = path.join(root, 'commands', label), meta = json(path.join(dir, 'result.json'));
  const stdout = read(path.join(dir, 'stdout.raw.txt')), stderr = read(path.join(dir, 'stderr.raw.txt'));
  let product = null; try { product = JSON.parse(meta.exit_code === 2 ? stderr : stdout); } catch {}
  return { label, ...meta, stdout_ref: 'commands/' + label + '/stdout.raw.txt', stderr_ref: 'commands/' + label + '/stderr.raw.txt', product_ok: product?.ok, product_code: product?.code, findings: product?.findings, product_result_kind: product ? 'actual-json' : 'help-text-or-empty' };
}).sort((a,b) => a.started_at.localeCompare(b.started_at));
put(path.join(phase, 'command-index.json'), cmds);
const denials = cmds.filter(c => c.exit_code !== 0).map(c => ({ label: c.label, exit_code: c.exit_code, code: c.product_code, findings: c.findings, before_state_sha256: c.before_state_sha256, after_state_sha256: c.after_state_sha256, state_unchanged: c.before_state_sha256 === c.after_state_sha256, stdout_ref: c.stdout_ref, stderr_ref: c.stderr_ref }));
put(path.join(phase, 'denial-invariance.json'), denials);
const evidence = json(path.join(phase, 'author-evidence.json'));
put(path.join(phase, 'author-evidence-verification.json'), { ...evidence, current_file_sha256: sha(fs.readFileSync(path.join(project, evidence.local_source))), exact_quote_found: read(path.join(project, evidence.local_source)).includes(evidence.quote), synthetic_test_authorization: true });
const pending = output('final-parent-status').impact_pending;
const workItems = [
  { unit: 4, draft: initial.units[3].draft, original_sha256: initial.units[3].sha256, locations: ['全文保留候选旧稿，逐章实读后重新登记；不因没有金额字样跳过'], required: '柳婆只见旧页描样、听阿禾转述封套；不得预知三枚押钱、铜片保管或修印已确证。试纸由柳婆自己拿。' },
  { unit: 5, draft: initial.units[4].draft, original_sha256: initial.units[4].sha256, locations: [{ line: 23, quote: '从原借验号木格取出两枚押钱', proposed: '改为三枚押钱' }, { line: 23, quote: '写下“二枚已退”', proposed: '改为三枚已退' }, { line: 23, quote: '她数过，正好两枚', proposed: '改为正好三枚' }, { line: 23, quote: '交出去时洗亮的孔边', proposed: '限定为原先洗净的两枚；第2章新增第三枚未洗，不能当三枚都洗亮' }], required: '保留原印封回柜底、周叔布囊带封套上坡；铜片从暂存转归档留锁匣。OBS_NOTCH statement不可改；用FACT_STAMP_REPAIR记录复验结论。FACT_DEPOSIT三枚退款结清，柳婆本章才亲见退款。' },
  { unit: 6, draft: initial.units[5].draft, original_sha256: initial.units[5].sha256, locations: [{ line: 3, quote: '把退回的两枚钱放进米缸旁的小碟', proposed: '改为三枚钱' }], required: '人物状态、摘要、时间线及FACT_DEPOSIT同步三枚。铜片仍留旧柜；私信仅阿禾知道，周叔柳婆不知内容；鞋样夹旧册，回信放敞盒未寄。' }
];
const handoff = {
  validation_session: 'native-two-independent-codex-session', synthetic_authorization: true,
  project: project.replaceAll('\\','/'), phase_directory: phase.replaceAll('\\','/'), kind: 'novel', title: '铜桥来信', schema_version: 4,
  stop_status: 'partial-revision-stopped-after-unit-3-no-prepare-no-commit',
  id: session.id, token: session.token, workspace: p.replaceAll('\\','/'), base_revision: session.base_revision,
  session_status: 'editing', session_sha256: output('final-parent-revisions').sessions.find(s => s.id === session.id).session_sha256,
  main_revision: parent.revision, main_state_sha256: fingerprints().state_sha256, main_start_revision: initial.revision,
  main_start_state_sha256: sha(fs.readFileSync(path.join(phase, 'parent-start-state.raw.json'))),
  branch_revision: branch.revision, branch_state_sha256: fingerprints(p).state_sha256,
  semantic_change_range: { from: 2, through: 6 }, revision_scope: session.scope,
  conservative_prefix: { from: 1, through: 1, reason: 'stage根据同一规则最早直接消费者要求1–6；依用户消费关系指令保守复核，正文与RULES_V1保留', issue: 'stage-scope-reproduction.md' },
  reregistered_range: { from: 1, through: 3 }, actually_changed_body_units: [2,3], next_unit: 4, unregistered_old_tail: [4,5,6],
  author_evidence: evidence,
  parent_pending: pending, branch_pending_display: output('final-branch-status').impact_pending,
  branch_pending_meaning: '区内publish仅分支解决；主pending持续至完整尾段事务提交，不得cancel',
  main_versions: sourceParent.versions, main_effective_ranges: sourceParent.ranges,
  branch_versions: sourceBranch.versions, branch_effective_ranges: sourceBranch.ranges,
  version_interval_summary: { parent: ['RULES_V1:1–6=两枚', 'RULES_V2_FROM7:7起=三枚（仍是主稿未来安排）', 'RULES_V3_FROM2仅已freeze/stage，主稿未生效'], branch: ['RULES_V1:1–1，旧报价两枚', 'RULES_V3_FROM2:2起持续三枚', '原RULES_V2_FROM7未来生效区间被v3替代，但旧版本和事件保留'] },
  units, preservation, cas_baseline: { checked: cas.checked, all_match: cas.all_match, changed: cas.changed },
  current_ledger_file: 'current-ledger.json', branch_current_ledger_ids: Object.keys(branch.snapshot.ledger),
  branch_current_facts: { copper: branch.snapshot.ledger.OBJ_COPPER, deposit: branch.snapshot.ledger.FACT_DEPOSIT, observation: branch.snapshot.ledger.OBS_NOTCH, notch: branch.snapshot.ledger.THREAD_NOTCH, letter: branch.snapshot.ledger.THREAD_LETTER },
  remaining_work: workItems,
  already_updated_planning: ['全书骨架候选从2生效（第1章仍读旧入口）', 'V1/V2候选版本从2生效，JSON卷范围仍为1–3/4–6', '第2/5/6章细纲通过真实plan修改；5/6为计划，正文尚未改/重登'],
  unfinished_tasks: ['实际复读第4–6章原稿及已更新细纲和冻结卷契约，再逐章必要修改、context/template/record；不复用旧模板', '在新候选完整登记至6后，再完整连读修订尾段1–6，核对人物知情、所有金额、铜片交接及缺角印回收', '保存并正式review新报告；当前3份旧审查已失效，1–3滚动复核也未正式登记', '全部复核后才在主作品prepare/commit原session；不得刷新CAS基线或复制主state进分支', '事务完成后按既有明确指令将主任务转为暂停正文/结构讨论，不写第7章'],
  next_session_recovery: ['先读本handoff、阶段report、原根handoff/report以及实际正文与输入，不用摘要代读', '从主项目CLI明确--project主作品，先status、revision list核对session为editing、revision28和主state哈希', '使用本地resume-input.json通过真实revision resume恢复同一id/token/workspace；不要新begin、transfer、更新随附工具或改base', '主稿或工具变化时保留候选，按产品冲突流程处理，不手改哈希或基线', '恢复后所有正文/章纲/账本写入只在workspace并带--revision-token；从4继续，不写7'],
  resume_input: 'resume-input.json',
  actual_reading_evidence: ['readings/parent-six-original.md', 'readings/old-consumed-inputs.md', 'readings/historical-required-readings.md', 'readings/branch-before-rewind-six.md', 'readings/branch-required-skeleton.md', 'readings/branch-required-volume1.md', 'readings/branch-required-volume2.md', 'readings/chapter2-after-edit.md', 'readings/branch-final-1-3.md'],
  raw_evidence: { command_index: 'command-index.json', denials: 'denial-invariance.json', body_before: 'parent-before-body-fingerprints.json', body_after: 'parent-after-body-fingerprints.json', branch_status: 'branch-status.json', parent_cas: 'parent-cas-baseline-check.json', old_versions: 'old-version-preservation.json' },
  unresolved_author_choices: ['第7章后具体剧情及新借验是否出现仍未选，本轮无正文授权'],
  limitations: ['模型同会话知情实读，不是文学或真人验收', '本轮有计划/协议保守范围行为需复核，未改源码', '分支check ok只覆盖3章且有未登记4–6及失效审查，不表示整轮可提交', '未测试跨机/共享盘、断电/中断恢复或发布平台，未执行Git操作']
};
put(path.join(phase, 'handoff.json'), handoff);
put(path.join(phase, 'resume-input.json'), { id: session.id, token: session.token });
put(path.join(phase, 'stage-scope-reproduction.md'), '# stage保守范围行为：最小复现\n\n场景：主稿6章均消费RULES_V1，新版从2持续生效，第一章保留旧规则；真实impact列direct_consumers1–6和possible_indirect_from=1。\n\n1. 输入inputs/workflow-revision.json登记2–6。\n2. inputs/freeze-rules-v3.json及impact-rules-v3.json经真实CLI取得revision26/from2/historical的impact。\n3. inputs/stage-rules-v3.json提交完整8项实读与报告，返回ACTION_OUT_OF_SCOPE，要求revise1–6。准确产品JSON：../commands/native-two-stage-rules-historical/stderr.raw.txt；前后state均cdf6161115acf5896344c9ec85bac0bfbe9f47fb58df3c55996cb8a1daf24900。\n4. 未改impact协议字段。依据用户“根据消费关系”的授权，真实workflow登记1章为原字节保守复核前缀，重新impact后stage成功；requested_from仍2，blocked_range1–6。\n\n分类：文件消费关系引出的保守范围问题/限制，不能声称产品能按语义缩到2–6。影响是必须重登未变第1章；没有观察到正文或旧版本丢失。未改源码或绕过pending。若产品预期应允许from2且仅2–6授权，应由后续主维护会话判断缺陷；本会话仅留复现。\n');
const counts = { total: cmds.length, exit0: cmds.filter(c => c.exit_code === 0).length, exit1: cmds.filter(c => c.exit_code === 1).length, exit2: cmds.filter(c => c.exit_code === 2).length };
let report = `# 《铜桥来信》第二独立会话：修订前半程\n\n本阶段已停止在第3章登记后。主稿6章真实字节、原units追踪/source_hashes/source_bindings和snapshot全部保留；主revision=${parent.revision}、历史pending仍在。独立区revision=${branch.revision}，只登记1–3，下一章4。未prepare、未commit、未补登4–6。\n\n## 范围与恢复\n\n仅在acceptance/20261018-governance-b内操作本轮独立作品、阶段输入和报告；没有代理、对外消息、Git命令/提交/推送、其他作品、源码、技能或随附工具更新。主项目cwd始终D:/work/other/ai-writer，所有产品调用明确--project并经capture.mjs及唯一native-two标签。作者原话逐字保存并标明合成测试授权，核验见author-evidence-verification.json。\n\n已读writer-project、writer-novel、writer-review及必要long-form/通用/语言模块、docs/revision-and-sources.md和workflow.md。恢复实际根handoff.json、report.md及真实status/revision list/source list，未把交接摘要当正文。主稿起始revision24、state=${handoff.main_start_state_sha256}，正文六章共3936汉字、两卷1–3/4–6。\n\n## 实读与最早影响\n\n完整连读六章当前原文，实读三份默认设定、六份细纲、全书骨架、两卷契约、旧授权、两个旧复核/影响报告及全部6个旧冻结版本。随后再实读historical required_readings全部8个文件，并额外核对原第7章未来v2冻结对象；候选计划版本的required_readings也逐个读完。独立区六章复制后再次实读；逐章读context、改后稿，最后完整连读候选1–3。所有副本在readings/，均从真实字节生成并附SHA；原六章逐文件保存在original/，改后1–3在revised/。\n\n语义最早影响2：第一章旧报价两枚不改。第2章必须补次晨获悉新数额及额外一枚来源；3章未结押钱、5章退款、6章收钱及人物追踪需要三枚。铜片交接与缺角观察不随数额改形。历史stage真实首次要求按最早消费者1覆盖1–6并拒绝2–6授权；原输入和非零输出完整保留。依用户消费关系指令，用真实workflow把1章作为保守前缀纳入，明确正文及旧规则保持不变，重新取真实impact后stage成功。该限制详见stage-scope-reproduction.md，未编辑协议字段或取消pending。\n\n## 版本与持久阻断\n\n主稿原RULES_V1有效1–6、RULES_V2_FROM7有效7起；v3只freeze/stage，未在主稿生效。impact.replaced_ranges真实列两项：v1的1–6及v2的7–无限。本次从2持续生效，分支实际区间为v1仅1、v3从2无限，原v2不再占未来有效区间，但版本、冻结对象和原历史事件保留。不能说第1章用了v3。旧版本保留逐项核验见old-version-preservation.json，完整事件副本见source-events-comparison.json。\n\nsource stage使主check退出1/IMPACT_PENDING、export退出2/IMPACT_PENDING，旧审查valid0/stale3。context--purpose revision的拒绝是REVISION_REWIND_REQUIRED，不能冒称它直接返回pending。每个拒绝前后state相同，未生成blocked-export目录。历史pending id=${pending[0].id}，保守阻断1–6/requested_from2；区内publish返回branch-only-until-transaction-commit，主pending从未清除。\n\n## 隔离修订与实际变化\n\nrevision id=${session.id}；token及完整路径保存在handoff.json/revision-session.json。base_revision=28；begin前后主业务revision和state完全相同。六章复制SHA一致且文件ID不同、nlink=1，不含嵌套修订或随附工具，见copy-isolation-before.json。区内rewind1，再带impact_id从2发布v3；所有产品写命令带revision-token，正文文件编辑也仅在workspace。\n\n分支另冻结/实读/publish新版全书骨架及两卷契约，从2解析；1章仍用旧入口骨架及VOLUME1_V1。两卷JSON的故事范围仍1–3和4–6。真实plan更新第2/5/6章细纲，第5、6章仍仅为计划，未改正文未登记。旧输入、旧候选和原冻结对象不覆盖。\n\n- 第1章：保守复核、原字节重登，仍RULES_V1、两枚旧报价和当时认知。\n- 第2章：标题改三枚，增加“照昨夜说的”及柜前新告示/当面说明/从钱绳添一枚；实际收三枚、开三枚收条。仍有两枚文字时均指旧报价、原先洗净的两枚，并非本次仍缴两枚。保留鸡篓、钥匙蓝线和原铜片交接。\n- 第3章：仅将收条上的两枚改三枚；铜片仍由阿禾交周叔锁匣暂存，未归档未退款。OBS_NOTCH原statement完全保留；未预知柳婆修印解释。\n\n正文旧路径0002-两枚押钱.md保留，内容标题已为三枚；当前首版不支持事务章节改名，不能为文件名清词而改路径。账本通过真实record增量重建：当前5项，铜片周叔锁匣、FACT_DEPOSIT三枚active，缺角与迟信仍待后续回收；没有把主稿第6章结案状态复制到分支第3章。\n\n| 章 | 分支正文SHA256 | 汉字 | 当前登记 |\n|---|---|---:|---|\n`;
for (const u of units) report += `| ${u.unit} | ${u.current_branch_sha256} | ${u.current_branch_body_han} | ${u.registered_in_branch ? '已登记' : '原稿留存未登记'} |\n`;
report += `\n## 保留证明与检查边界\n\nparent-before/after-body-fingerprints.json保留6章起止SHA、登记SHA、source_hashes和绑定；preservation.json的主units/snapshot/全部正文及begin后state相等均为true。主原FACT_DEPOSIT仍两枚已结清，分支三枚尚未退，不能混用。主state=${handoff.main_state_sha256}；分支state=${handoff.branch_state_sha256}。主CAS基线${cas.checked}个文件逐项一致，无变化；报告/交接只放阶段目录，没有begin后新增主作品文件。\n\n最终主check仍退出1/IMPACT_PENDING。分支check退出0，仅units3且有3个UNREGISTERED_DRAFT警告；rolling_review valid0/stale3、pending_window1–3。这个ok不证明完整尾段已验收或可以提交。没有调用prepare/commit来制造完成证据，也未为绿色结果补登4–6或删除旧报告。\n\n## 真人语言别扭句\n\n### 真人语言硬问题\n\n没有\n\n对本轮新增对白作当面复述与主谓动宾/场景动作检查；“昨晚不是两枚”和当面指告示符合阿禾追问、周叔讲手续的声音。对叙述按既有声音作具体动作和文字节奏复核，未发现需要扩大改写的硬问题。没有实际人声朗读、真人盲读、独立代理或市场验证；四种语言检查中的人声朗读未覆盖。原衣袄、红线、阿禾不急于宽宥及柳婆认手艺均作为保留资产，未扩写阴谋。\n\n## 未完成与下一独立会话\n\n4章全文实读重登（可无正文修改）、5章三处退款数额及两枚洗净一枚未洗细节、6章收妥三枚及相应人物/时间线/账本仍待完成。准确原句、真实原SHA与行号在handoff.remaining_work。阶段早期历史报告写“第5章退款四处数额”不够准确：实际是三处数额，另有一处洗亮钱孔的承接；此处更正而不在begin后改CAS绑定的报告。\n\n下一会话必须从文件恢复同一session，用resume-input.json，不刷新基线、不改主state、不更新随附工具。逐章新context/template/record至6后，再完整连读1–6并正式review；本会话没有把阶段实读注册为最终尾段复核。全轮完成后才prepare/commit并暂停正文，不写第7章。\n\n第7章具体剧情仍未选择；这是既有作者未决项，不影响本次已明确的历史修订范围。未验证跨机、共享盘、断电或事务中断恢复、并行冲突、发布平台及长篇长期运行。没有改工具，因此未运行npm test/doctor/test:engine，也不引用其他会话测试作为本轮结果。\n\n## 原始命令证据\n\n共${counts.total}次真实产品调用：退出0=${counts.exit0}，退出1=${counts.exit1}，退出2=${counts.exit2}；全部唯一native-two标签。非零包含预期pending/check拒绝、revision未rewind入口拒绝，以及首次stage保守范围拒绝，均保留。索引来自实际stdout/stderr解析，元数据只用于argv/退出码/前后SHA，未替代产品结果。\n\n| 标签 | 退出 | 原始产品结果 |\n|---|---:|---|\n`;
for (const c of cmds) report += `| ${c.label} | ${c.exit_code} | [stdout](../${c.stdout_ref}) / [stderr](../${c.stderr_ref}) |\n`;
report += '\n完整交接见[handoff.json](handoff.json)，账本见[current-ledger.json](current-ledger.json)，旧/新稿见original/和revised/。本阶段到此停止。\n';
put(path.join(phase, 'report.md'), report);
if (!Object.values(preservation).every(v => Array.isArray(v) || v === true) || !cas.all_match || oldVersionChecks.some(v => !v.parent_frozen_matches || !v.branch_frozen_matches || !v.parent_version_unchanged || !v.branch_version_unchanged)) throw Error('Preservation proof failed');
console.log(JSON.stringify({ counts, preservation, cas_checked: cas.checked, cas_all_match: cas.all_match, old_versions_preserved: oldVersionChecks.length, body_han: units.map(u => [u.unit,u.current_branch_body_han]), export_directory_exists: fs.existsSync(path.join(phase,'blocked-export')), handoff: path.join(phase,'handoff.json'), report: path.join(phase,'report.md') }));
