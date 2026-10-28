import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
const root=path.dirname(fileURLToPath(import.meta.url)), work=path.join(root,'work'), sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const receipt=JSON.parse(fs.readFileSync(path.join(root,'commands/b-004-revision-begin/stdout.raw.txt'))), baseDir=path.dirname(receipt.workspace);
const state=JSON.parse(fs.readFileSync(path.join(work,'.writer/state.json')));
const out={id:receipt.id,token:receipt.token,workspace:receipt.workspace,parent:work,base_revision:receipt.base_revision,scope:receipt.scope,checkpoint_after_unit:118,next_replay_unit:119,do_not_prepare_or_commit:true,baseline:{}};
for(const name of ['base.json','base-state.json','session.json']) {
 const bytes=fs.readFileSync(path.join(baseDir,name));out.baseline[name]=sha(bytes);fs.writeFileSync(path.join(root,'session-b/initial-'+name),bytes,{flag:'wx'});
}
for(const u of state.units.filter(u=>[103,109,115,116,117,118,119,120].includes(u.unit))) {
 const dir=path.join(root,'session-b/originals',path.dirname(u.draft));fs.mkdirSync(dir,{recursive:true});
 const a=fs.readFileSync(path.join(work,u.draft)), b=fs.readFileSync(path.join(receipt.workspace,u.draft));if(sha(a)!==sha(b))throw Error('Copy mismatch '+u.unit);
 fs.writeFileSync(path.join(root,'session-b/originals',u.draft),a,{flag:'wx'});
}
fs.writeFileSync(path.join(root,'session-b/owner-recovery.json'),JSON.stringify(out,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({id:out.id,base_revision:out.base_revision,baseline:out.baseline,token_saved:true}));
