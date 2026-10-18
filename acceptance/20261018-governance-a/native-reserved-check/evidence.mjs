import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';

const root = process.cwd();
const base = path.resolve('acceptance/20261018-governance-a');
const stage = path.join(base, 'native-reserved-check');
const work = path.join(stage, '最终交付重放作品');
const source = path.join(base, 'native-final-check/最终回归微型作品/正文/0001-提手.md');
const sha = b => crypto.createHash('sha256').update(b).digest('hex');
const readJSON = p => JSON.parse(fs.readFileSync(p, 'utf8'));
const writeJSON = (p, value) => fs.writeFileSync(p, JSON.stringify(value, null, 2) + '\n', { flag: 'wx' });
const writeText = (p, value) => fs.writeFileSync(p, value, { flag: 'wx' });
function inventory(dir, skip = () => false) {
  const files = [];
  if (!fs.existsSync(dir)) return files;
  function visit(at, rel = '') {
    for (const entry of fs.readdirSync(at, { withFileTypes: true }).sort((a,b) => a.name.localeCompare(b.name))) {
      const key = rel ? rel + '/' + entry.name : entry.name;
      if (skip(key, entry)) continue;
      const file = path.join(at, entry.name);
      if (entry.isSymbolicLink()) files.push({ path: key, symlink: fs.readlinkSync(file) });
      else if (entry.isDirectory()) visit(file, key);
      else { const b = fs.readFileSync(file); files.push({ path: key, bytes: b.length, sha256: sha(b) }); }
    }
  }
  visit(dir); return files;
}
function protectedSnapshot() {
  return {
    captured_at: new Date().toISOString(),
    workspace: inventory(root, key => ['.git','node_modules','acceptance'].includes(key.split('/')[0])),
    other_acceptance: inventory(base, key => key === 'native-reserved-check' || /^commands\/native-four-/.test(key)),
    actual_work: { path: 'D:/work/小说/dzkxqxx', files: inventory('D:/work/小说/dzkxqxx', key => key.split('/')[0] === '.git') }
  };
}
function observe() {
  const state = path.join(work, '.writer/state.json');
  const bytes = fs.existsSync(state) ? fs.readFileSync(state) : null;
  return { captured_at: new Date().toISOString(), exists: fs.existsSync(work), state_sha256: bytes && sha(bytes), revision: bytes && JSON.parse(bytes).revision, drafts: inventory(path.join(work, '正文')), work_files: inventory(work) };
}
function cli(label, argv) {
  if (!/^native-four-[a-z0-9-]+$/.test(label)) throw Error('Invalid capture label');
  const before = observe();
  const result = spawnSync(process.execPath, [path.join(base,'capture.mjs'), label, ...argv], { cwd: root, windowsHide: true, timeout: 60000, maxBuffer: 100 * 1024 * 1024 });
  const after = observe();
  const capture = path.join(base, 'commands', label);
  const record = readJSON(path.join(capture, 'result.json'));
  const observation = { label, before, after, capture_exit_code: result.status, result: record, state_unchanged: before.state_sha256 === after.state_sha256, drafts_unchanged: JSON.stringify(before.drafts) === JSON.stringify(after.drafts), work_files_unchanged: JSON.stringify(before.work_files) === JSON.stringify(after.work_files) };
  fs.mkdirSync(path.join(stage, 'observations'), { recursive: true });
  writeJSON(path.join(stage,'observations',label+'.json'), observation);
  let out, err;
  try { out = readJSON(path.join(capture, 'stdout.raw.txt')); } catch { out = fs.readFileSync(path.join(capture,'stdout.raw.txt'),'utf8'); }
  try { err = readJSON(path.join(capture, 'stderr.raw.txt')); } catch { err = fs.readFileSync(path.join(capture,'stderr.raw.txt'),'utf8'); }
  console.log(JSON.stringify({ label, exit_code: record.exit_code, before_revision: before.revision, after_revision: after.revision, state_unchanged: observation.state_unchanged, drafts_unchanged: observation.drafts_unchanged, stdout: out, stderr: err }));
  if (result.error) throw result.error;
}
const state = () => readJSON(path.join(work,'.writer/state.json'));
const quote = '本轮仅在新建验收作品中复用第三轮 `native-final-check/最终回归微型作品` 的第1章原文字节作为测试草稿，先实际读完再登记，不改原稿和原作品。地点沿用旧渡口方案，纸签与铜铃仍为候选，不自行选赠物。允许远期结构暂缓，只授权本测试作品第1章，完成登记后先转只讨论总纲，再暂停全部创作动作，仅查看任务。这个重放不算新创作篇幅。';
function evidence() {
  return { quote, local_source: '研究/本轮作者原话.txt', source_sha256: sha(fs.readFileSync(path.join(work,'研究/本轮作者原话.txt'))), locator: '本阶段用户任务中的测试作者指令；完整原话第1行，无可用消息ID', recorded_by: 'Codex 主会话，本地CLI重放执行者' };
}
const reason = '作者明确允许远期结构暂缓，本轮仅复用第1章验证工具流程；登记后先讨论总纲再全部暂停，不延展剧情。';
function workflow(stageName) {
  const trial = stageName === 'trial';
  return { stage: stageName, task: trial ? '仅复用已完整读过的第三轮第1章，登记并复盘后转总纲讨论' : stageName === 'structure' ? '第1章已登记并完成本轮复盘；仅讨论和规划总纲，不写第2章' : '暂停全部创作动作，仅只读查看当前任务', authorization: { allowed_actions: trial ? ['discuss','plan','draft'] : stageName === 'structure' ? ['discuss','plan'] : [], draft_range: trial ? {from:1,to:1} : null, revise_range: null, stop_conditions: trial ? ['第1章复用登记后核对事实与候选边界，转为只讨论总纲，然后暂停全部创作动作'] : ['未经作者新明确指令，不恢复正文或扩大范围'] }, planning: { positioning: {status:'draft',refs:['设定/作品定位.md'],unresolved_ids:[]}, structure:{status:'deferred',refs:[],unresolved_ids:['远期结构'],reason},volume:{status:'missing',refs:[],unresolved_ids:[]},outline:{status:'draft',refs:[],unresolved_ids:[]} } };
}
const [action, ...args] = process.argv.slice(2);
if (action === 'baseline') {
  writeJSON(path.join(stage,'protected-before.json'), protectedSnapshot());
  writeText(path.join(stage,'author-instruction.txt'), quote + '\n');
  writeJSON(path.join(stage,'reading-evidence.json'), {reader:'Codex 主会话',method:'使用 FastCtx read 完整读取第1至18行，未截断',source,source_sha256:sha(fs.readFileSync(source)),read_completed_before_copy:true,summary:'旧渡口，许桥替老人重绑纸灯提手，以细麻绳穿孔绕竹箍并打结，试提后请老人提灯；无赠物选择。',new_literary_creation:false});
  console.log('Protected baseline and real author instruction saved.');
} else if (action === 'cli') {
  cli(args[0], args.slice(1));
} else if (action === 'prepare') {
  writeText(path.join(work,'研究/本轮作者原话.txt'),quote+'\n');
  fs.writeFileSync(path.join(work,'设定/作品定位.md'),'# 最终交付重放作品\n\n本作品仅用于最终治理构建验收，逐字节复用第三轮第1章《提手》，不计新增文学创作。地点沿用旧渡口；纸签与铜铃只是候选赠物，均未采纳。远期结构按作者指令暂缓。本轮仅第1章，登记后先讨论总纲，再暂停全部创作动作。\n','utf8');
  const common = {expected_revision:state().revision,operation_id:'toString',author_evidence:evidence(),workflow:workflow('trial')};
  writeJSON(path.join(stage,'workflow-trial.json'),common);
  for (const id of ['prototype','constructor','__proto__']) writeJSON(path.join(stage,'workflow-reserved-'+id+'.json'),{...common,operation_id:id});
  const d = { id:'D_LOCATION_NATIVE_FOUR',topic:'第1章地点',status:'confirmed',options:['旧渡口方案'],adopted_items:['旧渡口方案'],excluded_items:[],unresolved_items:[],effective_range:{from:1,to:1} };
  for (const [i,id] of ['prototype','constructor','__proto__'].entries()) writeJSON(path.join(stage,'decision-reserved-'+id+'.json'),{expected_revision:state().revision,operation_id:'decision-reserved-'+(i+1),author_evidence:evidence(),decision:{...d,id}});
  writeJSON(path.join(stage,'plan-1.json'),{unit:1,title:'提手',goal:'核对并复用许桥在旧渡口修补纸灯提手的完整原稿',change:'纸灯提手由磨断松脱到重绑并经试提，老人能提灯离开；不增加赠物选择',beats:['老人将松脱提手的纸灯放在旧渡口矮桌','许桥穿绳绕竹箍，打结并修整绳尾','许桥试提后请老人提灯'],cast:['许桥','老人'],setting_refs:['设定/作品定位.md'],research_refs:[],forbidden:['不修改复用原文字节','不将纸签或铜铃从候选改成已选','不增加第2章或后续事件']});
  console.log('Valid workflow and decision inputs generated outside the work.');
} else if (action === 'decision-input') {
  const gift = args[0] === 'gift';
  writeJSON(path.join(stage,'decision-'+args[0]+'.json'),{expected_revision:state().revision,operation_id:gift?'native-four-gift':'native-four-location',author_evidence:evidence(),decision:gift?{id:'D_GIFT_NATIVE_FOUR',topic:'赠物选择',status:'candidate',options:['纸签','铜铃'],adopted_items:[],excluded_items:[],unresolved_items:['纸签与铜铃仍为候选，未授权自行选择'],effective_range:{from:1,to:null}}:{id:'D_LOCATION_NATIVE_FOUR',topic:'第1章地点',status:'confirmed',options:['旧渡口方案'],adopted_items:['旧渡口方案'],excluded_items:[],unresolved_items:[],effective_range:{from:1,to:1}}});
} else if (action === 'copy-record') {
  const templatePath = path.join(base,'commands/native-four-template-1/stdout.raw.txt');
  const template = readJSON(templatePath);
  console.log(JSON.stringify({template_keys:Object.keys(template)}));
  const record = template.template ?? template;
  if (!record.source_hashes || record.expected_revision !== state().revision || record.summary) throw Error('Unexpected new record template');
  const bytes = fs.readFileSync(source);
  const target = path.join(work,record.draft);
  fs.writeFileSync(target, bytes, {flag:'wx'});
  record.summary = '许桥在旧渡口为老人修补纸灯提手：用细麻绳穿过提手小孔绕竹箍，打结修整后试提，老人随后提灯；赠物未出现也未选择。';
  record.changes = {characters:{'许桥':'旧渡口；已替老人重新绑牢纸灯提手并试提确认','老人':'旧渡口；纸灯提手修妥，已亲手提起纸灯'},timeline_append:['旧渡口：老人带来纸灯，许桥重绑提手并试提，老人亲手提灯。'],ledger:{}};
  writeJSON(path.join(stage,'record-1.json'),record);
  writeJSON(path.join(stage,'copy-evidence.json'),{copied_at:new Date().toISOString(),source,target,source_sha256:sha(bytes),target_sha256:sha(fs.readFileSync(target)),bytes:bytes.length,text_characters:[...bytes.toString('utf8')].length,han_characters:(bytes.toString('utf8').match(/\p{Script=Han}/gu)||[]).length,identical:bytes.equals(fs.readFileSync(target)),new_literary_characters:0,classification:'复用原文；不是新增文学创作',record_template_path:templatePath,record_template_sha256:sha(fs.readFileSync(templatePath)),source_hashes_origin:'本阶段主工具 native-four-template-1 的实际输出，未读取旧 state 或旧 source_hashes'});
} else if (action === 'workflow-input') {
  writeJSON(path.join(stage,'workflow-'+args[0]+'.json'),{expected_revision:state().revision,operation_id:'native-four-'+args[0],author_evidence:evidence(),workflow:workflow(args[0])});
} else if (action === 'after') {
  const after = protectedSnapshot();
  writeJSON(path.join(stage,'protected-after.json'), after);
  const before = readJSON(path.join(stage,'protected-before.json'));
  const comparisons = {};
  for (const key of ['workspace','other_acceptance','actual_work']) comparisons[key] = {unchanged:JSON.stringify(before[key]) === JSON.stringify(after[key]), before_files:Array.isArray(before[key])?before[key].length:before[key].files.length,after_files:Array.isArray(after[key])?after[key].length:after[key].files.length};
  writeJSON(path.join(stage,'protected-comparison.json'),comparisons);
  console.log(JSON.stringify(comparisons));
} else throw Error('Unknown evidence action');
