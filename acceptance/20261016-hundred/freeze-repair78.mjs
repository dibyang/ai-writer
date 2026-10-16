import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
const base=path.resolve('acceptance/20261016-hundred'),source=path.join(base,'session-10/knowledge-repair/after/work'),cp=path.join(base,'checkpoints/repair-at78');
assert.equal(fs.realpathSync(source),source);assert(!fs.existsSync(cp),'Preserve checkpoint');
const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
function list(dir,root=source){return fs.readdirSync(dir).sort().flatMap(name=>{const p=path.join(dir,name),s=fs.lstatSync(p);assert(!s.isSymbolicLink());if(s.isDirectory())return list(p,root);assert(s.isFile());return [{file:path.relative(root,p).split(path.sep).join('/'),bytes:s.size,sha256:hash(p)}];});}
const statePath=path.join(source,'.writer/state.json'),state=JSON.parse(fs.readFileSync(statePath)),stateHash=hash(statePath);assert.equal(state.units.length,78);assert(state.revision>258);
const files=list(source);fs.mkdirSync(cp);fs.cpSync(source,path.join(cp,'files'),{recursive:true,errorOnExist:true,force:false});
assert.deepEqual(list(source),files);assert.deepEqual(list(path.join(cp,'files'),path.join(cp,'files')),files);assert.equal(hash(statePath),stateHash);
const result={at:new Date().toISOString(),kind:'native intermediate copy, not completed session audit',source,units:78,revision:state.revision,state_sha256:stateHash,scope:'Exact native repaired78 before79; must bind actual79 input and final84 prefix separately',files};
fs.writeFileSync(path.join(cp,'manifest.json'),JSON.stringify(result,null,2)+'\n',{flag:'wx'});console.log(JSON.stringify({ok:true,units:78,revision:state.revision,files:files.length,state_sha256:stateHash}));
