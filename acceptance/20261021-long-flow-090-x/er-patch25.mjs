import fs from 'node:fs';import path from 'node:path';import {fileURLToPath} from 'node:url';
const X=path.dirname(fileURLToPath(import.meta.url)),h=JSON.parse(fs.readFileSync(path.join(X,'cli-logs/e-begin/stdout.raw.txt'),'utf8')),p=JSON.parse(fs.readFileSync(path.join(h.workspace,'.writer/drafts/er-replay25.json'),'utf8'));
p.changes.ledger.T_W_EVENING_CLASS.character_known.许蓉女儿=p.changes.ledger.T_W_EVENING_CLASS.character_known.许蓉女儿.replace('20:30','20:40');
fs.writeFileSync(path.join(X,'er-input-patch25.json'),JSON.stringify({changes:p.changes},null,2)+'\n',{flag:'wx'});
