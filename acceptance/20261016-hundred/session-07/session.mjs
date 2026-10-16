import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {createRunner} from '../command-runner.mjs';
export const stage='acceptance/20261016-hundred/session-07';
export const project='acceptance/20261016-hundred/works/潮汐信号';
export const runner=createRunner(stage);
export const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
export const write=(p,v)=>{fs.mkdirSync(path.dirname(p),{recursive:true});fs.writeFileSync(p,typeof v==='string'?v:JSON.stringify(v,null,2)+'\n','utf8');};
export const cli=(label,args)=>{const r=runner.run(process.execPath,['bin/ai-writer.mjs',...args,'--project',project],label);if(r.exit_code!==0)throw Error(r.stdout+'\n'+r.stderr);return JSON.parse(r.stdout);};
const [action,...args]=process.argv.slice(2);
if(action==='inspect'){
 const s=runner.json('status-full');
 const live=Object.fromEntries(Object.entries(s.snapshot.ledger).filter(([id,x])=>!['resolved','intentional-open'].includes(x.status)));
 write(stage+'/live-ledger.json',live);
 console.log(Object.entries(live).map(([id,x])=>({id,status:x.status,due:x.due_unit,length:JSON.stringify(x).length})));
 console.log('FULL_PATH '+path.resolve(stage+'/live-ledger.json'));
}
if(action==='mark-read'){
 const list=JSON.parse(fs.readFileSync(stage+'/'+args[0],'utf8'));
 for(const x of list){const p=path.resolve(project,x.path);fs.appendFileSync(stage+'/reading.jsonl',JSON.stringify({at:new Date().toISOString(),path:p,sha256:hash(p),range:x.range??'全文',purpose:x.purpose,method:'模型实际完整阅读工具输出；非哈希扫描'})+'\n');}
 console.log('Recorded actual reading entries: '+list.length);
}
if(action==='recall'){
 const r=cli('recall-'+args[0],['recall','--query',args[0],'--limit','30']);
 console.log(JSON.stringify(r,null,2));
}
if(action==='locate'){
 for(const id of args){const r=cli('recall-'+id,['recall','--query',id,'--limit','30']);const x=r.matches.find(x=>x.id===id);console.log(JSON.stringify({query:id,entry:x?.entry,other_matches:r.matches.filter(x=>x.id!==id).map(x=>x.id)}));}
}
