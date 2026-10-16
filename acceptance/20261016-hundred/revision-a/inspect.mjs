import fs from 'node:fs';
import path from 'node:path';
import {replaySnapshots} from '../rebuild-utils.mjs';
import {stage,work,read,save} from './stage.mjs';
const frozen=path.join(stage,'before/work'),state=read(path.join(frozen,'.writer/state.json'));
const snaps=replaySnapshots(frozen,state);save(path.join(stage,'before/snapshots.json'),snaps);
let sources='';for(const p of ['writer.json','设定/作品定位.md','设定/文风.md','设定/权威规则.md','设定/角色卡.md','大纲/全书大纲.md','大纲/续部总纲.md'])sources+=`\n\nFILE ${p}\n${fs.readFileSync(path.join(frozen,p),'utf8')}`;
for(const p of fs.readdirSync(path.join(frozen,'大纲/分卷')))sources+=`\n\nFILE 大纲/分卷/${p}\n${fs.readFileSync(path.join(frozen,'大纲/分卷',p),'utf8')}`;
save(path.join(stage,'before/current-sources.txt'),sources);
save(path.join(stage,'before/plans25-42.json'),state.units.slice(24).map(u=>read(path.join(frozen,`大纲/单元/${String(u.unit).padStart(4,'0')}.json`))));
const strip=e=>Object.fromEntries(Object.entries(e).filter(([k])=>k!=='evidence'));
let ledger='SNAPSHOT AT 24\n'+JSON.stringify({...snaps[24],ledger:Object.fromEntries(Object.entries(snaps[24].ledger).map(([k,v])=>[k,strip(v)]))},null,2);
for(let n=25;n<=42;n++){
 const s=snaps[n],p=snaps[n-1];
 ledger+=`\n\nUNIT ${n} SUMMARY\n${state.units[n-1].summary}\nCHARACTERS\n${JSON.stringify(s.characters)}\nTIMELINE APPENDED\n${JSON.stringify(s.timeline.slice(p.timeline.length))}\nLEDGER CHANGED\n`;
 for(const [id,v]of Object.entries(s.ledger))if(JSON.stringify(v)!==JSON.stringify(p.ledger[id]))ledger+=`${id}\n${JSON.stringify({...strip(v),evidence:v.evidence?.filter(e=>e.unit===n)},null,2)}\n`;
}save(path.join(stage,'before/ledger-reading.txt'),ledger);
console.log(JSON.stringify({snapshots:snaps.length,sources:sources.length,ledger:ledger.length,plans:18}));
