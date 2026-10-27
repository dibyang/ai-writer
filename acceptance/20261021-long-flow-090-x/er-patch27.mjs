import fs from 'node:fs';import path from 'node:path';import {fileURLToPath} from 'node:url';
const X=path.dirname(fileURLToPath(import.meta.url)),h=JSON.parse(fs.readFileSync(path.join(X,'cli-logs/e-begin/stdout.raw.txt'),'utf8')),p=JSON.parse(fs.readFileSync(path.join(h.workspace,'.writer/drafts/er-replay27.json'),'utf8'));
p.changes.ledger.P_W_STOOL_MATERIALS.custody.condition=p.changes.ledger.P_W_STOOL_MATERIALS.custody.condition.replace('长27宽','长29宽');
fs.writeFileSync(path.join(X,'er-input-patch27.json'),JSON.stringify({changes:p.changes},null,2)+'\n',{flag:'wx'});
