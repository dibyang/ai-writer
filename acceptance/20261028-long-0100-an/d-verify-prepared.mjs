import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';import assert from 'node:assert/strict';import {fileURLToPath} from 'node:url';
const root=path.dirname(fileURLToPath(import.meta.url)),read=p=>JSON.parse(fs.readFileSync(p)),sha=b=>crypto.createHash('sha256').update(b).digest('hex'),rec=read(path.join(root,'session-b/owner-recovery.json')),work=rec.parent,ws=rec.workspace,revdir=path.dirname(ws),out=path.join(root,'session-d');
const preparedBytes=fs.readFileSync(path.join(revdir,'prepared.json')),prepared=JSON.parse(preparedBytes),session=read(path.join(revdir,'session.json')),base=read(path.join(revdir,'base.json')),candidate=read(path.join(ws,'.writer/state.json'));
assert.equal(session.status,'prepared');assert.equal(session.prepared_sha256,sha(preparedBytes));assert.equal(prepared.session_id,rec.id);assert.equal(prepared.base_revision,481);assert.equal(prepared.target_state.revision,482);assert.equal(prepared.branch_head_sha256,sha(fs.readFileSync(path.join(ws,'.writer/state.json'))));
assert.deepEqual(prepared.target_state.snapshot,candidate.snapshot);assert.deepEqual(prepared.target_state.units,candidate.units);
let baseCount=0;for(const [ref,h]of Object.entries(base.files)){assert.equal(sha(fs.readFileSync(path.join(work,ref))),h,ref);baseCount++;}
let treeCount=0;for(const [ref,h]of Object.entries(prepared.tree)){assert.equal(sha(fs.readFileSync(path.join(ws,ref))),h,ref);treeCount++;}
const changes=[];for(const [i,c]of prepared.changes.entries()){
 const p=path.join(work,c.file),old=fs.existsSync(p)?fs.readFileSync(p):null;assert.equal(old===null?null:sha(old),c.before,c.file);
 const next=c.file==='.writer/state.json'?Buffer.from(JSON.stringify(prepared.target_state,null,2)+'\n'):fs.readFileSync(path.join(ws,c.file));assert.equal(sha(next),c.after,c.file);
 const beforeRef=old===null?null:`session-d/precommit-backup/old/${i}.bin`,afterRef=`session-d/precommit-backup/new/${i}.bin`;
 for(const [ref,b]of [[beforeRef,old],[afterRef,next]])if(ref){const target=path.join(root,ref);fs.mkdirSync(path.dirname(target),{recursive:true});fs.writeFileSync(target,b,{flag:'wx'});assert.equal(sha(fs.readFileSync(target)),sha(b));}
 changes.push({...c,before_backup:beforeRef,after_backup:afterRef});
}
assert.equal(changes.length,29);assert.equal(changes.filter(x=>x.before!==null).length,3);assert.deepEqual(changes.filter(x=>x.file.startsWith('正文/')).map(x=>Number(path.basename(x.file).slice(0,4))),[116,120]);
for(const f of ['base.json','base-state.json'])assert.equal(sha(fs.readFileSync(path.join(revdir,f))),sha(fs.readFileSync(path.join(out,'initial-'+(f==='base.json'?'base':'base-state')+'.json'))));
fs.writeFileSync(path.join(out,'prepared-native.json'),preparedBytes,{flag:'wx'});fs.writeFileSync(path.join(out,'prepared-session-native.json'),fs.readFileSync(path.join(revdir,'session.json')),{flag:'wx'});
const audit={at:new Date().toISOString(),id:rec.id,prepared_sha256:sha(preparedBytes),main_base_files_verified:baseCount,candidate_tree_files_verified:treeCount,main_state_sha256:sha(fs.readFileSync(path.join(work,'.writer/state.json'))),candidate_state_sha256:prepared.branch_head_sha256,target_state_sha256:changes.at(-1).after,target_revision:482,changes,old_backups:changes.filter(x=>x.before!==null).length,new_backups:changes.length,backup_nature:'supplemental exact byte audit backups made after prepare and before commit; native transaction will independently back up at commit',conflicts:[],identity_and_original_baseline_preserved:true};
fs.writeFileSync(path.join(out,'prepared-verification.json'),JSON.stringify(audit,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({base_files:baseCount,candidate_tree:treeCount,changes:changes.length,old_backups:audit.old_backups,new_backups:audit.new_backups,target_revision:482,conflicts:[]}));
