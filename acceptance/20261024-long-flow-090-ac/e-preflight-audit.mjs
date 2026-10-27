import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
const base=path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/,'$1'));
const root=JSON.parse(fs.readFileSync(path.join(base,'project.json'))).project;
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const stateBytes=fs.readFileSync(path.join(root,'.writer/state.json'));
const s=JSON.parse(stateBytes), checkpoint=JSON.parse(fs.readFileSync(path.join(base,'checkpoint-e-entry.json')));
const mismatches=[];
for(const [ref,expected] of Object.entries(checkpoint.files)){
  const file=path.join(root,ref);
  if(!fs.existsSync(file)){mismatches.push({ref,error:'missing'});continue;}
  const b=fs.readFileSync(file);
  if(b.length!==expected.bytes||sha(b)!==expected.sha256)mismatches.push({ref,actual:sha(b),expected});
}
const inventory={};
function walk(dir){for(const d of fs.readdirSync(dir,{withFileTypes:true})){const f=path.join(dir,d.name);if(d.isDirectory())walk(f);else if(d.isFile())inventory[path.relative(root,f).replaceAll('\\','/')]={bytes:fs.statSync(f).size,sha256:sha(fs.readFileSync(f))};else throw Error('Nonregular file '+f);}}
walk(root);
const issues=JSON.parse(fs.readFileSync(path.join(base,'cli-logs/epre04-issues/stdout.txt')));
const report={nature:'read-only-preflight-computed-evidence-not-reading-proof',at:new Date().toISOString(),project:root,state_sha256:sha(stateBytes),revision:s.revision,registered:s.units.length,checkpoint_match:sha(stateBytes)===checkpoint.state_sha256,checkpoint_files:Object.keys(checkpoint.files).length,mismatches,
 units:s.units.map(u=>({unit:u.unit,draft:u.draft,sha256:u.sha256,pages:Math.ceil(fs.readFileSync(path.join(root,u.draft),'utf8').length/1800),source_hashes:u.source_hashes,source_bindings:u.source_bindings})),
 observations:Object.entries(s.snapshot.ledger).filter(([,v])=>v.type==='observation').map(([id,v])=>({id,...v})),
 issues:issues.issues.map(i=>({id:i.id,type:i.type,status:i.effective_status,statement:i.statement,evidence:i.evidence,application:i.application,verification:i.verification?{review_ref:i.verification.review_ref,conclusion:i.verification.conclusion,units:i.verification.units.map(u=>u.unit)}:null,context_changed:i.context_changed})),
 inventory};
assert.equal(mismatches.length,0);assert.equal(report.checkpoint_match,true);assert.equal(s.revision,216);assert.equal(s.units.length,48);
fs.writeFileSync(path.join(base,'e-preflight-audit.json'),JSON.stringify(report,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({revision:s.revision,state_sha256:report.state_sha256,checkpoint_files:report.checkpoint_files,mismatches,inventory_files:Object.keys(inventory).length,chapters:report.units.filter(u=>u.unit>=34).map(({unit,draft,pages})=>({unit,draft,pages})),observations:report.observations.map(({id,statement,author_truth})=>({id,statement,author_truth})),verified:report.issues.filter(i=>i.status==='verified').map(i=>({id:i.id,statement:i.statement,evidence_units:i.evidence.map(e=>e.unit),commit_id:i.application.commit_id,change_scope:i.application.change_scope,changes:i.application.changes,after_units:i.application.after_units.map(u=>u.unit),verification:i.verification}))},null,2));
