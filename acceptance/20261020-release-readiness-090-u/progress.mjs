import fs from 'node:fs';import path from 'node:path';
const base=path.resolve('acceptance/20261020-release-readiness-090-u/commands');
for(const name of fs.readdirSync(base)){
  const dir=path.join(base,name),done=path.join(dir,'result.json');if(!fs.statSync(dir).isDirectory())continue;
  const outFile=path.join(dir,'stdout.raw.txt'),out=fs.existsSync(outFile)?fs.readFileSync(outFile,'utf8'):'';
  if(name.includes('codex')){const events=out.split(/\r?\n/).filter(Boolean).flatMap(s=>{try{return[JSON.parse(s)];}catch{return[];}});const last=events.at(-1);console.log(JSON.stringify({name,result:fs.existsSync(done)?JSON.parse(fs.readFileSync(done)):null,thread:events.find(e=>e.type==='thread.started')?.thread_id,event_count:events.length,last_type:last?.type,last_item_type:last?.item?.type,last_message:events.filter(e=>e.item?.type==='agent_message').at(-1)?.item?.text?.slice(-450),bytes:Buffer.byteLength(out)}));}
  else console.log(JSON.stringify({name,result:fs.existsSync(done)?JSON.parse(fs.readFileSync(done)):null,passed:(out.match(/^✔/gm)??[]).length,failed:(out.match(/^✖/gm)??[]).length,tail:out.slice(-300)}));
}
