import fs from 'node:fs';
import crypto from 'node:crypto';
const stage='acceptance/20261016-expanded/session-e',work='acceptance/20261016-expanded/works/潮汐信号';
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const stateRaw=fs.readFileSync(`${work}/.writer/state.json`),s=JSON.parse(stateRaw);
const files=fs.readdirSync(`${work}/正文`).filter(f=>/^\d{4}-.*\.md$/.test(f)).sort();
const m={revision:s.revision,state_sha256:hash(stateRaw),units:[]};
for(const f of files){const raw=fs.readFileSync(`${work}/正文/${f}`),txt=raw.toString('utf8');m.units.push({unit:Number(f.slice(0,4)),draft:'正文/'+f,sha256:hash(raw),han:(txt.replace(/^#.*\r?\n/u,'').match(/\p{Script=Han}/gu)||[]).length,lines:txt.split('\n').length});}
fs.writeFileSync(`${stage}/final-manifest.json`,JSON.stringify(m,null,2)+'\n');
fs.writeFileSync(`${stage}/final-state.json`,stateRaw);
for(let start=1;start<=20;start+=4){let txt='';for(const e of m.units.filter(e=>e.unit>=start&&e.unit<start+4)){txt+=`文件：${e.draft}\nSHA-256：${e.sha256}\n\n`+fs.readFileSync(`${work}/${e.draft}`,'utf8')+'\n';}fs.writeFileSync(`${stage}/full-read-${start}-${start+3}.md`,txt);}
const a=JSON.parse(fs.readFileSync(`${stage}/before-rewind19/state.json`));
const b=JSON.parse(fs.readFileSync(`${stage}/after-rerecord19-state.json`));
const normalize=x=>JSON.parse(JSON.stringify(x),(key,value)=>key==='sha256'&&[a.snapshot.ledger.T_SIGNAL.evidence.at(-1)?.sha256,'e628d4ffefe11c7088f940e212b4d2f8e7edd433586696ec51088ada46c30e6a','896590146f4ef7a69812c857215b6ebc27a28f5f91f439c6905877c8534a3d3e'].includes(value)?'<chapter19-sha>':value);
const rows=Object.keys(a.snapshot.ledger).map(id=>({id,before_evidence:a.snapshot.ledger[id].evidence.length,after_evidence:b.snapshot.ledger[id]?.evidence.length,identical_except_19_sha:JSON.stringify(normalize(a.snapshot.ledger[id]))===JSON.stringify(normalize(b.snapshot.ledger[id]))}));
const eq=JSON.stringify(normalize(a.snapshot))===JSON.stringify(normalize(b.snapshot));
fs.writeFileSync(`${stage}/rewind19-preservation.json`,JSON.stringify({before_revision:a.revision,after_revision:b.revision,all_snapshot_identical_except_19_sha:eq,rows},null,2)+'\n');
console.log(JSON.stringify({revision:s.revision,state_sha256:m.state_sha256,units:m.units,rewind_preservation:eq,old_ledger_rows:rows.length}));
