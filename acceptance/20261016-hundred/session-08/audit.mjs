import fs from 'node:fs';
import {project,stage,runner,hash} from './run-cli.mjs';
const s=JSON.parse(fs.readFileSync(project+'/.writer/state.json','utf8'));
const raw=runner.last('inspect-state-corrected').stdout;
const baseline=JSON.parse(raw.slice(raw.indexOf('\n{')+1,raw.lastIndexOf('\nSTATE HASH')));
const before=JSON.parse(fs.readFileSync(stage+'/repair-0072-complete-before/.writer__state.json','utf8'));
const errors=[];
const counts=(snap,version=true,unit)=>{const m=new Map();for(const[id,v]of Object.entries(snap.ledger))for(const e of v.evidence??[]){if(unit!==undefined&&e.unit!==unit)continue;const k=JSON.stringify([id,e.unit,e.quote,...(version?[e.sha256]:[])]);m.set(k,(m.get(k)??0)+1);}return m;};
const old=counts(baseline),now=counts(s.snapshot);let preserved=0;
for(const[k,n]of old){if((now.get(k)??0)<n)errors.push({kind:'lost-versioned-evidence',key:k,old:n,current:now.get(k)??0});else preserved+=n;}
for(const[id,e]of Object.entries(baseline.ledger)){const n=s.snapshot.ledger[id];if(!n){errors.push({kind:'lost-id',id});continue;}if(e.due_unit!==n.due_unit)errors.push({kind:'due-changed',id});if(e.type==='observation'&&(e.statement!==n.statement||e.author_truth!==n.author_truth))errors.push({kind:'observation-changed',id});for(const[name,k]of Object.entries(e.character_known??{}))if(!(n.character_known?.[name]??'').includes(k))errors.push({kind:'lost-knowledge',id,name});}
for(const[name,k]of Object.entries(baseline.characters))if(!(s.snapshot.characters[name]??'').includes(k))errors.push({kind:'lost-character-history',name});
const previous=counts(before.snapshot,false,72),current=counts(s.snapshot,false,72);let repaired_quotes=0;
for(const[k,n]of previous){if((current.get(k)??0)!==n)errors.push({kind:'repair-quote-identity-count',key:k,old:n,current:current.get(k)??0});else repaired_quotes+=n;}
const beforeDraft=fs.readFileSync(stage+'/repair-0072-complete-before/正文__0072-把空出来的地方留着.md','utf8');
const expected=beforeDraft.replace('门合上，屋里那两只杯只湿了一只杯底的桌印。','门合上，桌上只留下何那只杯子的一圈水印。').replace('昨晚晾的枕套还没收','昨天上午晾的枕套还没收');
if(expected!==fs.readFileSync(project+'/正文/0072-把空出来的地方留着.md','utf8'))errors.push({kind:'repair-outside-two-sentences'});
const result={scope:'mechanical-preservation-only-not-semantic-proof',baseline_revision:197,final_revision:s.revision,baseline_ids:Object.keys(baseline.ledger).length,baseline_versioned_evidence_preserved:preserved,repaired_unit72_quote_identity_count:repaired_quotes,repair_old_version_saved:stage+'/repair-0072-complete-before',errors};
fs.writeFileSync(stage+'/preservation-audit.json',JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result));if(errors.length)process.exitCode=1;
