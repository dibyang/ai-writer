import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const base=path.dirname(fileURLToPath(import.meta.url)),root=path.join(base,'work');
const [n,label]=process.argv.slice(2),unit=Number(n);
const before=JSON.parse(fs.readFileSync(path.join(base,'commands',label,'before-state.json')));
const record=JSON.parse(fs.readFileSync(path.join(root,`研究/AL-b-record${unit}.json`)));
for(const [name,value] of Object.entries(record.changes.characters??{})){
 const old=before.snapshot.characters[name];if(old)record.changes.characters[name]=value+'；此前有效状态及知识按原章时点保留：'+old;
}
for(const [id,change] of Object.entries(record.changes.ledger??{})){
 const old=before.snapshot.ledger?.[id];if(!old)continue;
 for(const [name,value] of Object.entries(change.character_known??{}))if(old.character_known?.[name])change.character_known[name]=value+'；此前有效知识按原章时点保留：'+old.character_known[name];
 if(change.reader_known&&old.reader_known)change.reader_known+='；此前有效读者信息按原时点保留：'+old.reader_known;
}
const target=path.join(root,`研究/AL-b-record${unit}-retained.json`);
fs.writeFileSync(target,JSON.stringify(record,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({unit,retained_from:label,record:path.relative(root,target),source_hashes_unchanged:true}));
