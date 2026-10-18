import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
const base=path.dirname(fileURLToPath(import.meta.url));
const manifestFile=path.join(base,'evidence-manifest.json'),mode=process.argv[2];
if(!['seal','verify'].includes(mode))throw Error('Use seal once, or read-only verify');
function digest(file){const h=crypto.createHash('sha256'),fd=fs.openSync(file,'r'),b=Buffer.alloc(1024*1024);try{let n;while((n=fs.readSync(fd,b,0,b.length,null)))h.update(b.subarray(0,n));}finally{fs.closeSync(fd);}return h.digest('hex');}
function inventory(){const files=[];let bytes=0;function walk(dir,ref=''){for(const name of fs.readdirSync(dir).sort()){const next=ref?`${ref}/${name}`:name,file=path.join(dir,name);if(next==='evidence-manifest.json')continue;const s=fs.lstatSync(file);assert.equal(s.isSymbolicLink(),false,next);if(s.isDirectory())walk(file,next);else{assert.equal(s.isFile(),true,next);files.push({file:next,bytes:s.size,sha256:digest(file)});bytes+=s.size;if(files.length%2500===0)console.log(JSON.stringify({mode,hashed_files:files.length,bytes}));}}}walk(base);return {files,bytes};}
const actual=inventory();
if(mode==='seal'){assert.equal(JSON.parse(fs.readFileSync(path.join(base,'final-verification.json'))).ok,true);fs.writeFileSync(manifestFile,JSON.stringify({format:'sha256-tree-v1',at:new Date().toISOString(),root:'acceptance/20261018-recovery-e',excluded:['evidence-manifest.json'],file_count:actual.files.length,bytes:actual.bytes,files:actual.files},null,2)+'\n',{flag:'wx'});}else{const expected=JSON.parse(fs.readFileSync(manifestFile));assert.equal(actual.files.length,expected.file_count);assert.equal(actual.bytes,expected.bytes);assert.deepEqual(actual.files,expected.files);}
console.log(JSON.stringify({ok:true,mode,files:actual.files.length,bytes:actual.bytes,manifest_sha256:digest(manifestFile)}));
