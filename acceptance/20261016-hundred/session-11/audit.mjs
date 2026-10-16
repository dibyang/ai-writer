import fs from 'node:fs';import path from 'node:path';
import {stage,project,hash,save,runner} from './run-cli.mjs';
const before=JSON.parse(fs.readFileSync(`${stage}/baseline/state-r269.json`,'utf8'));
const after=JSON.parse(fs.readFileSync(`${project}/.writer/state.json`,'utf8'));
const old=before.snapshot.ledger,now=after.snapshot.ledger,failures=[];
const identity=e=>JSON.stringify({unit:e.unit,draft:e.draft,sha256:e.sha256,quote:e.quote});
const count=a=>{const m=new Map();for(const x of a)m.set(x,(m.get(x)??0)+1);return m;};
let evidence_count=0,known_count=0,due_count=0,observation_count=0;
for(const [id,v]of Object.entries(old)){
 const n=now[id];if(!n){failures.push({id,reason:'old ID missing'});continue;}
 if(v.statement!==n.statement)failures.push({id,reason:'old statement changed'});
 if(v.type==='observation'){observation_count++;if(JSON.stringify(v.author_truth)!==JSON.stringify(n.author_truth))failures.push({id,reason:'original observation author_truth changed'});}
 if(Object.hasOwn(v,'due_unit')){due_count++;if(v.due_unit!==n.due_unit)failures.push({id,reason:'due changed',before:v.due_unit,after:n.due_unit});}
 const counts=count(n.evidence.map(identity));for(const [key,amount]of count(v.evidence.map(identity))){evidence_count+=amount;if((counts.get(key)??0)<amount)failures.push({id,reason:'old evidence identity or multiplicity lost',identity:JSON.parse(key),expected:amount,actual:counts.get(key)??0});}
 for(const [name,text]of Object.entries(v.character_known??{})){known_count++;if(!n.character_known?.[name]?.includes(text))failures.push({id,name,reason:'old full knowledge not preserved'});}
}
for(const [name,text]of Object.entries(before.snapshot.characters))if(!after.snapshot.characters[name]?.includes(text))failures.push({name,reason:'old character state history lost'});
for(const id of ['T_SIGNAL','T_TAPE','T_HANDOVER','T_LAMP','T_PRIVATE'])if(JSON.stringify(old[id])!==JSON.stringify(now[id]))failures.push({id,reason:'protected completed/private entry changed'});
const units=Array.isArray(after.units)?after.units:Object.values(after.units);
const chapters=[];
for(let n=85;n<=90;n++){
 const template=JSON.parse(fs.readFileSync(`${stage}/record-${n}-before.json`,'utf8'));
 const input=JSON.parse(fs.readFileSync(`${stage}/record-${n}.json`,'utf8'));
 if(JSON.stringify(template.source_hashes)!==JSON.stringify(input.source_hashes)||template.expected_revision!==input.expected_revision)failures.push({unit:n,reason:'prewrite hashes/revision changed'});
 const p=path.join(project,input.draft),body=fs.readFileSync(p,'utf8');const han=[...body.replace(/^#.*$/gm,'').matchAll(/\p{Script=Han}/gu)].length;
 const entry=units.find(u=>u.unit===n);const r=runner.last(`record-${n}-cli`);if(r.executable!==process.execPath||r.argv[0]!=='bin/ai-writer.mjs'||r.argv[1]!=='record'||r.exit_code!==0)failures.push({unit:n,reason:'actual CLI identity/exit invalid'});
 if(han<2400||han>3200)failures.push({unit:n,reason:'Han outside range',han});
 if(entry?.sha256!==hash(p))failures.push({unit:n,reason:'state draft hash mismatch'});
 chapters.push({unit:n,draft:input.draft,han,sha256:hash(p),prewrite_revision:template.expected_revision,registered_revision:JSON.parse(r.stdout).revision,source_hashes:template.source_hashes,journal:entry?.journal,unit_entry:entry,record_input_sha256:hash(`${stage}/record-${n}.json`)});
}
fs.copyFileSync(`${stage}/bootstrap-boundary.json`,`${stage}/commands/bootstrap-tool-boundary.json`);
save('continuity-preservation-audit.json',{scope:'mechanical-preservation-only-not-semantic-acceptance',baseline_revision:before.revision,final_revision:after.revision,baseline_state_sha256:hash(`${stage}/baseline/state-r269.json`),final_state_sha256:hash(`${project}/.writer/state.json`),old_ids_checked:Object.keys(old).length,old_observations_checked:observation_count,old_due_fields_checked:due_count,old_evidence_instances_checked:evidence_count,old_character_known_fields_checked:known_count,old_character_histories_checked:Object.keys(before.snapshot.characters).length,evidence_identity:'ID + unit + draft + sha256 version + exact quote; multiset multiplicity, never unit+line alone',failures,chapters});
console.log(JSON.stringify({old_ids:Object.keys(old).length,observations:observation_count,due_fields:due_count,evidence_instances:evidence_count,knowledge_fields:known_count,failures,chapters:chapters.map(c=>({unit:c.unit,han:c.han,revision:c.registered_revision,sha256:c.sha256})),elapsed_s:Math.round((Date.now()-Date.parse('2026-10-16T11:20:29.717Z'))/1000)},null,2));
if(failures.length)process.exitCode=1;
