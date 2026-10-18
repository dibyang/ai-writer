import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.dirname(here), source=path.dirname(path.dirname(root));
const handoff=JSON.parse(fs.readFileSync(path.join(root,'native-c/handoff.json')));
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const [mode,...args]=process.argv.slice(2);
fs.mkdirSync(path.join(here,'inputs'),{recursive:true});
if(mode==='read'||mode==='chapters') {
  const [phase,...requested]=args;
  const files=mode==='chapters'?requested.map(x=>path.join(handoff.workspace,handoff.manuscripts.find(m=>m.unit===Number(x)).draft)):requested;
  fs.mkdirSync(path.join(here,'read-versions'),{recursive:true});
  const index=path.join(here,'readings.json');
  const rows=fs.existsSync(index)?JSON.parse(fs.readFileSync(index)):[];
  for(const file of files) {
    const full=path.resolve(file), b=fs.readFileSync(full), digest=sha(b);
    const copy=path.join(here,'read-versions',`${String(rows.length+1).padStart(3,'0')}-${digest.slice(0,12)}-${path.basename(full)}`);
    fs.writeFileSync(copy,b,{flag:'wx'});
    const lines=b.toString('utf8').split(/\r?\n/);
    console.log(`FILE ${full}\nSHA256 ${digest}\nPHASE ${phase}`);
    lines.forEach((line,i)=>console.log(`${i+1}\t${line}`));
    rows.push({phase,path:full,sha256:digest,bytes:b.length,lines:lines.length,version:path.relative(here,copy).replaceAll('\\','/'),shown_at:new Date().toISOString(),nature:'actual CLI output; exposure requires parent event audit'});
  }
  fs.writeFileSync(index,JSON.stringify(rows,null,2)+'\n');
} else if(mode==='run') {
  const [label,target,...rest]=args;
  if(!label.startsWith('d-'))throw Error('d-label required');
  const project=target==='branch'?handoff.workspace:handoff.project_path;
  const entry=target==='external'?path.join(source,'bin/ai-writer.mjs'):path.join(handoff.project_path,'.writer/tool/bin/ai-writer.mjs');
  const cli=[entry,...rest,'--project',project];
  if(target==='branch')cli.push('--revision-token',handoff.token);
  const result=spawnSync(process.execPath,[path.join(root,'capture.mjs'),label,process.execPath,...cli],{encoding:'utf8',windowsHide:true,maxBuffer:64*1024*1024});
  const dir=path.join(root,'commands',label);
  console.log(`CAPTURE ${label} exit=${result.status}`);
  if(fs.existsSync(path.join(dir,'stdout.raw.txt'))){
    const out=fs.readFileSync(path.join(dir,'stdout.raw.txt'),'utf8').replaceAll(handoff.token,'[local-token-redacted]');
    if(rest[0]==='tool'&&['identify','update-plan'].includes(rest[1])){
      const x=JSON.parse(out); console.log(JSON.stringify({...Object.fromEntries(Object.entries(x).filter(([k])=>!['files','source','target','root_resources','root_files','preserved_resources'].includes(k))),source:x.source?{...x.source,files:x.source.files?.length}:undefined,target:x.target?{...x.target,files:x.target.files?.length}:undefined,files:x.files?.length,full_output:path.join(dir,'stdout.raw.txt')},null,2));
    }else if(out.length>8000&&['record-preview','replay-input'].some(x=>rest.includes(x))){
      const x=JSON.parse(out);console.log(JSON.stringify({ok:x.ok,unit:x.unit,revision:x.revision,expected_revision:x.expected_revision,writes:x.writes,change_count:x.changes?.length,unchanged:x.unchanged,source_hashes:x.source_hashes,findings:x.findings,output:x.output,note:x.note,full_output:path.join(dir,'stdout.raw.txt')},null,2));
    }else console.log(out);
  }
  if(fs.existsSync(path.join(dir,'stderr.raw.txt')))console.log(fs.readFileSync(path.join(dir,'stderr.raw.txt'),'utf8').replaceAll(handoff.token,'[local-token-redacted]'));
  if(result.error)console.log(result.error.message);
  process.exitCode=result.status??1;
} else throw Error('read phase files | run d-label main/branch/external command');
