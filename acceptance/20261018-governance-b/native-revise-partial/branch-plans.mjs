import fs from 'node:fs';
import path from 'node:path';
import { phase, json, input, run, put } from './session.mjs';
const { workspace: p, token } = json(path.join(phase, 'revision-session.json'));
for (const n of [2,5,6]) {
  const ref = `大纲/单元/${String(n).padStart(4,'0')}.json`;
  const oldBytes = fs.readFileSync(path.join(p, ref));
  put(path.join(phase, 'original', ref), oldBytes);
  const plan = JSON.parse(oldBytes.toString('utf8'));
  if (n === 2) {
    plan.title = '三枚押钱';
    plan.change = '保留昨夜两枚旧报价；次晨阿禾见新告示、当面获悉三枚，从钱绳补足一枚缴押并取三枚收条；铜片验记交回阿禾带往旧柜';
    plan.forbidden = ['不逆改第一章两枚旧报价或令人物提前知三枚', '不跳过铜片保管动作'];
    plan.beats[0] = '按昨夜报价备两枚，柜前见新告示、周叔说明后另添一枚，逐枚交三枚并取收条';
  }
  if (n === 5) {
    plan.goal = '现场查清缺角印、领信并退三枚押钱';
    plan.change = '旧印补角高差解释缺角；信件因柜号错列搁置，铜片归档，阿禾退得三枚';
    plan.forbidden[1] = '不改第一章两枚旧报价；本次按第二章三枚收条全退，不抵扣或漏退';
    plan.beats[2] = '周叔留铜片归档，将三枚押钱退给阿禾并交信；两枚洗亮、一枚未洗的细节应与第二章对应';
  }
  if (n === 6) plan.beats[0] = '回家收妥三枚退钱，拆信';
  run('branch-plan-' + n, ['plan','--input',input('branch-plan-' + n, plan)], p, token);
}
run('branch-context-1', ['context','--unit','1','--purpose','revision'], p, token);
run('branch-template-1', ['record-template','--unit','1','--draft','正文/0001-铜片的耳.md'], p, token);
