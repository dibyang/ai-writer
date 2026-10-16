import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {createRunner} from './command-runner.mjs';
const [label,...ids]=process.argv.slice(2),base='acceptance/20261016-hundred';
assert(/^[a-z][a-z0-9-]*$/.test(label??'')&&ids.length&&ids.every(id=>/^[A-Za-z0-9_]+$/.test(id)));
const work=path.resolve(base,'checkpoints',label,'files'),stage=`${base}/payoff-observations/${label}`;
const sha=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex'),stateFile=path.join(work,'.writer/state.json'),before=sha(stateFile),state=JSON.parse(fs.readFileSync(stateFile));
const runner=createRunner(stage),rows=[];
for(const id of ids){
 runner.run(process.execPath,[path.resolve('bin/ai-writer.mjs'),'recall','--project',work,'--query',id,'--limit','100'],id);
 const raw=runner.json(id),match=raw.matches.find(item=>item.kind==='ledger'&&item.id===id);assert(match,'Exact target absent; never use a related first result');
 const e=match.entry,cutoff=Math.max(1,state.units.length-5);
 rows.push({id,type:e.type,status:e.status,due_unit:e.due_unit,introduced_unit:e.introduced_unit,updated_unit:e.updated_unit,statement:e.statement,reader_known:e.reader_known,latest_evidence:(e.evidence??[]).filter(item=>item.unit>=cutoff),matching_results:raw.total});
}
assert.equal(sha(stateFile),before);
const result={at:new Date().toISOString(),scope:'Selected actual frozen-ledger fields and last-six-chapter citations for reading; not automatic payoff approval or full knowledge reading',checkpoint:label,revision:state.revision,units:state.units.length,state_sha256:before,main_longform_sha256:sha('lib/longform.mjs'),rows};
fs.writeFileSync(`${stage}/selected-fields.json`,JSON.stringify(result,null,2)+'\n',{flag:'wx'});console.log(JSON.stringify({ok:true,label,revision:state.revision,rows:rows.map(({id,status,due_unit})=>({id,status,due_unit}))}));
