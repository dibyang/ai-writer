import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';

// Run only after native writers, summaries and parent notes have stopped.
// Verification reads files; it must not create its own logs inside the seal.
const base=path.dirname(fileURLToPath(import.meta.url));
const [mode,label]=process.argv.slice(2),manifestFile=path.join(base,'evidence-manifest.json');
if(!['seal','verify'].includes(mode))throw Error('seal-evidence.mjs seal <final-audit-label> | verify');
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const sha=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
function inventory(dir=base){
 const rows=[];
 for(const name of fs.readdirSync(dir).sort()){
  const file=path.join(dir,name),stat=fs.lstatSync(file);
  if(stat.isSymbolicLink())throw Error(`Refuse linked evidence: ${file}`);
  if(stat.isDirectory()){rows.push(...inventory(file));continue;}
  if(!stat.isFile())throw Error(`Refuse nonregular evidence: ${file}`);
  if(file===manifestFile)continue;
  const bytes=fs.readFileSync(file),after=fs.lstatSync(file);
  assert.equal(after.size,stat.size,`File changed while reading: ${file}`);
  assert.equal(after.mtimeMs,stat.mtimeMs,`File changed while reading: ${file}`);
  rows.push({file:path.relative(base,file).split(path.sep).join('/'),bytes:bytes.length,sha256:sha(bytes)});
 }
 return rows.sort((a,b)=>a.file<b.file?-1:a.file>b.file?1:0);
}
if(mode==='seal'){
 if(!/^[a-z][a-z0-9-]*$/.test(label??''))throw Error('Final completed audit label required');
 assert(!fs.existsSync(manifestFile),'Preserve the existing seal');
 const audit=read(path.join(base,'audits',`${label}.json`));
 assert(audit.ok&&audit.units===100,'The final independent audit must pass at 100 chapters');
 const stateFile=path.join(base,'works/潮汐信号/.writer/state.json');
 const frozen=path.join(base,'checkpoints',label,'files/.writer/state.json');
 const bytes=fs.readFileSync(stateFile),state=JSON.parse(bytes);
 assert.equal(state.units.length,100);
 assert.equal(state.revision,audit.revision);
 assert.equal(sha(bytes),sha(fs.readFileSync(frozen)),'Final audit must bind the current authority');
 const active=read(path.join(base,'active.json'));
 assert.equal(read(path.join(base,active.phase,'process-result.json')).exit_code,0,'Native writing must have stopped successfully');
 const files=inventory();
 const payload={schema_version:1,generated_at:new Date().toISOString(),scope:'Every regular campaign file; hashes prove identity and completeness, not semantic or literary quality',excluded:['evidence-manifest.json (this file)'],final_audit:label,revision:state.revision,units:100,state_sha256:sha(bytes),file_count:files.length,total_bytes:files.reduce((n,r)=>n+r.bytes,0),files};
 fs.writeFileSync(manifestFile,JSON.stringify(payload,null,2)+'\n',{flag:'wx'});
 console.log(JSON.stringify({ok:true,mode,files:files.length,bytes:payload.total_bytes,manifest_sha256:sha(fs.readFileSync(manifestFile))}));
}else{
 const manifest=read(manifestFile),actual=inventory();
 assert.deepEqual(actual,manifest.files,'Missing, added or changed evidence since seal');
 assert.equal(actual.length,manifest.file_count);
 assert.equal(actual.reduce((n,r)=>n+r.bytes,0),manifest.total_bytes);
 console.log(JSON.stringify({ok:true,mode,files:actual.length,bytes:manifest.total_bytes,manifest_sha256:sha(fs.readFileSync(manifestFile))}));
}
