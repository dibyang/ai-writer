import fs from 'node:fs';import path from 'node:path';import {fileURLToPath} from 'node:url';
const X=path.dirname(fileURLToPath(import.meta.url)),h=JSON.parse(fs.readFileSync(path.join(X,'cli-logs/e-begin/stdout.raw.txt'),'utf8')),p=JSON.parse(fs.readFileSync(path.join(h.workspace,'.writer/drafts/er-replay26.json'),'utf8'));
p.changes.ledger.P_W_STOOL_MATERIALS.reader_known=p.changes.ledger.P_W_STOOL_MATERIALS.reader_known.replace('27厘米','29厘米');p.changes.ledger.P_W_STOOL_MATERIALS.custody.condition=p.changes.ledger.P_W_STOOL_MATERIALS.custody.condition.replace('/27宽/','/29宽/');
fs.writeFileSync(path.join(X,'er-input-patch26.json'),JSON.stringify({changes:p.changes},null,2)+'\n',{flag:'wx'});
