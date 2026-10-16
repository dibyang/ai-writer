import fs from 'node:fs';
import path from 'node:path';
import {stage,work} from './run-cli.mjs';
const s=JSON.parse(fs.readFileSync(path.join(work,'.writer/state.json'),'utf8'));
const active=Object.fromEntries(Object.entries(s.snapshot.ledger).filter(([id,e])=>['active','pending','partial'].includes(e.status)).map(([id,e])=>{const {evidence,...fields}=e;return[id,{...fields,evidence_locations:evidence.map(x=>({unit:x.unit,draft:x.draft,quote:x.quote}))}];}));
fs.writeFileSync(path.join(stage,'ledger-current-view.json'),JSON.stringify(active,null,2)+'\n');
const history=JSON.parse(fs.readFileSync(path.join(stage,'replayed-initial.json'),'utf8'));
let prev={}; const diffs=[];
for(let unit=0;unit<history.snapshots.length;unit++){
 const s=history.snapshots[unit];
 const v={timeline:s.timeline.filter(x=>/缺轮/.test(x)),room:s.ledger?.O_ROOM_TONE?.statement,reader:s.ledger?.T_SOUND_CONTEXT?.reader_known,gu:s.ledger?.T_SOUND_CONTEXT?.character_known?.顾遥};
 const change=Object.fromEntries(Object.entries(v).filter(([k,v])=>v!==prev[k]&&JSON.stringify(v)!==JSON.stringify(prev[k])));
 if(Object.keys(change).length)diffs.push({unit,change});prev=v;
}
fs.writeFileSync(path.join(stage,'tracking-diff-view.json'),JSON.stringify(diffs,null,2)+'\n');
console.log(JSON.stringify({ledger_entries:Object.keys(active).length,view:'ledger-current-view.json',diffs:'tracking-diff-view.json'}));
