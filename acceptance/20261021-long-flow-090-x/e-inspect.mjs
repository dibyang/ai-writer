import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
const X=path.dirname(fileURLToPath(import.meta.url)),P=path.join(X,'scenario/东岸末班船-再扩展验证');
const read=f=>JSON.parse(fs.readFileSync(f,'utf8')),sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const s=read(path.join(P,'.writer/state.json')),b=read(path.join(X,'pre-revision36.json'));
console.log(JSON.stringify({keys:Object.keys(b),stateKeys:Object.keys(s),unitKeys:Object.keys(s.units[0]),snapshotKeys:Object.keys(s.snapshot),entry_equal:fs.readFileSync(path.join(X,'parent-before-e-state.json')).equals(fs.readFileSync(path.join(X,'cli-logs/e-entry-status/before-state.json'))),state_sha:sha(fs.readFileSync(path.join(P,'.writer/state.json')))},null,2));
const hits=[];
for(const u of s.units){const t=fs.readFileSync(path.join(P,u.draft),'utf8'),lines=t.split(/\r?\n/);for(let i=0;i<lines.length;i++)if(/九十|90|二十七|27|三点半|三点三十|15[:：]30|七点半|九点|八点半|一个半钟|净宽/.test(lines[i]))hits.push({unit:u.unit,draft:u.draft,line:i+1,text:lines[i]});}
fs.writeFileSync(path.join(X,'e-current-fact-hits.json'),JSON.stringify(hits,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({hit_file:'e-current-fact-hits.json',count:hits.length,units:s.units.map(u=>({unit:u.unit,draft:u.draft,journal:u.journal}))},null,2));
