import fs from 'node:fs';
import path from 'node:path';
import { project, phase, read, sha, state, output, input, run, json, put } from './session.mjs';
const evidence = json(path.join(phase, 'author-evidence.json'));
const workflow = structuredClone(state().governance);
workflow.task = '按规则消费关系保守复核1–6；第1章原字节和旧设定保留，新三枚只从2生效；本会话仅重登至第3章停止交接；不写第7章';
workflow.authorization.revise_range.from = 1;
workflow.authorization.stop_conditions.unshift('第1章仅保守复核及原字节重登，保留RULES_V1、旧报价两枚；历史改价从2开始');
run('authorize-consumption-prefix', ['workflow', 'set', '--input', input('workflow-consumption-prefix', { expected_revision: state().revision, operation_id: 'native-two-consumption-prefix-1-through-6', author_evidence: evidence, workflow })]);
// The changed governance revision requires a fresh real impact preview, never a hand-edited impact.
run('impact-rules-historical-prefix', ['source', 'impact', '--input', input('impact-rules-v3-prefix', { version_id: 'RULES_V3_FROM2', from: 2, mode: 'historical' })]);
