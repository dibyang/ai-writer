import fs from 'node:fs';
import path from 'node:path';
import {stage,work,read,hash,write} from './revise.mjs';
const state=read(path.join(work,'.writer/state.json'));
const entries=[];for(const[start,end]of [[1,4],[5,8],[9,12]]){
 let text='';for(const r of state.units.filter(x=>x.unit>=start&&x.unit<=end)){const body=fs.readFileSync(path.join(work,r.draft),'utf8');if(hash(body)!==r.sha256)throw new Error('drift');text+=`文件：${r.draft}\nSHA-256：${r.sha256}\n\n${body}\n\n`;entries.push({unit:r.unit,draft:r.draft,sha256:r.sha256});}
 fs.mkdirSync(path.join(stage,'final-reading'),{recursive:true});fs.writeFileSync(path.join(stage,`final-reading/${String(start).padStart(2,'0')}-${String(end).padStart(2,'0')}.txt`),text);
}
write(path.join(stage,'final-reading/manifest.json'),{revision:state.revision,reading_nature:'Codex main-session informed model self-review',entries});console.log(JSON.stringify({revision:state.revision,units:entries.length}));
