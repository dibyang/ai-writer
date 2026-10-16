import fs from 'node:fs';
import path from 'node:path';
import {applyDelta} from '../../../lib/journal.mjs';
const stage='D:/work/other/ai-writer/acceptance/20261016-expanded/revision-a';
const work=path.join(stage,'before/work');
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const state=read(path.join(work,'.writer/state.json'));
let snapshot=structuredClone(state.baseline);
const snapshots=[];
let out='';
for(const row of state.units){
 const j=read(path.join(work,row.journal)); snapshot=applyDelta(snapshot,j.patch);
 snapshots.push({unit:row.unit,snapshot:structuredClone(snapshot)});
 const n=String(row.unit).padStart(4,'0');
 const orig= row.unit<=4 ? `session-a/inputs/record-${row.unit}.json` : `${row.unit<=8?'session-b':'session-c'}/record-${n}.json`;
 const input=read(path.join(stage,'before/original-inputs',orig));
 out+=`\nUNIT ${row.unit} ORIGINAL INPUT\n${JSON.stringify({summary:input.summary,changes:input.changes})}\n`;
 out+=`ACTUAL JOURNAL PATHS\n${JSON.stringify(j.patch.map(o=>({at:o.at,append_count:o.append?.length}))) }\n`;
}
fs.writeFileSync(path.join(stage,'before-snapshots.json'),JSON.stringify(snapshots,null,2)+'\n');
fs.writeFileSync(path.join(stage,'before-inputs-readable.txt'),out);
let sources='';for(const rel of ['大纲/分卷/V1.json','大纲/分卷/V2.json','大纲/分卷/V3.json','大纲/分卷/V4.json',...state.units.map(r=>`大纲/单元/${String(r.unit).padStart(4,'0')}.json`)])sources+=`\n${rel}\n${fs.readFileSync(path.join(work,rel),'utf8')}\n`;
fs.writeFileSync(path.join(stage,'before-plans-readable.txt'),sources);
console.log(JSON.stringify({revision:state.revision,earliest_rule_consumer:state.units.find(r=>r.source_hashes['设定/权威规则.md'])?.unit,ledger_count:Object.keys(snapshot.ledger).length,snapshots:snapshots.length}));
