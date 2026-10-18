import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
const stage=path.resolve('acceptance/20261018-governance-b/native-four');
const base=path.dirname(stage);
const root=path.join(base,'scale-hundred/work');
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const write=(p,v)=>fs.writeFileSync(p,JSON.stringify(v,null,2)+'\n',{flag:'wx'});
const [mode,...args]=process.argv.slice(2);
if(mode==='call') {
  const [label,project,...cli]=args;
  const branch=project==='BRANCH'?read(path.join(stage,'session.json')):null;
  const selected=branch?branch.workspace:project==='MAIN'?root:project;
  if(branch&&['rewind','record','review'].includes(cli[0])||branch&&cli[0]==='source'&&cli[1]==='publish')cli.push('--revision-token',branch.token);
  if(!label.startsWith('native-four-')) throw Error('label scope');
  const r=spawnSync(process.execPath,[path.join(base,'capture.mjs'),label,process.execPath,'bin/ai-writer.mjs',...cli,...(project==='NONE'?[]:['--project',selected])],{windowsHide:true,encoding:'utf8',maxBuffer:64*1024*1024});
  const dir=path.join(base,'commands',label);
  if(!fs.existsSync(path.join(dir,'result.json'))) throw Error(r.stderr||r.stdout);
  const meta=read(path.join(dir,'result.json'));
  console.log(JSON.stringify({label,exit_code:meta.exit_code,elapsed_ms:meta.elapsed_ms,raw_dir:dir}));
  if(args.includes('--large-output')) throw Error('invalid CLI flag');
  for(const file of ['stdout.raw.txt','stderr.raw.txt']) {
    const t=fs.readFileSync(path.join(dir,file),'utf8');
    if(t.length<=24000) console.log(file+'\n'+t);
    else console.log(file+': '+t.length+' chars; read complete raw file with FastCtx');
  }
  process.exitCode=0;
} else if(mode==='baseline') {
  const s=read(path.join(root,'.writer/state.json'));
  const hand=read(path.join(base,'scale-hundred/handoff-v2.json'));
  const manifest=read(path.join(base,'scale-hundred/copy-manifest.json'));
  const bodies=hand.before_bodies.map(x=>({...x,actual_sha256:sha(fs.readFileSync(path.join(root,x.draft)))}));
  const v={captured_at:new Date().toISOString(),root,state_sha256:sha(fs.readFileSync(path.join(root,'.writer/state.json'))),schema:s.schema_version,revision:s.revision,keys:Object.keys(s),snapshot_sha256:sha(JSON.stringify(s.snapshot)),expected_snapshot_sha256:hand.original_snapshot_sha256,bodies,all_bodies_match:bodies.every(x=>x.sha256===x.actual_sha256),manifest_files:manifest.files.length,manifest_bytes:manifest.files.reduce((a,x)=>a+x.bytes,0),original_fact_hash:hand.original_snapshot_sha256};
  fs.copyFileSync(path.join(root,'.writer/state.json'),path.join(stage,'baseline-state.json'),fs.constants.COPYFILE_EXCL);
  write(path.join(stage,'baseline.json'),v);
  console.log(JSON.stringify({...v,bodies:{count:bodies.length,mismatches:bodies.filter(x=>x.sha256!==x.actual_sha256)}}));
  console.log(JSON.stringify({governance:s.governance,versions:s.sources,unit100:s.units?.at(-1),journal:s.journal,volume:s.long_form},null,2).slice(0,12000));
} else if(mode==='input') {
  const [name,json]=args;write(path.join(stage,name+'.json'),JSON.parse(json));
} else if(mode==='inspect') {
  const s=read(path.join(root,'.writer/state.json'));
  console.log(JSON.stringify({keys:Object.keys(s),snapshot_keys:Object.keys(s.snapshot??{}),units_type:typeof s.units,chapters:s.chapters?.length,journal:s.journal,source_versions:s.source_versions,protection:s.protection,long_form:s.long_form},null,2));
} else throw Error('mode');
