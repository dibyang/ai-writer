import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';
import {s,h,save as originalSave,run} from './run.mjs';import {BASE,ROOT,sha,readJSON,session} from '../session-support.mjs';
const save=(name,value)=>originalSave(name.replace(/(\.[^.]+)$/, '-v2$1'),value);
const bytes=f=>fs.readFileSync(f), hash=f=>fs.existsSync(f)?sha(bytes(f)):null;
const branch=readJSON(path.join(h.workspace,'.writer/state.json')), root=s.state();
assert.equal(hash(path.join(s.project,'.writer/state.json')),h.main_state_sha256);
assert.equal(hash(path.join(h.workspace,'.writer/state.json')),h.branch_state_sha256);
const protectedFiles=Object.entries(h.protectedMetadata).map(([name,x])=>{assert.equal(hash(x.original),x.sha256);return {name,sha256:x.sha256,bytes:bytes(x.original).length};});
const build=readJSON(path.join(BASE,'source-build-v2.json'));
const builds=[];for(const base of [ROOT,path.join(BASE,'sources/package-v2'),path.join(s.project,'.writer/tool')]){for(const f of build.files){const p=path.join(base,f.group==='skills'?'.agents/skills':'',f.file);assert.equal(hash(p),f.sha256,p);}builds.push({base,files:build.files.length,all_same:true});}
const manifest=root.units.map((u,i)=>{const a=bytes(path.join(s.project,u.draft)),b=bytes(path.join(h.workspace,u.draft));assert.equal(u.unit,i+1);assert.equal(sha(a),u.sha256);assert.equal(sha(b),branch.units[i].sha256);const text=b.toString('utf8'),body=text.replace(/^#.*(?:\r?\n|$)/,'');let differences=[];const old=a.toString('utf8');if(old!==text){assert.equal(old.replace('同两块','那两块'),text);let n=0;for(let j=0;j<old.length;j++)if(old[j]!==text[j]){n++;differences.push({utf16_offset:j,before:old[j],after:text[j],line:old.slice(0,j).split('\n').length});}assert.equal(n,1);}return {unit:u.unit,draft:u.draft,before_sha256:sha(a),after_sha256:sha(b),bytes_before:a.length,bytes_after:b.length,han:[...body.matchAll(/\p{Script=Han}/gu)].length,body_non_whitespace:[...body.replace(/\s/gu,'')].length,title:text.split(/\r?\n/)[0],differences};});
assert.deepEqual(manifest.filter(x=>x.differences.length).map(x=>x.unit),[48,54,66,71]);save('body-manifest-106.json',manifest);
const prep=readJSON(path.join(s.project,'.writer/revisions',h.id,'prepared.json'));
const changes=prep.changes.map(c=>{assert.equal(hash(path.join(s.project,c.file)),c.before,c.file+' before');const after=c.file==='.writer/state.json'?sha(Buffer.from(JSON.stringify(prep.target_state,null,2)+'\n')):hash(path.join(h.workspace,c.file));assert.equal(after,c.after,c.file+' after');return {...c,verified:true};});assert.equal(changes.length,251);save('prepare-file-list-verified.json',changes);
const replay=readJSON(path.join(BASE,'revise-d/all-59-replay-bindings.json'));save('inherited-replay-manifest.json',replay);
const journals=[];for(const u of branch.units.filter(x=>x.unit>=48)){const j=readJSON(path.join(h.workspace,u.journal));assert.equal(hash(path.join(h.workspace,u.journal)),u.journal_sha256);const rr=j.replay_review??j.input?.replay_review; journals.push({unit:u.unit,journal:u.journal,journal_sha256:u.journal_sha256,keys:Object.keys(j),replay_review:rr??null});}save('replay-journal-validation.json',journals);
const flatten=v=>Object.values(v).flat();
const oldObs=flatten(root.snapshot.ledger).filter(x=>x.id?.startsWith('O_')),newObs=flatten(branch.snapshot.ledger).filter(x=>x.id?.startsWith('O_'));assert.deepEqual(oldObs.map(x=>[x.id,x.statement,x.author_truth]),newObs.map(x=>[x.id,x.statement,x.author_truth]));
const gu=branch.snapshot.characters['顾遥'];assert.ok(gu.includes('沈叫后获掉盘说明并看外观/指换短，掉盘瞬间非亲见'));assert.ok(!gu.includes('亲见长线轻动盘掉'));
save('semantic-state-audit.json',{gu_current:gu,observation_count:oldObs.length,observations_unchanged:true,drop:oldObs.find(x=>x.id==='O_LEAD_DROP_58'),snapshot_differences:readJSON(path.join(BASE,'revise-d/audit-before-review-v2.json')).snapshotDiffs});
const bs=session('final-recover-branch',{project:h.workspace,token:h.token});for(const [label,args] of [['doctor',['doctor']],['check',['check']]]){const r=bs.run(label,args);save('branch-'+label+'.json',r.value);assert.equal(r.value.ok,true);}
run('precommit-check',['check']);
const review=readJSON(path.join(h.workspace,h.review.ref));assert.equal(hash(path.join(h.workspace,h.review.report)),h.review.report_sha256);save('inherited-current-review.json',review);
save('precommit-audit.json',{at:new Date().toISOString(),root_revision:root.revision,branch_revision:branch.revision,prepared_files:changes.length,protectedFiles,builds,body_count:manifest.length,changed_units:[48,54,66,71],new_chapters_unchanged:manifest.filter(x=>x.unit>100).every(x=>!x.differences.length),observation_count:oldObs.length,gu_clarification_preserved:true,review_ref:h.review.ref,replay_count:journals.length});
console.log(JSON.stringify({ok:true,prepared:changes.length,bodies:manifest.length,changed:[48,54,66,71],replay:journals.length,observations:oldObs.length,build_files:build.files.length}));
