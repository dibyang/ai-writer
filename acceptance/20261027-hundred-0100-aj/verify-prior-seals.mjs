import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
const base=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(base,'../..');
const sets=[['20261019-hundred-h','evidence-manifest.json'],['20261027-relocation-0100-ai','seal-files.json']];
const digest=b=>crypto.createHash('sha256').update(b).digest('hex');
const results=[];
for(const [name,manifest] of sets){
  const dir=path.join(root,'acceptance',name),raw=fs.readFileSync(path.join(dir,manifest));
  const parsed=JSON.parse(raw),rows=Array.isArray(parsed)?parsed:parsed.files;
  let bytes=0,count=0; const mismatches=[];
  for(const row of rows){
    try { const b=fs.readFileSync(path.join(dir,row.file)); bytes+=b.length; if(b.length!==row.bytes||digest(b)!==row.sha256)mismatches.push(row.file); }
    catch(e){mismatches.push(`${row.file}: ${e.code||e.message}`);}
    count++; if(count%500===0)fs.writeFileSync(path.join(base,'prior-seals-progress.json'),JSON.stringify({name,count,total:rows.length,bytes,at:new Date().toISOString()},null,2));
  }
  results.push({name,manifest,manifest_sha256:digest(raw),count,bytes,mismatches});
}
const out={ok:results.every(r=>r.mismatches.length===0),results};
fs.writeFileSync(path.join(base,'prior-seals-verification.json'),JSON.stringify(out,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify(out)); if(!out.ok)process.exitCode=1;
