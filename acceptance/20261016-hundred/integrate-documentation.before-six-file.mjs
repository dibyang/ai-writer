import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
const base=path.dirname(fileURLToPath(import.meta.url)),root=path.resolve(base,'../..'),work=path.join(base,'works/潮汐信号');
const read=p=>JSON.parse(fs.readFileSync(p,'utf8')),hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const mode=process.argv[2],target=path.join(base,'integration-documentation'),statePath=path.join(work,'.writer/state.json');
if(mode==='apply'){
 assert.equal(read(path.join(base,'session-13/process-result.json')).exit_code,0,'Finish native chapter100 first');
 assert.equal(read(statePath).units.length,100);assert(!fs.existsSync(target),'Preserve prior integration');
 const source=read(path.join(base,'source-baseline-v3.json')),draft=read(path.join(base,'documentation-next-manifest.json'));
 for(const row of source.files)assert.equal(hash(path.join(root,row.file)),row.sha256,'Source changed: '+row.file);
 for(const row of draft.files){assert.equal(hash(path.join(root,row.file)),row.before_sha256);assert.equal(hash(path.join(base,'documentation-next',row.file)),row.after_sha256);}
 const embedded=path.join(work,'.writer/tool/lib/help.mjs');assert.equal(hash(embedded),hash(path.join(root,'lib/help.mjs')));
 const stateHash=hash(statePath);fs.mkdirSync(target);
 for(const row of draft.files){const backup=path.join(target,'before',row.file);fs.mkdirSync(path.dirname(backup),{recursive:true});fs.copyFileSync(path.join(root,row.file),backup);}
 fs.copyFileSync(embedded,path.join(target,'before/embedded-help.mjs'));
 for(const row of draft.files)fs.copyFileSync(path.join(base,'documentation-next',row.file),path.join(root,row.file));
 fs.copyFileSync(path.join(root,'lib/help.mjs'),embedded);assert.equal(hash(statePath),stateHash,'Authority must remain byte-identical');
 const next={...source,created_at:new Date().toISOString(),candidate:'v4 help and manuals plus v3 exact ID recall and v2 recovery',files:source.files.map(row=>({...row,sha256:hash(path.join(root,row.file))}))};
 fs.writeFileSync(path.join(base,'source-baseline-v4.json'),JSON.stringify(next,null,2)+'\n',{flag:'wx'});
 fs.writeFileSync(path.join(target,'applied.json'),JSON.stringify({at:new Date().toISOString(),state_sha256:stateHash,revision:read(statePath).revision,files:draft.files,embedded_help_sha256:hash(embedded),scope:'Applied; activation requires main test and doctor success'},null,2)+'\n',{flag:'wx'});
 console.log(JSON.stringify({applied:5,state_unchanged:true,active_candidate_unchanged:true}));
}else if(mode==='activate'){
 const applied=read(path.join(target,'applied.json'));assert.equal(hash(statePath),applied.state_sha256);
 for(const label of ['integrated-docs-test','integrated-docs-doctor'])assert.equal(read(path.join(base,'parent-commands',label,'result.json')).exit_code,0,label);
 for(const row of read(path.join(base,'source-baseline-v4.json')).files)assert.equal(hash(path.join(root,row.file)),row.sha256);
 const activePath=path.join(base,'active-candidate.json'),previous=fs.readFileSync(activePath);fs.writeFileSync(path.join(target,'previous-active-candidate.json'),previous,{flag:'wx'});
 const active=read(activePath);active.manifest='source-baseline-v4.json';active.candidate='v4';active.activated_at=new Date().toISOString();fs.writeFileSync(activePath,JSON.stringify(active,null,2)+'\n');
 fs.writeFileSync(path.join(target,'activated.json'),JSON.stringify({at:new Date().toISOString(),manifest:'source-baseline-v4.json',state_unchanged:true},null,2)+'\n',{flag:'wx'});
 console.log(JSON.stringify({active_candidate:'source-baseline-v4.json',state_unchanged:true}));
}else throw Error('integrate-documentation apply|activate');
