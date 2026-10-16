import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
const [label,sourceText]=process.argv.slice(2),base=path.resolve('acceptance/20261016-hundred');
assert(/^[a-z][a-z0-9-]*$/.test(label??'')&&sourceText);
const source=fs.realpathSync(sourceText),allowed=path.join(base,'session-09','metadata-repair','after');
assert(source===allowed||source.startsWith(allowed+path.sep),'Only the native frozen after-work copy is accepted');
const cp=path.join(base,'checkpoints',label);assert(!fs.existsSync(cp),'Preserve an existing checkpoint');
const sha=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
function list(dir,relativeRoot=source){
 const rows=[];for(const name of fs.readdirSync(dir).sort()){
  const file=path.join(dir,name),stat=fs.lstatSync(file);assert(!stat.isSymbolicLink(),'Linked input rejected');
  if(stat.isDirectory())rows.push(...list(file,relativeRoot));else{assert(stat.isFile());rows.push({file:path.relative(relativeRoot,file).split(path.sep).join('/'),sha256:sha(file),bytes:stat.size});}
 }return rows;
}
const stateFile=path.join(source,'.writer/state.json'),stateHash=sha(stateFile),state=JSON.parse(fs.readFileSync(stateFile));
assert.equal(state.units.length,72);assert(state.revision>205);
const files=list(source);fs.mkdirSync(cp);fs.cpSync(source,path.join(cp,'files'),{recursive:true,errorOnExist:true,force:false});
for(const row of files){assert.equal(sha(path.join(source,row.file)),row.sha256,'Native copy changed while freezing');assert.equal(sha(path.join(cp,'files',row.file)),row.sha256);}
assert.deepEqual(list(source),files,'Native file inventory changed while freezing');
assert.deepEqual(list(path.join(cp,'files'),path.join(cp,'files')),files,'Copied file inventory differs');
assert.equal(sha(stateFile),stateHash);
const payload={at:new Date().toISOString(),kind:'copied-native-intermediate-not-a-completed-phase-audit',source,revision:state.revision,units:72,state_sha256:stateHash,scope:'Exact copy of native repair checkpoint before chapter73; requires later binding to the final78 journal and chapter73 source hash',files};
fs.writeFileSync(path.join(cp,'manifest.json'),JSON.stringify(payload,null,2)+'\n',{flag:'wx'});console.log(JSON.stringify({label,revision:state.revision,files:files.length,state_sha256:stateHash}));
