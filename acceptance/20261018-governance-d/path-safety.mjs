import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {runner,sha,write} from './cli-support.mjs';
const r=runner(process.argv[2]),root=path.join(r.dest,'work');r.setup(root);const before=sha(fs.readFileSync(path.join(root,'.writer/state.json'))),cases=[];
const junction=path.join(r.dest,'source-junction');let linked=false;
try{fs.symlinkSync(process.cwd(),junction,'junction');linked=true;}catch(e){if(!['EPERM','EACCES','ENOTSUP'].includes(e.code))throw e;cases.push({kind:'junction',skipped:e.code});}
if(linked){try{assert.equal(fs.lstatSync(junction).isSymbolicLink(),true);const error=r.run(root,['tool','update-plan','--source',junction],null,2);assert.equal(error.code,'BUILD_UNSAFE_PATH');cases.push({kind:'junction',rejected:error.code});}finally{assert.equal(path.dirname(path.resolve(junction)),path.resolve(r.dest));assert.equal(fs.lstatSync(junction).isSymbolicLink(),true);fs.unlinkSync(junction);}}
const source=path.join(r.dest,'hardlink-source');fs.cpSync(path.join(root,'.writer/tool'),source,{recursive:true});fs.unlinkSync(path.join(source,'build-manifest.json'));const twin=path.join(r.dest,'hardlink-twin.mjs');fs.linkSync(path.join(source,'lib/tool-update.mjs'),twin);assert.equal(fs.statSync(twin).nlink,2);write(path.join(r.dest,'observed-link.json'),{target:'hardlink-source/lib/tool-update.mjs',twin:'hardlink-twin.mjs',nlink:2,sha256:sha(fs.readFileSync(twin))});
const error=r.run(root,['tool','update-plan','--source',source],null,2);assert.equal(error.code,'TOOL_SOURCE_INVALID');fs.unlinkSync(twin);cases.push({kind:'hardlink',rejected:error.code});
assert.equal(sha(fs.readFileSync(path.join(root,'.writer/state.json'))),before);r.summary({cases,state_unchanged:true,nature:'Windows directory junction and file hardlink created only in D fixture; source junction removed by unlink, never recursive traversal. Hardlink pair only inside disposable source copy; main source nlink untouched.'});console.log(JSON.stringify({ok:true,cases}));
