import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {base,read,state,save,sha} from './common.mjs';
const j=ref=>JSON.parse(fs.readFileSync(path.join(base,ref),'utf8'));
const b=j('r1-session.json'),old=j('r1-before.json'),cp=j('checkpoint-r-first.json');
const s=JSON.parse(fs.readFileSync(path.join(b.workspace,'.writer/state.json'),'utf8'));
assert.equal(sha(read('.writer/state.json')),cp.main.state_sha256);
assert.equal(state().revision,63);assert.equal(state().units.length,24);
const mainBodies=old.bodies.map(f=>{const actual=sha(read(f.ref));assert.equal(actual,f.sha256);return {...f,actual_sha256:actual,unchanged:true};});
const cParts=old.parts.map(f=>{const actual=sha(read(f.ref));assert.equal(actual,f.sha256);return {...f,actual_sha256:actual,unchanged:true};});
assert.equal(s.units.length,24);assert.equal(s.tool_control.generation,4);
assert.equal(s.tool_control.installed.source_content_id,'e25b6416d61e498fca37c7a25a3f66e889d85e5d56e8ddca9e2b0c16a1b56f27');
const edits=j('r1-text-edits.json'),bodyDiffs=[];
for(const f of old.bodies){let expected=read(f.ref).toString('utf8');for(const e of edits.filter(e=>e.unit===f.unit)){assert.equal(expected.split(e.old).length-1,1);expected=expected.replace(e.old,e.new);}const buf=fs.readFileSync(path.join(b.workspace,f.ref));assert.equal(buf.toString('utf8'),expected);const unit=s.units.find(u=>u.unit===f.unit);assert.equal(unit.sha256,sha(buf));if(sha(buf)!==f.sha256)bodyDiffs.push({unit:f.unit,ref:f.ref,old_sha256:f.sha256,new_sha256:sha(buf),edit_count:edits.filter(e=>e.unit===f.unit).length});}
const protectedObservations=Object.entries(old.snapshot.ledger).filter(([,v])=>v.type==='observation').map(([id,v])=>{const current=s.snapshot.ledger[id];assert.ok(current);for(const k of ['type','statement','author_truth']){assert.equal(Object.hasOwn(current,k),Object.hasOwn(v,k));assert.deepEqual(current[k],v[k]);}return {id,type:v.type,statement:v.statement,author_truth_present:Object.hasOwn(v,'author_truth'),unchanged:true};});
const evidence=[];
for(const [id,v] of Object.entries(s.snapshot.ledger)){for(const e of v.evidence??[]){const buf=fs.readFileSync(path.join(b.workspace,e.draft)),text=buf.toString('utf8'),line=text.split(/\r?\n/)[e.line-1];assert.equal(sha(buf),e.sha256,`${id} evidence SHA`);assert.ok(line?.includes(e.quote),`${id} evidence line ${e.line}`);evidence.push({id,unit:e.unit,draft:e.draft,sha256:e.sha256,line:e.line,quote:e.quote});}}
const ids=['O_GRID','O_LETTER_TEXT','O_CURTAIN','T_CURTAIN_RETURN','T_SITE_RETURN','O_RACK_WHEELS','T_RACK_INSPECTION','O_RACK_PATTERN','T_RACK_SAMPLE_VISIT','T_RACK_TRIAL','O_FLAT_CART','T_FLAT_CART_RETURN','T_RACK_REPLACEMENT','O_RACK_PAIR','T_RACK_INSTALL'];
save('r1-final-ledger-readable.json',Object.fromEntries(ids.map(id=>[id,s.snapshot.ledger[id]])));
save('r1-final-audit.json',{main:{revision:63,units:24,state_sha256:sha(read('.writer/state.json')),bodies:mainBodies,c25_parts:cParts,snapshot_unchanged:JSON.stringify(old.snapshot)===JSON.stringify(state().snapshot)},candidate:{revision:s.revision,units:s.units.length,state_sha256:sha(fs.readFileSync(path.join(b.workspace,'.writer/state.json'))),tool_control:s.tool_control,source_binding:s.source_binding,source_versions:s.source_versions,source_ranges:s.source_ranges,body_diffs:bodyDiffs},protected_observations:protectedObservations,evidence_checked:evidence,limitations:'Mechanical byte/binding checks only; literary conclusions are in the actual full-read report. No prepare/commit.'});
console.log(JSON.stringify({ok:true,main_unchanged:true,c25_unchanged:true,candidate_revision:s.revision,body_changed_units:bodyDiffs.map(x=>x.unit),protected_observations:protectedObservations.length,evidence_checked:evidence.length}));
