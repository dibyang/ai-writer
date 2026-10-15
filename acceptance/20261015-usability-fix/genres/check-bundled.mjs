import fs from 'node:fs';
import {spawnSync} from 'node:child_process';
const base='acceptance/20261015-usability-fix';
const cases=[['screenplay','借一把椅子'],['history','字放回格子里']];
const results=[];
for(const [kind,title] of cases){
 const project=`${base}/works/${title}`;
 const cli=`${project}/.writer/tool/bin/ai-writer.mjs`;
 for(const [command,args] of [['doctor',['doctor']],['status',['status']],...['init','plan','context','record-template','record','rewind','style-scan','check','export','status','doctor'].map(c=>[`${c}-help`,[c,'--help']])]){
   const label=`bundled-${kind}-${command}`;
   // init accepts --path rather than --project; the CLI path is already explicit.
   const projectArgs=command==='init-help'?[]:['--project',project];
   const r=spawnSync(process.execPath,[`${base}/genres/run-cli.mjs`,label,cli,...args,...projectArgs],{encoding:'utf8',cwd:process.cwd()});
   const entry={kind,command,exit_code:r.status,stdout:r.stdout,stderr:r.stderr};
   results.push(entry);
   if(r.status!==0){console.error(JSON.stringify(entry));process.exitCode=1;}
 }
}
fs.writeFileSync(`${base}/genres/bundled-results.json`,JSON.stringify(results,null,2)+'\n',{flag:'wx'});
for(const r of results){
 console.log(JSON.stringify({kind:r.kind,command:r.command,exit_code:r.exit_code,output:r.command.endsWith('-help')?r.stdout.split('\n').filter(s=>s.includes('ai-writer 0.')||s.startsWith('node ')||s.startsWith('作者手册：')):r.stdout,stderr:r.stderr}));
}
