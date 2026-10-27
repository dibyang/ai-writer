import fs from 'node:fs';import path from 'node:path';import {fileURLToPath} from 'node:url';
const X=path.dirname(fileURLToPath(import.meta.url)),h=JSON.parse(fs.readFileSync(path.join(X,'cli-logs/e-begin/stdout.raw.txt'),'utf8')),p=JSON.parse(fs.readFileSync(path.join(h.workspace,'.writer/drafts/er-replay23.json'),'utf8'));
const patch={summary:p.summary.replace('尺寸仍27','尺寸仍29'),changes:structuredClone(p.changes)};
for(const c of ['周岸','面摊主'])patch.changes.characters[c]=patch.changes.characters[c].replaceAll('27','29');
patch.changes.timeline_append[1]=patch.changes.timeline_append[1].replace('凳仍27','凳仍29');
for(const id of ['F_W_STOOL_WIDTH','P_W_STOOL_MATERIALS'])patch.changes.ledger[id]=JSON.parse(JSON.stringify(patch.changes.ledger[id]).replaceAll('27','29').replaceAll('二十七','二十九'));
fs.writeFileSync(path.join(X,'er-input-patch23.json'),JSON.stringify(patch,null,2)+'\n',{flag:'wx'});
