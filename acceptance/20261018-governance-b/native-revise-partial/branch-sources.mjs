import fs from 'node:fs';
import path from 'node:path';
import { phase, state, output, input, run, json, put, sha, bundle } from './session.mjs';
const session = json(path.join(phase, 'revision-session.json'));
const p = session.workspace, token = session.token;
const evidence = json(path.join(phase, 'author-evidence.json'));
const specs = {
  skeleton: { ref: '大纲/全书大纲.md', file: '研究/第二会话-全书骨架候选.md', version_id: 'SKELETON_V2_FROM2' },
  volume1: { ref: '大纲/分卷/V1.json', file: '研究/第二会话-卷V1候选.json', version_id: 'VOLUME1_V2_FROM2', previous: 'VOLUME1_V1' },
  volume2: { ref: '大纲/分卷/V2.json', file: '研究/第二会话-卷V2候选.json', version_id: 'VOLUME2_V2_FROM2', previous: 'VOLUME2_V1' }
};
const [action, key] = process.argv.slice(2), spec = specs[key];
if (!spec) throw Error('source key');
if (action === 'prepare') {
  run('branch-freeze-' + key, ['source', 'freeze', '--input', input('branch-freeze-' + key, { expected_revision: state(p).revision, operation_id: 'native-two-branch-freeze-' + key, ...spec })], p, token);
  const r = run('branch-impact-' + key, ['source', 'impact', '--input', input('branch-impact-' + key, { version_id: spec.version_id, from: 2, mode: 'future' })], p, token);
  bundle('branch-required-' + key, p, Object.keys(r.impact.required_readings));
}
if (action === 'publish') {
  const impact = output('branch-impact-' + key).impact;
  const conclusion = { skeleton: '实读旧骨架与候选：保留六章主线、第一章两枚旧报价，仅更新第2章三枚及第5章退款三枚；没有已登记消费者，旧入口留存供第1章使用。新骨架从2持续生效。', volume1: '实读旧V1与候选：1–3范围和查问柳婆回收不变，押钱承诺改为第一章两枚旧报价、第二章三枚。旧VOLUME1_V1仍供1章，候选从2生效。', volume2: '实读旧V2与候选：4–6范围、印痕解释与私信回收不变；第5章退三枚、禁止逆改1章。旧V2事件保留；候选从2生效，4–6尚待实际修改重登，不作事实。' }[key];
  const report = '审查/第二会话-计划版本-' + key + '.md';
  put(path.join(p, report), '# 修订区计划版本影响实读\n\n性质：Codex知情实读，非文学或真人验收。实际读取原稿六章与旧输入readings/old-consumed-inputs.md，以及本次impact.required_readings所列全部字节，路径与SHA见publish输入，副本readings/branch-required-' + key + '.md。\n\n' + conclusion + '\n\nfrom=2，mode=future是因为修订区已经rewind1、当前未登记单元，并不否认主稿历史修订性质；主稿历史pending仍保留。replaced_ranges逐项以真实impact为准，原提案、旧冻结和旧入口不删除。无方案语义未决；4–6正文、账本及尾段复核仍是未完成任务。\n');
  run('branch-publish-' + key, ['source', 'publish', '--input', input('branch-publish-' + key, { expected_revision: state(p).revision, operation_id: 'native-two-branch-publish-' + key, author_evidence: evidence, impact, review: { report, report_sha256: sha(fs.readFileSync(path.join(p, report))), readings: impact.required_readings, conclusion, unresolved: [] } })], p, token);
}
