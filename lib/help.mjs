import path from 'node:path';

export const COMMANDS = {
  init: { flags: ['path', 'kind', 'title','mode'], usage: '--path 新目录 --kind novel|screenplay|history|essay --title 作品名 [--mode long|standard]', purpose: '建立作品和随附工具，不覆盖已有目录。明确长篇/跨卷时用long，提前组织全书骨架、卷契约和近期细纲。', example: "--path 'works/雨夜来信' --kind novel --title '雨夜来信' --mode long" },
  plan: { flags: ['project', 'input'], usage: '--project 作品目录 --input 细纲.json', purpose: '保存下一章、场或篇的细纲。', input: { unit: 1, title: '来信', goal: '确认寄件人', change: '发现寄件时间不符', beats: ['核对邮戳'], cast: [], setting_refs: [], research_refs: [] } },
  context: { flags: ['project', 'unit', 'max-chars', 'purpose','out'], usage: '--project 作品目录 [--purpose discussion|draft|revision] [--unit 1] [--max-chars 40000] [--out .writer/drafts/context-1.json]', purpose: 'discussion恢复任务/范围/决策；draft及revision须有授权和细纲。超预算不截断，返回总量、分项及主要引用占用；字符量不是模型token数。out可选，写新的内部JSON可读入口，不覆盖旧输入。带out会取得作品写锁；同作品的草案保存须串行，不与模板保存并发。' },
  'record-template': { flags: ['project', 'unit', 'draft','out'], usage: '--project 作品目录 --unit 1 [--draft 正文/自定路径.md] [--out .writer/drafts/record-1.json]', purpose: '动笔前取得登记模板；省略draft时使用章纲标题，长篇默认正文/卷ID-卷名/章号-标题.md，显式旧路径保持。路径/哈希自动填，未变事实保留；按实际正文填摘要与changes，不誊写全快照。带out保存须等同作品context等写入命令结束；遇锁先核真实任务，不删除锁重试。' },
  'record-preview': {flags:['project','input','out'],usage:'--project 作品目录 --input 登记.json [--out .writer/drafts/preview-1.json]',purpose:'只读预检，复用record校验并展示实际事实差异、未变项和待补字段；不自动刷新过期哈希，不证明语义无变化。'},
  'long-enable-preview':{flags:['project'],usage:'--project 作品目录',purpose:'只读预览长篇迁移与估计journal体积，不创建备份、不改状态；取消即停止，实际启用仍需授权及当前revision。'},
  record: { flags: ['project', 'input'], usage: '--project 作品目录 --input 登记.json', purpose: '填写写前模板中的实际摘要与追踪，然后顺序登记正文。不要从手册抄写假哈希。' },
  assemble: { flags: ['project','input'], usage: '--project 作品目录 --input 合章.json', purpose: '按有序分段路径与SHA256连接完整章。省略draft时采用当前context的draft_path，与默认登记模板一致；显式draft必须是正文/下的新.md或.txt文件，不能输出到分段/；parts的输入须在分段/下。只创建新文件、不覆盖、不登记；已有目标另取正文/下新路径。separator只允许空白，换场标记写入片段本身后取实际SHA。须当前revision及正文授权；完成后完整实读，再preview/record。', input: {unit:1,expected_revision:1,draft:'正文/0001.md',parts:[{path:'分段/0001/01.md',sha256:'替换为实际片段SHA256'},{path:'分段/0001/02.md',sha256:'替换为实际片段SHA256'}],separator:'\n\n'} },
  status: { flags: ['project', 'view'], usage: '--project 作品目录 [--view compact|full]', purpose: '查看进度、过期来源、未登记正文和建议下一步。' },
  check: { flags: ['project'], usage: '--project 作品目录', purpose: '检查机械一致性与未登记正文；不裁定文学质量。' },
  rewind: { flags: ['project', 'from', 'expected-revision'], usage: '--project 作品目录 --from 1 --expected-revision 当前修订号', purpose: '备份并作废指定单元及后续追踪，保留正文。schema4及以上须先建立独立修订区，在该区带revision-token回退；不在主稿直接执行。旧协议兼容原路径。' },
  export: { flags: ['project', 'out'], usage: '--project 作品目录 --out 作品目录外的新目录', purpose: '导出已登记草稿，列出未纳入的正文；不覆盖旧导出。' },
  'long-enable': { flags: ['project', 'expected-revision'], usage: '--project 作品目录 --expected-revision 当前修订号', purpose: '显式启用分卷契约，再用volume建卷计划；schema1备份迁移2，当前治理协议保持原版本。新长篇可直接init --mode long。先long-enable-preview只读预览。' },
  volume: { flags: ['project', 'input'], usage: '--project 作品目录 --input 分卷.json', purpose: '保存连续覆盖的分卷与剧情单元计划。', input: { id: 'V1', title: '来信', start: 1, end: 3, promises: ['找到寄件人'], constraints: [], reserved: [], arcs: [{ id: 'A1', start: 1, end: 3, goal: '核实来源', payoff: '排除误认', forbidden: [] }] } },
  outline: { flags: ['project', 'unit'], usage: '--project 作品目录 [--unit 1]', purpose: '查看长篇当前卷与剧情单元契约。' },
  recall: { flags: ['project', 'query', 'limit'], usage: '--project 作品目录 --query 关键词 [--limit 20]', purpose: '查找线索与证据位置；完整账本ID匹配优先，空白分词为AND。默认20条，limit允许1—100；根据结果回读正文。' },
  review: { flags: ['project', 'input'], usage: '--project 作品目录 --input 审查登记.json', purpose: '登记已实际阅读的报告及范围内全部正文哈希，不自动审稿。下列单章示例；多章须列齐实际阅读范围的全部路径。', input: { from: 1, to: 1, kind: 'model-self-review', report: '审查/第1章-r1.md', source_hashes: { '正文/0001-来信.md': '按实际阅读版本填写，不能使用示例值' } } },
  'import-index': { flags: ['project', 'input'], usage: '--project 作品目录 --input 源文件清单.json', purpose: '为空的长篇作品冻结自有旧稿。files 必须按章顺序；相对源路径按命令 cwd 解析。', input: { rights: '作者自有作品，用于续写', files: ['D:/原书/第一章.md', 'D:/原书/第二章.md'] } },
  'import-status': { flags: ['project'], usage: '--project 作品目录', purpose: '查看导入进度、can_continue 与阻断路径。完成后转为正常续写。' },
  'import-next': { flags: ['project'], usage: '--project 作品目录', purpose: '取下一章冻结稿，实读、规划、登记后再取下一章。未登记时重复返回同一章。' },
  'import-relink': { flags: ['project', 'input', 'expected-revision'], usage: '--project 作品目录 --input 路径映射.json --expected-revision 当前修订号', purpose: '为同一冻结内容重定位原文件；内容哈希不同会拒绝。保留定位历史，不修改冻结清单与正文。', input: { files: [{ unit: 1, path: 'D:/新位置/第一章.md' }] } },
  'style-scan': { flags: ['project', 'draft', 'out'], usage: '--project 作品目录 --draft 正文/0001-标题.md [--out 审查/语言线索-r1.json]', purpose: '只读扫描表达线索，供去 AI 味实读复核；不自动改稿、不打 AI 概率分。可检查未登记正文。' },
  doctor: { flags: ['project'], usage: '[--project 作品目录]', purpose: '检查当前工具，或指定作品的随附技能、用户文档和工具文件。' },
  governance: { flags: ['project', 'input'], usage: 'preview|migrate --project 作品目录 [--input 迁移.json]', purpose: 'preview 只读；migrate 显式备份迁移为 schema 3，保留事实。须提供 expected_revision、operation_id 和 author_evidence，不自动升级随附工具。旧工具会拒绝新状态。' },
  workflow: { flags: ['project', 'input'], usage: 'show|set --project 作品目录 [--input 阶段.json]', purpose: 'show 只读；set 登记本轮阶段、任务和有限正文/修订范围。输入含 expected_revision、operation_id、author_evidence、workflow；普通作者用自然语言说明，由 Codex 按手册准备 JSON。planning.refs只填已存在的真实文件；新章先仅允许plan，outline可为draft且refs为空，plan建立细纲后再登记真实采用与有限正文范围，不用未来路径或空文件冒充采用。' },
  decision: { flags: ['project', 'input', 'unit'], usage: 'current|list|set --project 作品目录 [--unit 7] [--input 决策.json]', purpose: '当前作者计划与事实 ledger 分开。set 逐项列出 candidate/confirmed/withdrawn、采纳/排除/未决项；同主题同范围取代用新 ID + supersedes。不自动采纳整稿。' },
  tool: { flags: ['project', 'other','source','input'], usage: 'identify|compare|update-plan|enable|undo-enable|update|updates|recover [--project 作品目录] [--other 工具或作品目录] [--source 本地来源] [--input 输入.json]', purpose: 'identify/compare/update-plan只读。更新须外部入口、完整本地来源、作者依据、当前revision与计划指纹；schema5先显式enable为6。updates列中断事务，recover完成或回滚并保留备份。根技能/AGENTS/手册默认保留；详见tool-updates.md。' },
  protection: { flags: ['project', 'input'], usage: 'preview|enable --project 作品目录 [--input 启用.json]', purpose: '显式将 schema 3 备份升级为 schema 4，保留事实/原来源；旧 0.4 工具拒绝新状态。不更新随附工具。enable 输入 expected_revision、author_evidence。新作品默认已启用。' },
  source: { flags: ['project', 'input', 'unit'], usage: 'list|freeze|impact|bind|publish|stage|cancel --project 作品目录 [--input 来源.json] [--unit 7]', purpose: '冻结设定/细纲/卷纲/事实卡，按章生效；impact 只读，publish 必须绑定实际预览、实读报告和作者授权。历史变更先 stage，进入持久阻断，再在独立修订区发布和重登。原 source_hashes 不改写。详见手册。' },
  revision: { flags: ['project', 'input','unit','out'], usage: 'list|begin|continue|continue-repair|continue-revise|local-proof|adopt|resume|abort|transfer|prepare|commit|recover|unlock|replay-input --project 作品目录 [--input 修订.json] [--unit 5] [--out .writer/drafts/replay-5.json]', purpose: '复用独立区、CAS和可恢复事务。replay-input在回退后的独立区恢复旧摘要/changes并填当前哈希，须带revision-token；草案不算无变化结论，实读后填replay_review、先preview再record。prepare仍须完整尾段模型复核。continue-revise仅处理已登记第七章续写候选的封存小修，local-proof绑定候选实际修改；两者不发布主稿，详见revision-and-sources.md。' },
  'review-template':{flags:['project','from','to','out'],usage:'--project 作品目录 --from 1 --to 6 [--out .writer/drafts/review-1-6.json]',purpose:'生成待填章节功能表、模型比较和可选意见输入；不自动判断重复，不捏造引文或文学通过。'},
  'review-workflow':{flags:['project','input'],usage:'preview|enable --project 作品目录 [--input 启用.json]',purpose:'显式备份schema4并启用schema5，保持事实与旧登记，旧0.5工具拒绝新状态。输入expected_revision、author_evidence；新作品默认启用，不自动更新随附工具。'},
  'review-issues':{flags:['project','input','id'],usage:'list|resolve|apply|verify|acknowledge --project 作品目录 [--input 意见处置.json] [--id I_EXAMPLE]',purpose:'list按ID展开历史。resolve记录采用/保留/延期。apply默认须正文实改，可保留提交范围外未变参考章，verify仍覆盖全部证据；追踪实改显式change_scope=tracking。acknowledge补登记未采用或代理延期的高置信事实/连续性问题；拒绝作者取舍和既有采纳历史。输入commit_id、target_units、reason、decision_actor=agent-within-authorized-scope、当前authorization及CAS；核真实实改和未变参考章，明确是事后接受，之后仍须verify当前实读。详见review-and-registration.md。'},
  gate: { flags: [], usage: '<story-gate-studio 参数...>', purpose: '调用主项目原有质量引擎；独立作品不含该引擎。' }
};

export const quote = value => `'${String(value).replaceAll("'", "''")}'`;
export function invocation(root, command, args = []) {
  return `node ${quote(path.join(root, 'bin/ai-writer.mjs'))} ${command}${args.length ? ' ' + args.map(quote).join(' ') : ''}`;
}
export function help(root, version, command) {
  const legacyEmbedded = path.basename(path.dirname(root)) === '.writer'&&!/^0\.[789]\./.test(version??'');
  const guides = legacyEmbedded ? path.resolve(root, '../../docs') : path.join(root, 'docs');
  const skills = legacyEmbedded ? path.resolve(root, '../../.agents/skills') : path.join(root, '.agents/skills');
  const projectHint = command === 'init' ? 'init 使用 --path 指定新作品目录，不接受 --project。'
    : command === 'doctor' ? 'doctor 默认检查当前工具；可用 --project 指定作品。'
    : !command || COMMANDS[command]?.flags.includes('project') ? '在作品目录运行时可省略 --project；其他位置须明确提供作品目录。' : '';
  const footer = `\n${projectHint}\n作者手册：${path.join(guides, 'user-guide.md')}\n命令与 JSON：${path.join(guides, 'workflow.md')}\n长篇：${path.join(guides, 'long-form.md')}\n去 AI 味：${path.join(guides, 'deslop.md')}\n当前工具流程技能：${path.join(skills, 'writer-project/SKILL.md')}\n按文体继续读取该技能目录中的对应技能；作品根作者规则与定制技能仍需遵守，更新不自动替换它们。\n创作与审修改写由 Codex 根据自然语言任务完成。`;
  if (command) {
    const spec = COMMANDS[command];
    if (!spec) throw new Error(`未知命令：${command}`);
    return `ai-writer ${version} / ${command}\n${spec.purpose}\n\n${invocation(root, command)} ${spec.usage}\n${spec.example ? `\n示例参数：${spec.example}\n` : ''}${spec.input ? `\n输入示例（UTF-8 JSON）：\n${JSON.stringify(spec.input, null, 2)}\n` : ''}${footer}`;
  }
  return `ai-writer ${version} — Codex 文件创作工具（Node.js >=20，无额外依赖）\n\n${Object.entries(COMMANDS).map(([key, spec]) => `${key} ${spec.usage}\n  ${spec.purpose}`).join('\n')}\n\n查看单项帮助：${invocation(root, 'record', ['--help'])}${footer}`;
}
export function userError(message, details) { return Object.assign(new Error(message), details); }
export function errorResult(error, argv, root) {
  const command = COMMANDS[argv[0]] ? argv[0] : 'help';
  return { ok: false, error: error.message, code: error.code ?? 'COMMAND_FAILED',
    ...(error.file ? { file: error.file } : {}),
    ...Object.fromEntries(['field','allowed_values'].filter(key=>error[key]!==undefined).map(key=>[key,error[key]])),
    next_action: error.next_action ?? (['EPERM', 'EACCES'].includes(error.code) ? '检查该路径的写入权限或文件占用，保留原稿后重试；不要关闭全局安全设置。' : '按报错核对输入，查看本命令帮助。'),
    help_command: invocation(root, command, command === 'help' ? [] : ['--help']),
    ...(error.next_command ? { next_command: error.next_command } : {}),
    ...(error.recovery ? { recovery: error.recovery } : {}), ...(error.scope ? { scope: error.scope } : {}),
    ...Object.fromEntries(['transactions', 'sessions', 'conflicts', 'impacts','blockers','checks','context_budget'].filter(key => error[key]).map(key => [key, error[key]])) };
}
