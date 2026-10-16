import fs from 'node:fs';
import {spawnSync} from 'node:child_process';
import crypto from 'node:crypto';
const stage='acceptance/20261016-expanded/session-e';
const work='acceptance/20261016-expanded/works/潮汐信号';
const raw=fs.readFileSync(`${work}/.writer/state.json`);
fs.writeFileSync(`${stage}/initial-state.json`,raw);
const s=JSON.parse(raw);
const compact=Object.fromEntries(Object.entries(s.snapshot.ledger).map(([id,v])=>[id,{...v,evidence:v.evidence.map(e=>({unit:e.unit,line:e.line,quote:e.quote,sha256:e.sha256}))}]));
fs.writeFileSync(`${stage}/recovery-ledger.json`,JSON.stringify(compact,null,2));
for(const id of Object.keys(s.snapshot.ledger)){
 const r=spawnSync(process.execPath,[`${stage}/cli.mjs`,'recall-'+id.toLowerCase().replaceAll('_','-'),'recall','--query',id,'--limit','40'],{encoding:'utf8'});
 if(r.status!==0){process.stderr.write(r.stderr);process.exitCode=r.status;break;}
 const out=JSON.parse(r.stdout); console.log(JSON.stringify({id,total:out.total,matches:out.matches}));
}
console.log(JSON.stringify({revision:s.revision,state_sha256:crypto.createHash('sha256').update(raw).digest('hex')}));
