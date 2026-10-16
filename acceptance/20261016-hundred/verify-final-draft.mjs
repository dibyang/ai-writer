import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
const b='acceptance/20261016-hundred',origin=JSON.parse(fs.readFileSync(`${b}/documentation-origin-v3.json`)),hash=x=>crypto.createHash('sha256').update(x).digest('hex'),rows=[],links=[];
for(const entry of origin.files){
 const before=fs.readFileSync(entry.file),file=path.join(origin.target,entry.file),after=fs.readFileSync(file);assert.equal(hash(before),entry.sha256,'Main changed: '+entry.file);assert(fs.lstatSync(file).isFile()&&!fs.lstatSync(file).isSymbolicLink());
 const row={file:entry.file,before_sha256:entry.sha256,after_sha256:hash(after)};
 if(entry.file.endsWith('.mjs')){
  const a=before.toString('utf8').split('\n'),z=after.toString('utf8').split('\n');assert.equal(a.length,z.length);const changed=a.flatMap((line,i)=>line===z[i]?[]:[i]);row.changed_lines=changed.map(i=>i+1);
  if(entry.file==='lib/help.mjs'){assert.deepEqual(changed.map(i=>z[i].trim().split(':')[0]),['context','recall','review']);assert(z[changed[2]].includes('from: 1, to: 1'));row.scope='Three help metadata rows only; parsing and error behavior unchanged';}
  else{assert.equal(entry.file,'lib/longform.mjs');assert.equal(changed.length,1);assert(a[changed[0]].trim().startsWith('instruction:'));assert(z[changed[0]].includes('追踪用的章节号和账本ID只供定位'));assert(z[changed[0]].includes('人物实际可知的日期、称谓和场景动作'));row.scope='One context instruction string only; selection, recall ordering and record logic unchanged';}
 }else{
  for(const m of after.toString('utf8').matchAll(/\[[^\]]+\]\(([^)]+)\)/g)){const ref=m[1].replace(/^<|>$/g,'').split('#')[0];if(!ref||/^[a-z][a-z0-9+.-]*:/i.test(ref))continue;const target=path.resolve(path.dirname(entry.file),decodeURIComponent(ref));assert(fs.existsSync(target),`Missing target after main apply: ${entry.file} ${ref}`);links.push({file:entry.file,reference:ref,target});}
 }
 rows.push(row);
}
const result={at:new Date().toISOString(),scope:'Unapplied seven-file static/source/link checks only; not main tests or native effectiveness validation',main_sources_unchanged:true,files:rows,local_links:links};fs.writeFileSync(`${b}/documentation-next-manifest-v3.json`,JSON.stringify(result,null,2)+'\n',{flag:'wx'});console.log(JSON.stringify({ok:true,files:rows.length,links:links.length,main_unchanged:true,applied:false}));
