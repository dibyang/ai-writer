import fs from 'node:fs';
import path from 'node:path';
import {work,read,hash} from './stage.mjs';
const [from,to]=process.argv.slice(2).map(Number),state=read(path.join(work,'.writer/state.json'));
for(const u of state.units.filter(x=>x.unit>=from&&x.unit<=to))console.log(`\nFILE ${u.draft} SHA256 ${hash(path.join(work,u.draft))}\n${fs.readFileSync(path.join(work,u.draft),'utf8')}`);
