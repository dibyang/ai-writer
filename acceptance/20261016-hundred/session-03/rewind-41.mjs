import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {createRunner} from '../command-runner.mjs';
const stage='acceptance/20261016-hundred/session-03',project='acceptance/20261016-hundred/works/潮汐信号';
const r=createRunner(stage),sha=f=>crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');
const pre=r.run(process.execPath,['bin/ai-writer.mjs','status','--project',project,'--view','full'],'status-before-rewind');
if(pre.exit_code!==0)throw Error(pre.stderr);const s=JSON.parse(pre.stdout);if(s.revision!==87||s.next_unit!==43)throw Error('Unexpected pre-rewind state');
const archive=stage+'/repair-41-before';fs.mkdirSync(archive);
const copies=[['.writer/state.json',project]];
for(const n of [41,42]){
 copies.push(['正文/'+fs.readdirSync(project+'/正文').find(x=>x.startsWith(String(n).padStart(4,'0')+'-')),project]);
 for(const prefix of ['plan','context','context-view','template','changes','record'])copies.push([`${prefix}-${n}.json`,stage]);
}
const files=[];
for(const [rel,root] of copies){const source=root+'/'+rel,dest=archive+'/'+rel.replaceAll('/','__');fs.copyFileSync(source,dest,fs.constants.COPYFILE_EXCL);files.push({source,archive:dest,sha256:sha(source)});}
const consumer=JSON.parse(fs.readFileSync(stage+'/record-42.json','utf8')).source_hashes;
fs.writeFileSync(archive+'/manifest.json',JSON.stringify({reason:'第41章已登记正文句子“别托她到了才讲要钱”含错字与错指代，应为“别等他到了才讲要钱”。',earliest_affected_unit:41,source_consumers:[42],current_registered_range:[1,42],revision_before:87,unit42_source_hashes:consumer,files,scope:'Only chapter 41 two characters will change. Chapter 42 body remains byte-identical; replay required because its source hashes consumed chapter 41 and post-41 state. No other plot or due changes.'},null,2)+'\n');
for(const n of [41,42])for(const prefix of ['template','record']){
 const source=path.resolve(`${stage}/${prefix}-${n}.json`),dest=path.resolve(`${archive}/retired-${prefix}-${n}.json`);
 if(!source.startsWith(path.resolve(stage)+path.sep)||!dest.startsWith(path.resolve(archive)+path.sep))throw Error('Archive path boundary');fs.renameSync(source,dest);
}
const x=r.run(process.execPath,['bin/ai-writer.mjs','rewind','--project',project,'--from','41','--expected-revision','87'],'rewind-41');console.log(x.stdout);console.error(x.stderr);if(x.exit_code!==0)process.exitCode=x.exit_code??1;
