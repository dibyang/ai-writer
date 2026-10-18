import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';
const base='acceptance/20261018-governance-d';fs.mkdirSync(base,{recursive:false});
for(const ref of ['snapshot.mjs','capture.mjs','seal-evidence.mjs']){let b=fs.readFileSync('acceptance/20261018-governance-c/'+ref,'utf8');if(ref==='capture.mjs')b=b.replace("v.startsWith('0.5.') ? RUNTIME_FILES.slice(0, 11) : RUNTIME_FILES","v.startsWith('0.5.') ? RUNTIME_FILES.slice(0, 11) : v.startsWith('0.6.') ? RUNTIME_FILES.slice(0, 12) : RUNTIME_FILES");if(ref==='seal-evidence.mjs')b=b.replaceAll('20261018-governance-c','20261018-governance-d');fs.writeFileSync(path.join(base,ref),b,{flag:'wx'});}
const root='D:/work/小说/dzkxqxx',files=[],sha=b=>crypto.createHash('sha256').update(b).digest('hex');function walk(dir,ref=''){for(const n of fs.readdirSync(dir).sort()){const x=path.join(dir,n),r=ref?ref+'/'+n:n,s=fs.lstatSync(x);if(s.isSymbolicLink())throw Error(r);if(s.isDirectory())walk(x,r);else files.push({file:r,bytes:s.size,sha256:sha(fs.readFileSync(x))});}}walk(root);
fs.writeFileSync(base+'/protected-before.json',JSON.stringify({root,files},null,2)+'\n',{flag:'wx'});
fs.writeFileSync(base+'/environment.json',JSON.stringify({at:new Date().toISOString(),node:process.version,platform:process.platform,head:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),status:execFileSync('git',['status','--short'],{encoding:'utf8'})},null,2)+'\n',{flag:'wx'});
fs.copyFileSync('.tmp/start-governance-d.mjs',base+'/start-campaign.mjs');console.log(JSON.stringify({base,protected_files:files.length}));
