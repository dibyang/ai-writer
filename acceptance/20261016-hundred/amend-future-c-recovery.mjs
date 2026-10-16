import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
const base = path.dirname(fileURLToPath(import.meta.url));
const hash = b => crypto.createHash('sha256').update(b).digest('hex');
const appendix = '\n第三轮改稿后续验证要求：当前精确完整ID recall已优先返回本项；前述可能先关联项是旧版本经验，仍须核对实际id。全新的恢复必须从当前文件自行确认门闩同笔费用、程蔚所选原录遍次、留椅约末及自主离开时刻，并在recovery.md列真实当前证据与角色获得信息的时点，不以本段代替恢复。当前纸页/声音退出的未核范围应从追踪和正文查清，特别区分27当面改词后留邱的单页、31新印缺名两页、罗的归宿说明、37沈自页；不能由一份的去向猜另一份。当前待核实体只在有现场核问/可信当前口述后推进，作者回读不自动给何或其他角色同步。跨卷回收需真正展开生活场景，尽量在100前使旧纸页退出与通知边界获得可验证进展，同时保留确实未核对象，不用“全都处理”抹去未知。不要为测试强行把作者未知余带来源解出、擅自改变旧due或重开已结主线。仍逐章2400—3200正文Han，保留所有原始失败和完整记录。\n';
const results = [];
for (const phase of ['session-12','session-13']) {
  const folder = path.join(base, phase), file = path.join(folder, 'request.md');
  if (fs.existsSync(path.join(folder, 'events.jsonl'))) throw Error('Cannot amend started session ' + phase);
  const before = fs.readFileSync(file), backup = path.join(folder, 'request-before-c-recovery.md');
  fs.writeFileSync(backup, before, { flag: 'wx' });
  fs.writeFileSync(file, Buffer.concat([before, Buffer.from(appendix)]));
  const after = fs.readFileSync(file);
  if (!after.subarray(0, before.length).equals(before) || after.subarray(before.length).toString('utf8') !== appendix) throw Error('Append proof failed');
  results.push({ phase, before_sha256: hash(before), after_sha256: hash(after), backup_sha256: hash(fs.readFileSync(backup)), exact_original_prefix_retained: true, appended: appendix });
}
fs.writeFileSync(path.join(base, 'future-c-recovery-amendments.json'), JSON.stringify({ scope: 'Before-launch request append only; does not assert current story facts without actual file recovery', results }, null, 2) + '\n', { flag: 'wx' });
console.log(JSON.stringify({ ok: true, phases: results.map(x=>x.phase) }));
