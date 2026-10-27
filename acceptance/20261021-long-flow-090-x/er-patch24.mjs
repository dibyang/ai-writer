import fs from 'node:fs';import path from 'node:path';import {fileURLToPath} from 'node:url';
const X=path.dirname(fileURLToPath(import.meta.url)),h=JSON.parse(fs.readFileSync(path.join(X,'cli-logs/e-begin/stdout.raw.txt'),'utf8')),p=JSON.parse(fs.readFileSync(path.join(h.workspace,'.writer/drafts/er-replay24.json'),'utf8'));
const patch={summary:p.summary.replaceAll('20:30','20:40').replace('晚市27','晚市29'),changes:structuredClone(p.changes)};
patch.changes.characters.许蓉女儿=patch.changes.characters.许蓉女儿.replace('20:30','20:40');patch.changes.characters.面摊主=patch.changes.characters.面摊主.replace('仍27','仍29');
patch.changes.timeline_append[2]=patch.changes.timeline_append[2].replace('用27','用29');patch.changes.timeline_append[3]=patch.changes.timeline_append[3].replace('20:30','20:40');
let s=JSON.stringify(patch.changes.ledger.T_W_EVENING_CLASS);patch.changes.ledger.T_W_EVENING_CLASS=JSON.parse(s.replaceAll('每回一个半小时','每回100分钟').replaceAll('20:30','20:40').replaceAll('八点半，老师叫收针。','八点四十，老师叫收针。'));
for(const id of ['F_W_STOOL_WIDTH','P_W_STOOL_MATERIALS'])patch.changes.ledger[id]=JSON.parse(JSON.stringify(patch.changes.ledger[id]).replaceAll('27','29').replaceAll('二十七','二十九'));
fs.writeFileSync(path.join(X,'er-input-patch24.json'),JSON.stringify(patch,null,2)+'\n',{flag:'wx'});
