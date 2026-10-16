import fs from 'node:fs';
import {project,stage,hash,runner} from './run-cli.mjs';
const dst=stage+'/repair-0072-complete-before';fs.mkdirSync(dst,{recursive:false});
const state=JSON.parse(fs.readFileSync(project+'/.writer/state.json','utf8'));
const files=['正文/0072-把空出来的地方留着.md','.writer/state.json',...state.units.map(x=>x.journal).filter(Boolean)];
const manifest=[];
for(const p of files){const dest=dst+'/'+p.replaceAll('/','__');fs.copyFileSync(project+'/'+p,dest,fs.constants.COPYFILE_EXCL);manifest.push({source:project+'/'+p,copy:dest,sha256:hash(dest)});}
for(const p of ['record-0072.json','record-0072-before-v2.json','context-0072-v2.json','changes-0072.json','plan-0072.json']){const dest=dst+'/'+p;fs.copyFileSync(stage+'/'+p,dest,fs.constants.COPYFILE_EXCL);manifest.push({source:stage+'/'+p,copy:dest,sha256:hash(dest)});}
fs.writeFileSync(dst+'/manifest.json',JSON.stringify({revision:203,earliest_affected_unit:72,source_consumers:[72],later_consumers:[],reason:['Chapter 71 hangs pillowcase on morning 43; chapter 72 incorrectly calls it last night.','Chapter 72 cup water mark sentence has unclear subject and verb.'],files:manifest},null,2)+'\n');
console.log(JSON.stringify({files:manifest.length,manifest:dst+'/manifest.json',state_sha256:hash(project+'/.writer/state.json')}));
