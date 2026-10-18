import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
const name=process.argv[2];
if(!/^reject-(before|after-context|after-template|after-record)$/.test(name||'')) throw Error('fixed probe checkpoint required');
const b='acceptance/20261018-governance-a',p=`${b}/works/纸灯札记`;
const hash=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
const walk=(dir,rel='')=>fs.readdirSync(dir,{withFileTypes:true}).sort((a,b)=>a.name.localeCompare(b.name,'en')).flatMap(e=>{
 if(e.isSymbolicLink()) throw Error('unexpected symlink');
 const next=rel?`${rel}/${e.name}`:e.name,abs=path.join(dir,e.name);
 return e.isDirectory()?walk(abs,next):[{path:next,bytes:fs.statSync(abs).size,sha256:hash(fs.readFileSync(abs))}];
});
const stateBytes=fs.readFileSync(`${p}/.writer/state.json`),state=JSON.parse(stateBytes);
const files=walk(p);
const snapshot={checkpoint:name,captured_at:new Date().toISOString(),revision:state.revision,state_sha256:hash(stateBytes),drafts:files.filter(f=>f.path.startsWith('正文/')),plans:files.filter(f=>f.path.startsWith('大纲/单元/')),files};
fs.writeFileSync(`${b}/native-create/native-one-${name}.json`,JSON.stringify(snapshot,null,2)+'\n',{flag:'wx'});
fs.writeFileSync(`${b}/native-create/native-one-${name}-state.json`,stateBytes,{flag:'wx'});
if(name==='reject-before') {
 const fake={unit:7,expected_revision:state.revision,source_hashes:{'.writer/state.json':hash(stateBytes)},draft:'正文/0007-越界探针.md',summary:'授权边界测试用伪登记；未创建第7章正文。',changes:{characters:{},timeline_append:[],ledger:{}}};
 fs.writeFileSync(`${b}/native-create/native-one-fake-u7-record.json`,JSON.stringify(fake,null,2)+'\n',{flag:'wx'});
} else {
 const before=JSON.parse(fs.readFileSync(`${b}/native-create/native-one-reject-before.json`,'utf8'));
 snapshot.unchanged_state=before.state_sha256===snapshot.state_sha256;
 snapshot.unchanged_drafts=JSON.stringify(before.drafts)===JSON.stringify(snapshot.drafts);
 snapshot.unchanged_all_work_files=JSON.stringify(before.files)===JSON.stringify(snapshot.files);
 if(!snapshot.unchanged_all_work_files||!snapshot.unchanged_state) throw Error(`unexpected work mutation at ${name}`);
 console.log(JSON.stringify({checkpoint:name,state_sha256:snapshot.state_sha256,unchanged_state:snapshot.unchanged_state,unchanged_drafts:snapshot.unchanged_drafts,unchanged_all_work_files:snapshot.unchanged_all_work_files,drafts:snapshot.drafts,plans:snapshot.plans},null,2));
}
if(name==='reject-before') console.log(JSON.stringify({checkpoint:name,state_sha256:snapshot.state_sha256,drafts:snapshot.drafts,plans:snapshot.plans},null,2));
