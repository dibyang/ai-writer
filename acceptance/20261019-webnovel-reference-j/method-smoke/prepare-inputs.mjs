import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
const phase = path.dirname(fileURLToPath(import.meta.url));
const work = path.join(phase, 'work');
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const write = (name, value) => { const file = path.join(work, name); fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, value, { flag: 'wx' }); };
const json = (name, value) => write(name, JSON.stringify(value, null, 2) + '\n');
const requestBytes = fs.readFileSync(path.join(phase, 'request.raw.md'));
const request = requestBytes.toString('utf8');
write('研究/作者原始任务.md', requestBytes);
const samples = {};
for (const id of ['A', 'B', 'C']) {
  const match = request.match(new RegExp(`${id}“([^”]+)”`));
  if (!match) throw new Error(`Missing original sample ${id}`);
  const start = Buffer.byteLength(request.slice(0, match.index + 2), 'utf8');
  const bytes = requestBytes.subarray(start, start + Buffer.byteLength(match[1], 'utf8'));
  if (!bytes.equals(Buffer.from(match[1], 'utf8'))) throw new Error('Byte extraction mismatch');
  const file = `研究/原创测试段落-${id}.txt`;
  write(file, bytes);
  fs.chmodSync(path.join(work, file), 0o444);
  samples[id] = { file, bytes: bytes.length, sha256: hash(bytes), encoding: 'UTF-8, no BOM, no appended newline', source: '研究/作者原始任务.md', locator: `第9行 ${id} 的外层中文双引号内原文`, text: match[1] };
}
fs.writeFileSync(path.join(phase, 'sample-originals.json'), JSON.stringify(samples, null, 2) + '\n', { flag: 'wx' });
const quote = request.split(/\r?\n/)[4];
const evidence = { quote, local_source: '研究/作者原始任务.md', source_sha256: hash(requestBytes), locator: '本phase request.raw.md逐字复制，第5行；当前用户指令，无可用消息ID，不编造', recorded_by: 'Codex，知情的隔离方法实跑执行者' };
const base = { expected_revision: 0, operation_id: 'method-j-direction-from-request', author_evidence: evidence };
json('.writer/method-direction-input.json', { ...base, decision: { id: 'D_AUTHOR_DIRECTION', topic: '作者已给试验方向与故事边界', status: 'confirmed', options: ['作者当前给定的温和现实合作方向'], adopted_items: ['修船学徒想保住师傅留下的船坞', '偏温和现实日常，主要关系合作'], excluded_items: ['阴谋', '神秘电话', '超自然'], unresolved_items: ['总章数、船坞产权与经济模型未选', '师傅当前状况与终局未选', '人物名字、视角和阶段办法仍为模型候选'], effective_range: { from: 1, to: null } } });
const summaries = [
  { unit: 1, title: '先看这条船', goal: '计划让林遥了解一项维修的需要，作有限承诺', change: '拟从独自想保住船坞，走向与余青核清时间与分工；结果尚未发生', beats: ['开场承接保住船坞的愿望，仅作为计划起点', '与船主商量需要，再同余青核对工时和能力', '候选选择：只答应可以承担的部分，以分工或准备收束'], cast: ['林遥', '余青', '船主'] },
  { unit: 2, title: '把工时留出来', goal: '计划承接第1章的有限承诺，开始处理候选维修', change: '拟让两人的时间安排或意见差成为需要商量的具体选择，不预设维修已经完成', beats: ['开场核对第1章成稿实际留下的工作量与约定', '在候选维修中协商一次分工或时间差，技术操作待资料核实', '以当下能做的部分和下一步安排收束，不用事故放大'], cast: ['林遥', '余青'] },
  { unit: 3, title: '一起吃顿饭', goal: '计划用低压日常展现相互照看与合作习惯的小变化', change: '拟让轮换吃饭或照看材料成为关系收益；不把未交付的维修登记为完成', beats: ['开场只承接第2章成稿实际完成的进度', '通过轮换吃饭、照看材料或核对下一步展现双方需要', '容许安静余韵，保留仍待处理的任务，不强制危机或强悬念'], cast: ['林遥', '余青'] }
];
for (const plan of summaries) json(`.writer/method-plan-${plan.unit}.json`, { ...plan, arc_id: 'A1', setting_refs: ['设定/作品定位.md', '设定/文风.md', '设定/权威规则.md', '大纲/全书大纲.md'], research_refs: [], forbidden: ['不得当成已写事实', '不添加阴谋、神秘电话或超自然', '不预制正文句子', '不强制事故、强悬念', '不把行业操作假设当成已核事实'] });
json('.writer/method-volume-v1.json', { id: 'V1', title: '先把一件事做完（模型候选，章界可调）', start: 1, end: 6, promises: ['计划处理一项有限维修并交代检验与约定；尚无完成事实'], constraints: ['保持温和现实合作', '技术办法未核', '范围为工具规划占位，不承诺六章正好结卷'], reserved: ['长期生计、产权、结局和师傅状况未定'], arcs: [{ id: 'A1', start: 1, end: 6, goal: '候选：从争取一项活到承担有限交付责任', payoff: '拟兑现这一次维修；完成后才可能产生后续复查与安排责任', forbidden: ['不取消本卷承诺来延长篇幅', '不登记未来事实'] }] });
json('.writer/method-volume-v2.json', { id: 'V2', title: '怎样一起过下去（仅远期骨架）', start: 7, end: 12, promises: ['计划协商并运行一次可履行的安排；下一卷兑现仍未发生'], constraints: ['须承接阶段一实际成稿的结果', '不细化第4–12章情节', '连续范围可调，不是全书章数承诺'], reserved: ['最终经营方式、是否缩短与终局仍待作者选择'], arcs: [{ id: 'A2', start: 7, end: 12, goal: '候选：在复查责任、旧约与新询问之间协商工时', payoff: '拟让合作方式和生活节奏改变；不宣称船坞已稳定', forbidden: ['不只是换船再修漏水', '不以未写计划回填事实', '不新增阴谋或神秘电话'] }] });
fs.writeFileSync(path.join(phase, 'author-evidence.json'), JSON.stringify(evidence, null, 2) + '\n', { flag: 'wx' });
process.stdout.write(JSON.stringify({ samples, request_sha256: hash(requestBytes), prepared_plan_units: [1, 2, 3] }, null, 2) + '\n');
