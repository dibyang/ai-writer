import path from 'node:path';

export const COMMANDS = {
  init: { flags: ['path', 'kind', 'title'], usage: '--path 新目录 --kind novel|screenplay|history|essay --title 作品名', purpose: '建立作品和随附工具，不覆盖已有目录。', example: "--path 'works/雨夜来信' --kind novel --title '雨夜来信'" },
  plan: { flags: ['project', 'input'], usage: '--project 作品目录 --input 细纲.json', purpose: '保存下一章、场或篇的细纲。', input: { unit: 1, title: '来信', goal: '确认寄件人', change: '发现寄件时间不符', beats: ['核对邮戳'], cast: [], setting_refs: [], research_refs: [] } },
  context: { flags: ['project', 'unit', 'max-chars'], usage: '--project 作品目录 --unit 1 [--max-chars 40000]', purpose: '读取下一单元的写作上下文；须先保存细纲。' },
  'record-template': { flags: ['project', 'unit', 'draft'], usage: '--project 作品目录 --unit 1 --draft 正文/0001-来信.md', purpose: '动笔前取得登记模板。短篇填写 snapshot，长篇填写 changes；保留真实来源哈希。' },
  record: { flags: ['project', 'input'], usage: '--project 作品目录 --input 登记.json', purpose: '填写写前模板中的实际摘要与追踪，然后顺序登记正文。不要从手册抄写假哈希。' },
  status: { flags: ['project', 'view'], usage: '--project 作品目录 [--view compact|full]', purpose: '查看进度、过期来源、未登记正文和建议下一步。' },
  check: { flags: ['project'], usage: '--project 作品目录', purpose: '检查机械一致性与未登记正文；不裁定文学质量。' },
  rewind: { flags: ['project', 'from', 'expected-revision'], usage: '--project 作品目录 --from 1 --expected-revision 当前修订号', purpose: '备份并作废指定单元及后续追踪，保留正文。先 status 获取当前修订号。' },
  export: { flags: ['project', 'out'], usage: '--project 作品目录 --out 作品目录外的新目录', purpose: '导出已登记草稿，列出未纳入的正文；不覆盖旧导出。' },
  'long-enable': { flags: ['project', 'expected-revision'], usage: '--project 作品目录 --expected-revision 当前修订号', purpose: '备份迁移到长篇协议，再用 volume 建分卷计划。' },
  volume: { flags: ['project', 'input'], usage: '--project 作品目录 --input 分卷.json', purpose: '保存连续覆盖的分卷与剧情单元计划。', input: { id: 'V1', title: '来信', start: 1, end: 3, promises: ['找到寄件人'], constraints: [], reserved: [], arcs: [{ id: 'A1', start: 1, end: 3, goal: '核实来源', payoff: '排除误认', forbidden: [] }] } },
  outline: { flags: ['project', 'unit'], usage: '--project 作品目录 [--unit 1]', purpose: '查看长篇当前卷与剧情单元契约。' },
  recall: { flags: ['project', 'query', 'limit'], usage: '--project 作品目录 --query 关键词 [--limit 20]', purpose: '查找线索与证据位置；根据结果回读正文。' },
  review: { flags: ['project', 'input'], usage: '--project 作品目录 --input 审查登记.json', purpose: '登记已实际阅读的审查报告及正文哈希，不自动审稿。', input: { from: 1, to: 3, kind: 'model-self-review', report: '审查/1-3连读-r3.md', source_hashes: { '正文/0001.md': '按实际阅读版本填写，不能使用示例值' } } },
  'import-index': { flags: ['project', 'input'], usage: '--project 作品目录 --input 源文件清单.json', purpose: '为空的长篇作品冻结自有旧稿。files 必须按章顺序；相对源路径按命令 cwd 解析。', input: { rights: '作者自有作品，用于续写', files: ['D:/原书/第一章.md', 'D:/原书/第二章.md'] } },
  'import-status': { flags: ['project'], usage: '--project 作品目录', purpose: '查看导入进度、can_continue 与阻断路径。完成后转为正常续写。' },
  'import-next': { flags: ['project'], usage: '--project 作品目录', purpose: '取下一章冻结稿，实读、规划、登记后再取下一章。未登记时重复返回同一章。' },
  'import-relink': { flags: ['project', 'input', 'expected-revision'], usage: '--project 作品目录 --input 路径映射.json --expected-revision 当前修订号', purpose: '为同一冻结内容重定位原文件；内容哈希不同会拒绝。保留定位历史，不修改冻结清单与正文。', input: { files: [{ unit: 1, path: 'D:/新位置/第一章.md' }] } },
  'style-scan': { flags: ['project', 'draft', 'out'], usage: '--project 作品目录 --draft 正文/0001-标题.md [--out 审查/语言线索-r1.json]', purpose: '只读扫描表达线索，供去 AI 味实读复核；不自动改稿、不打 AI 概率分。可检查未登记正文。' },
  doctor: { flags: [], usage: '', purpose: '检查随附技能、用户文档和工具文件。' },
  gate: { flags: [], usage: '<story-gate-studio 参数...>', purpose: '调用主项目原有质量引擎；独立作品不含该引擎。' }
};

export const quote = value => `'${String(value).replaceAll("'", "''")}'`;
export function invocation(root, command, args = []) {
  return `node ${quote(path.join(root, 'bin/ai-writer.mjs'))} ${command}${args.length ? ' ' + args.map(quote).join(' ') : ''}`;
}
export function help(root, version, command) {
  const guides = path.basename(path.dirname(root)) === '.writer' ? path.resolve(root, '../../docs') : path.join(root, 'docs');
  const footer = `\n在作品目录运行时可省略 --project；其他位置须明确提供作品目录。\n作者手册：${path.join(guides, 'user-guide.md')}\n命令与 JSON：${path.join(guides, 'workflow.md')}\n长篇：${path.join(guides, 'long-form.md')}\n去 AI 味：${path.join(guides, 'deslop.md')}\n创作与审修改写由 Codex 根据自然语言任务完成。`;
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
    next_action: error.next_action ?? (['EPERM', 'EACCES'].includes(error.code) ? '检查该路径的写入权限或文件占用，保留原稿后重试；不要关闭全局安全设置。' : '按报错核对输入，查看本命令帮助。'),
    help_command: invocation(root, command, command === 'help' ? [] : ['--help']),
    ...(error.next_command ? { next_command: error.next_command } : {}) };
}
