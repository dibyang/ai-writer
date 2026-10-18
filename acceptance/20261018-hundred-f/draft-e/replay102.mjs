import fs from 'node:fs';import {session,sha} from '../session-support.mjs';
const r=JSON.parse(fs.readFileSync(new URL('revision-local.json',import.meta.url))),s=session('draft-e',{project:r.workspace,token:r.token});
const t=JSON.parse(fs.readFileSync(s.project+'/.writer/drafts/f-e-replay-102.json'));
const report='审查/F-E-102重登核查.md',body=fs.readFileSync(s.project+'/'+t.draft);
fs.writeFileSync(s.project+'/'+report,'# 102受保护重登核查\n\n实际Codex知情自检。根稿原102与103完整读后核分支初始SHA等同；分支102改句后再完整读1—106行。唯一改句：拿勺将汤面那点油吹开 → 低头将汤面那点油吹开。动宾搭配、默读模拟朗读均复核，其他不改。\n\n六项实际核查：summary的63日到场、输局、19:28交场/20:24自归均仍成立；characters只更新两人在本章真实位置与知识，周到家仍是消息；timeline未增删；ledger新球约resolved指当次实去，不倒改74/78或81；evidence逐条对正文全部仍在且不跨改句；downstream103早餐汤底/袖口/周上班消息均不借这句吹汤改变因果，不新增同住、原音或旧纸知情。未发现需改summary/changes之处，保留实际replay草案。\n\n正文SHA256='+sha(body)+'。不是自动判断、真人盲读或文学通过。\n',{flag:'wx'});
t.replay_review={reviewer:'actual-Codex-draft-e-informed-self-review',report,draft_sha256:sha(body),checked_fields:['summary','characters','timeline','ledger','evidence','downstream']};
s.write('replay-record-102.json',t);const p=s.run('replay-preview-102',['record-preview'],{input:t});console.log({ok:p.value.ok,findings:p.value.findings,source_hashes:p.value.source_hashes});
console.log(s.run('replay-record-102',['record'],{input:t}).value);
for(const [label,args] of [['fix-outline-103',['outline','--unit','103']],['fix-context-103',['context','--unit','103','--purpose','revision','--max-chars','160000']],['replay-input-103',['revision','replay-input','--unit','103','--out','.writer/drafts/f-e-replay-103.json']]]){const q=s.run(label,args);console.log(q.label,q.value?.ok??'template');}
