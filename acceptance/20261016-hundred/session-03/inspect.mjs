import {createRunner} from '../command-runner.mjs';
import fs from 'node:fs';
const r=createRunner('acceptance/20261016-hundred/session-03');
const s=r.json('status-full');
const lines=[];
for(const [id,x] of Object.entries(s.snapshot.ledger)){
 lines.push(`## ${id}\n${x.type} | ${x.status} | due=${x.due_unit??'none'}\n${x.statement}\n${x.author_truth?'author_truth: '+x.author_truth:''}\nreader: ${x.reader_known??''}\ncustody: ${JSON.stringify(x.custody??null)}\ncast: ${JSON.stringify(x.cast)}\nknowledge latest (history remains in source):\n${Object.entries(x.character_known??{}).map(([n,v])=>n+': '+v.split('；截至')[0].split('；历史有效')[0].split('；此前')[0]).join('\n')}\nevidence: ${(x.evidence??[]).map(e=>e.unit+' '+e.draft+' '+e.sha256+' '+e.quote).join('\n')}\n`);
}
fs.writeFileSync('acceptance/20261016-hundred/session-03/ledger-recovery.md',lines.join('\n'),'utf8');
console.log(Object.keys(s.snapshot));console.log('Ledger entries',lines.length);
