import fs from 'node:fs';
import {project,stage,runner,hash} from './run-cli.mjs';
const tag=String(Number(process.argv[2])).padStart(4,'0');
const suffix=process.argv[3]?'-'+process.argv[3]:'';
const t=JSON.parse(fs.readFileSync(stage+'/record-'+tag+'-before'+suffix+'.json','utf8'));
const patch=JSON.parse(fs.readFileSync(stage+'/changes-'+tag+'.json','utf8'));
const s=JSON.parse(fs.readFileSync(project+'/.writer/state.json','utf8'));
const c=patch.changes;
for(const [name,value]of Object.entries(c.characters??{}))if(s.snapshot.characters[name])c.characters[name]=value+'；保留有效历史（下列为原章时点，不作当前位置）：'+s.snapshot.characters[name];
for(const [id,e]of Object.entries(c.ledger??{}))for(const [name,value]of Object.entries(e.character_known??{})){const old=s.snapshot.ledger[id]?.character_known?.[name];if(old)e.character_known[name]=value+'；历史有效信息（保留原章次，非当前状态）：'+old;}
t.summary=patch.summary;t.changes=c;delete t._instructions;
const recordPath=stage+'/record-'+tag+(process.argv[3]==='v3'?suffix:'')+'.json';
fs.writeFileSync(recordPath,JSON.stringify(t,null,2)+'\n',{flag:'wx'});
const r=runner.run(process.execPath,['bin/ai-writer.mjs','record','--project',project,'--input',recordPath],'record-'+tag+(process.argv[3]==='v3'?suffix:''));
console.log(r.stdout);if(r.stderr)console.error(r.stderr);if(r.exit_code!==0)process.exitCode=r.exit_code;
else{console.log('STATE_AFTER',hash(project+'/.writer/state.json'));const q=runner.run(process.execPath,['bin/ai-writer.mjs','check','--project',project],'check-'+tag);console.log(q.stdout);if(q.exit_code!==0)process.exitCode=q.exit_code;}
