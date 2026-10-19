import fs from 'node:fs';import path from 'node:path';import {fileURLToPath} from 'node:url';
const D=path.dirname(fileURLToPath(import.meta.url)),H=path.dirname(D),n=Number(process.argv[2]);
const r=JSON.parse(fs.readFileSync(path.join(H,`commands/revise-c-replay-${n}/stdout.raw.txt`))),s=JSON.parse(fs.readFileSync(path.join(D,'session.json'))),state=JSON.parse(fs.readFileSync(path.join(s.workspace,'.writer/state.json')));
const current=x=>typeof x==='string'?x.split(/；(?:历史|保留|截至)/)[0]:x;
const view=o=>Object.fromEntries(Object.entries(o??{}).map(([k,v])=>[k,current(v)]));
console.log(JSON.stringify({unit:r.unit,revision:r.expected_revision,draft:r.draft,summary:r.summary,characters:view(r.changes.characters),other_changes:Object.fromEntries(Object.entries(r.changes).filter(([k])=>!['characters','ledger'].includes(k))),ledger:Object.fromEntries(Object.entries(r.changes.ledger??{}).map(([id,v])=>[id,{...v,character_known:v.character_known?view(v.character_known):undefined,current_branch_knowledge:v.character_known?view(state.snapshot.ledger[id]?.character_known):undefined}])),replay:r._replay},null,2));
