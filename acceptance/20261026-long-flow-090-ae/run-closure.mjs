import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';import assert from 'node:assert/strict';
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
export function runClosure(base,ref){
 const dir=path.resolve(base,ref),rel=path.relative(base,dir);assert(rel&&!rel.startsWith('..')&&!path.isAbsolute(rel));const resultFile=path.join(dir,'result.json');
 if(fs.existsSync(resultFile)){assert(!fs.existsSync(path.join(dir,'interruption.json')),'Conflicting completion records');const b=fs.readFileSync(resultFile);return {kind:'exit-observed',record:JSON.parse(b),record_sha256:sha(b)};}
 const proofFile=path.join(dir,'interruption.json');assert(fs.existsSync(proofFile),'Run has no exit or verified interruption: '+ref);const bytes=fs.readFileSync(proofFile),p=JSON.parse(bytes);assert.equal(p.status,'interrupted-observed');assert.equal(p.exit_code,null);assert.equal(p.reason,null);
 const readBound=bound=>{const f=path.resolve(base,bound),r=path.relative(base,f);assert(r&&!r.startsWith('..')&&!path.isAbsolute(r));return fs.readFileSync(f);};
 const obs=readBound(p.observation_ref);assert.equal(sha(obs),p.observation_sha256);assert.deepEqual(JSON.parse(obs).targeted_process_query.matching_processes,[]);const recovery=readBound(p.recovery_ref);assert.equal(sha(recovery),p.recovery_sha256);assert.equal(JSON.parse(recovery).exit_code,0);
 assert.deepEqual(fs.readdirSync(dir).filter(n=>n!=='interruption.json').sort(),Object.keys(p.files).sort());for(const [name,row]of Object.entries(p.files)){assert.equal(path.basename(name),name);const file=path.join(dir,name);assert(!fs.lstatSync(file).isSymbolicLink());const b=fs.readFileSync(file);assert.equal(b.length,row.bytes);assert.equal(sha(b),row.sha256);}
 return {kind:'interrupted-observed',record:p,record_sha256:sha(bytes)};
}
