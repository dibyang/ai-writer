import {read,put,run,stage,hundred,sha} from './harness.mjs';import path from 'node:path';import fs from 'node:fs';
const b=read(path.join(stage,'hundred-session.json')),x=read(path.join(stage,'samples/replay-1.json'));
run('hundred-preview-unreviewed',['record-preview','--revision-token',b.token],b.workspace,x,1);
const t=JSON.stringify({summary:x.summary,changes:x.changes},null,2);
put(path.join(stage,'reading/100-old-changes.txt'),t.replace(/[^\n]{1,100}/gu,'$&\n'));
console.log({chars:t.length,bytes:Buffer.byteLength(t),ledger:Object.keys(x.changes.ledger)});
const refs=Object.keys(x.source_hashes).filter(p=>!['.writer/state.json'].includes(p));
put(path.join(stage,'reading/readings-sha.json'),refs.map(ref=>({ref,sha256:sha(fs.readFileSync(path.join(hundred,ref)))})));
