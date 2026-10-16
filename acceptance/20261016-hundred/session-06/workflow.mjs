import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {createRunner} from '../command-runner.mjs';
const stage='acceptance/20261016-hundred/session-06',project='acceptance/20261016-hundred/works/潮汐信号',runner=createRunner(stage);
const [action,num]=process.argv.slice(2),n=Number(num),pad=String(n).padStart(4,'0');
const input=file=>path.join(stage,file),sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const save=(file,data)=>fs.writeFileSync(input(file),JSON.stringify(data,null,2)+'\n',{flag:'wx'});
function cli(args,label){const r=runner.run(process.execPath,['bin/ai-writer.mjs',...args,'--project',project],label);if(r.exit_code!==0){console.error(r.stderr);throw Error(`CLI failed ${label}: ${r.files.metadata}`);}return JSON.parse(r.stdout);}
if(action==='prepare'){
 const p=JSON.parse(fs.readFileSync(input(`plan-${n}.json`),'utf8'));
 const plan=cli(['plan','--input',input(`plan-${n}.json`)],`plan-${n}`);
 const outline=cli(['outline','--unit',num],`outline-${n}`);
 const context=cli(['context','--unit',num,'--max-chars','450000'],`context-${n}`);save(`context-${n}.json`,context);
 const template=cli(['record-template','--unit',num,'--draft',p.draft],`template-${n}`);save(`template-${n}.json`,template);
 console.log(JSON.stringify({plan,outline,context_keys:Object.keys(context),revision:context.revision,source_hashes:context.source_hashes,omitted_ids:context.omitted_ids,template},null,2));
}
if(action==='context-view'){
 const c=JSON.parse(fs.readFileSync(input(`context-${n}.json`),'utf8'));
 console.log(JSON.stringify(c,null,2));
}
if(action==='context-lens'){
 const c=JSON.parse(fs.readFileSync(input(`context-${n}.json`),'utf8'));
 console.log(JSON.stringify({settings:c.settings,previous_ending:c.previous_ending,recent:c.recent,characters:Object.fromEntries(Object.entries(c.snapshot?.characters??{}).map(([k,v])=>[k,v.split('；保留')[0].split('；历史')[0].split('；截至')[0]])),continuity_keys:Object.keys(c.continuity??{}),continuity:c.continuity&&{...c.continuity,ledger:Object.fromEntries(Object.entries(c.continuity.ledger??{}).map(([k,v])=>[k,{...v,character_known:Object.fromEntries(Object.entries(v.character_known??{}).map(([name,value])=>[name,value.split('；保留')[0].split('；历史')[0].split('；截至')[0]]))}]))}},null,2));
}
if(action==='context-compact'){
 const c=JSON.parse(fs.readFileSync(input(`context-${n}.json`),'utf8'));
 const shorten=v=>typeof v==='string'?v.split('；保留')[0].split('；历史')[0].split('；截至')[0]:v;
 console.log(JSON.stringify({revision:c.revision,characters:Object.fromEntries(Object.entries(c.snapshot?.characters??{}).map(([k,v])=>[k,shorten(v)])),continuity_keys:Object.keys(c.continuity??{}),recall:c.continuity?.recall,source_hashes:c.source_hashes,previous_ending:c.previous_ending.slice(-900)},null,2));
}
if(action==='measure'){
 const p=JSON.parse(fs.readFileSync(input(`plan-${n}.json`),'utf8')),b=fs.readFileSync(path.join(project,p.draft)),t=b.toString('utf8').replace(/^\s*#{1,6}[^\n]*(?:\n|$)/gm,'');
 console.log(JSON.stringify({unit:n,path:p.draft,han:(t.match(/\p{Script=Han}/gu)??[]).length,sha256:sha(b)}));
}
if(action==='record'){
 const p=JSON.parse(fs.readFileSync(input(`plan-${n}.json`),'utf8')),t=JSON.parse(fs.readFileSync(input(`template-${n}.json`),'utf8')),a=JSON.parse(fs.readFileSync(input(`authored-${n}.json`),'utf8'));
 const current=JSON.parse(fs.readFileSync(path.join(project,'.writer/state.json'),'utf8'));
 const s=current.snapshot??current.current??current;
 for(const [name,value] of Object.entries(a.changes.characters??{}))a.changes.characters[name]=value+(s.characters?.[name]?`；保留的有效历史（以下均为原章时点，不作当前位置）：${s.characters[name]}`:'');
 for(const [id,e] of Object.entries(a.changes.ledger??{}))for(const [name,value] of Object.entries(e.character_known??{})){const old=s.ledger?.[id]?.character_known?.[name];if(old)e.character_known[name]=value+`；历史有效信息（原章时点）：${old}`;}
 const record={...t,summary:a.summary,changes:a.changes};save(`record-${n}.json`,record);
 const result=cli(['record','--input',input(`record-${n}.json`)],`record-${n}`);const check=cli(['check'],`check-${n}`);
 console.log(JSON.stringify({result,check},null,2));
}
