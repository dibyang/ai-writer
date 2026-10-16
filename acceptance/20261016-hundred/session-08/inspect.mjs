import fs from 'node:fs';
import {runner,project,stage,hash} from './run-cli.mjs';
const s=JSON.parse(fs.readFileSync(project+'/.writer/state.json','utf8'));
const snap=s.snapshot;
const current=v=>typeof v==='string'?v.split('；')[0]:v;
if(!process.argv[2])console.log('CURRENT CHARACTERS',JSON.stringify(Object.fromEntries(Object.entries(snap.characters).map(([k,v])=>[k,current(v)]))));
for(const [k,v]of Object.entries(snap.ledger).filter(([k,v])=>v.status!=='resolved').slice(Number(process.argv[2]??0),Number(process.argv[3]??999)))console.log(JSON.stringify({id:k,type:v.type,status:v.status,due:v.due_unit,statement:v.statement,reader_known:current(v.reader_known),character_known:Object.fromEntries(Object.entries(v.character_known??{}).map(([a,b])=>[a,current(b)])),custody:v.custody,evidence_units:[...new Set(v.evidence?.map(e=>e.unit))]}));
console.log('STATE HASH',hash(project+'/.writer/state.json'));
