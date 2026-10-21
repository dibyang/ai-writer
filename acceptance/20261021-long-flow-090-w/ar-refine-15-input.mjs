import fs from 'node:fs';import path from 'node:path';import {fileURLToPath} from 'node:url';
const W=path.dirname(fileURLToPath(import.meta.url));
const f=path.join(W,'inputs/ar-record-15-v1.json'),v=JSON.parse(fs.readFileSync(f,'utf8'));
const before='准其下午看书（非代办）',after='听她说下午去看书并叫她先去（非代办）';
if(!v.changes.characters['沈成林'].includes(before))throw Error('exact wording absent');
v.changes.characters['沈成林']=v.changes.characters['沈成林'].replace(before,after);
const dest=path.join(W,'inputs/ar-record-15-v2.json');fs.writeFileSync(dest,JSON.stringify(v,null,2)+'\n',{flag:'wx'});console.log('Saved v2; v1 retained; only adult agency wording refined.');
