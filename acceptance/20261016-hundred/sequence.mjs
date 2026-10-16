import fs from 'node:fs';
import {spawn,spawnSync} from 'node:child_process';
const [fromText,toText]=process.argv.slice(2),from=Number(fromText),to=Number(toText);
if(!Number.isInteger(from)||!Number.isInteger(to)||from<2||to>13||to<from)throw Error('sequence <first session 2..13> <last>');
const campaign='20261016-hundred',base=`acceptance/${campaign}`,launcher=JSON.parse(fs.readFileSync(`${base}/environment.json`)).launcher;
for(let n=from;n<=to;n++){
 const phase=`session-${String(n).padStart(2,'0')}`,count=Math.min(100,24+6*n);
 if(fs.existsSync(`${base}/${phase}/events.jsonl`))throw Error(`Preserve existing phase ${phase}`);
 fs.writeFileSync(`${base}/active.json`,JSON.stringify({phase,expected_units:count,started_at:new Date().toISOString()},null,2)+'\n');
 console.log(JSON.stringify({starting:phase,expected_units:count}));
 const code=await new Promise((resolve,reject)=>{const p=spawn(process.execPath,['scripts/codex-acceptance.mjs',phase,launcher,campaign],{stdio:'inherit',windowsHide:true});p.on('error',reject);p.on('close',resolve)});
 if(code!==0)throw Error(`Native phase ${phase} exited ${code}`);
 const manifest=JSON.parse(fs.readFileSync(`${base}/active-candidate.json`)).manifest;
 const auditArgs=[`${base}/audit.mjs`,phase,String(count),manifest];
 const a=spawnSync(process.execPath,auditArgs,{encoding:'utf8',windowsHide:true,maxBuffer:20*1024*1024});
 fs.mkdirSync(`${base}/sequence-audits`,{recursive:true});
 fs.writeFileSync(`${base}/sequence-audits/${phase}.stdout.txt`,a.stdout??'',{flag:'wx'});
 fs.writeFileSync(`${base}/sequence-audits/${phase}.stderr.txt`,a.stderr??'',{flag:'wx'});
 fs.writeFileSync(`${base}/sequence-audits/${phase}.result.json`,JSON.stringify({argv:auditArgs,exit_code:a.status,error:a.error?.message},null,2)+'\n',{flag:'wx'});
 console.log(a.stdout);if(a.stderr)console.error(a.stderr);if(a.status!==0)throw Error(`Audit ${phase} exited ${a.status}`);
 if([42,66,90].includes(count)){console.log(JSON.stringify({revision_checkpoint:count,phase,note:'Stop for grounded multi-chapter author revision before continuing.'}));break;}
}
