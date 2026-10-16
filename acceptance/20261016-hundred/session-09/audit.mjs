import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {replaySnapshots} from '../rebuild-utils.mjs';
import {stage,work} from './run-cli.mjs';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const sha=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const state=read(path.join(work,'.writer/state.json'));
const snapshots=replaySnapshots(work,state);
const save=(p,v)=>{fs.mkdirSync(path.dirname(p),{recursive:true});fs.writeFileSync(p,JSON.stringify(v,null,2)+'\n');};
save(path.join(stage,'replayed-initial.json'),{revision:state.revision,units:state.units,snapshots});
const hits=[];
for(let n=1;n<snapshots.length;n++){
 const s=snapshots[n],prev=snapshots[n-1];
 const fields={timeline:s.timeline.filter(x=>x.includes('缺轮')),O_ROOM_TONE:s.ledger?.O_ROOM_TONE?.statement,T_SOUND_CONTEXT:s.ledger?.T_SOUND_CONTEXT};
 const prevfields={timeline:prev.timeline.filter(x=>x.includes('缺轮')),O_ROOM_TONE:prev.ledger?.O_ROOM_TONE?.statement,T_SOUND_CONTEXT:prev.ledger?.T_SOUND_CONTEXT};
 if(JSON.stringify(fields)!==JSON.stringify(prevfields))hits.push({unit:n,fields});
}
save(path.join(stage,'tracking-history.json'),hits);
const active=Object.fromEntries(Object.entries(state.snapshot.ledger).filter(([id,v])=>['active','pending','partial'].includes(v.status)));
save(path.join(stage,'active-ledger.json'),active);
save(path.join(stage,'initial-manifest.json'),{captured_at:new Date().toISOString(),state_sha256:sha(path.join(work,'.writer/state.json')),revision:state.revision,units:state.units.map(u=>({unit:u.unit,draft:u.draft,draft_sha256:sha(path.join(work,u.draft)),journal:u.journal,journal_sha256:sha(path.join(work,u.journal))}))});
console.log(JSON.stringify({revision:state.revision,units:state.units.length,active_ids:Object.keys(active),history_units:hits.map(x=>x.unit),elapsed_s:(Date.now()-Date.parse(read(path.join(stage,'start.json')).started_at))/1000},null,2));
