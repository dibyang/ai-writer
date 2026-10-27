import fs from 'node:fs';import path from 'node:path';import {fileURLToPath} from 'node:url';
const X=path.dirname(fileURLToPath(import.meta.url)),h=JSON.parse(fs.readFileSync(path.join(X,'cli-logs/e-begin/stdout.raw.txt'),'utf8')),p=JSON.parse(fs.readFileSync(path.join(h.workspace,'.writer/drafts/er-replay21.json'),'utf8'));
p.summary=p.summary.replace('27厘米窄凳','29厘米窄凳').replace('后天下午三点半','后天下午三点二十');
for(const c of ['沈禾','沈成林','许蓉女儿'])p.changes.characters[c]=p.changes.characters[c].replace('后天下午三点半','后天下午三点二十');
p.changes.timeline_append[4]=p.changes.timeline_append[4].replace('后天下午三点半','后天下午三点二十');
for(const id of ['F_W_STOOL_WIDTH','P_W_STOOL_MATERIALS']){let s=JSON.stringify(p.changes.ledger[id]);s=s.replaceAll('净宽27','净宽29').replaceAll('长27宽','长29宽').replaceAll('二十七厘米','二十九厘米');p.changes.ledger[id]=JSON.parse(s);}
let s=JSON.stringify(p.changes.ledger.F_W_BOOK_RETURN);s=s.replaceAll('三点半','三点二十').replaceAll('15:30','15:20');p.changes.ledger.F_W_BOOK_RETURN=JSON.parse(s);
fs.writeFileSync(path.join(X,'er-input-patch21.json'),JSON.stringify({summary:p.summary,changes:p.changes},null,2)+'\n',{flag:'wx'});
