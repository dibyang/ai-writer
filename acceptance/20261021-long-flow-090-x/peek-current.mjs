import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const x=path.dirname(fileURLToPath(import.meta.url));
const commands=path.join(x,'commands');
const active=fs.readdirSync(commands).filter(n=>n.startsWith('codex-')&&!fs.existsSync(path.join(commands,n,'result.json')));
const current=active.sort((a,b)=>fs.statSync(path.join(commands,b)).birthtimeMs-fs.statSync(path.join(commands,a)).birthtimeMs)[0];
if(!current){
  const ref=fs.existsSync(path.join(x,'creation-controller-after-capacity.result.json'))?'creation-controller-after-capacity.result.json':'creation-controller.result.json';
  const file=path.join(x,ref);
  console.log(JSON.stringify({at:new Date().toISOString(),active:[],creation_controller_ref:ref,creation_phase_only:true,creation_controller:fs.existsSync(file)?JSON.parse(fs.readFileSync(file,'utf8')):null}));
}else{
  const v=JSON.parse(execFileSync(process.execPath,[path.join(x,'progress.mjs'),current,'--brief'],{encoding:'utf8',windowsHide:true}));
  const launchFile=path.join(commands,current,'launch.json');
  const launch=fs.existsSync(launchFile)?JSON.parse(fs.readFileSync(launchFile,'utf8')):null;
  const elapsed=launch?Math.round((Date.now()-Date.parse(launch.started_at))/6000)/10:null;
  let candidate=null;
  const handleFile=path.join(x,'cli-logs/e-begin/stdout.raw.txt');
  if(current.startsWith('codex-e-')&&fs.existsSync(handleFile)){
    const h=JSON.parse(fs.readFileSync(handleFile,'utf8'));
    const c=JSON.parse(fs.readFileSync(path.join(h.workspace,'.writer/state.json'),'utf8'));
    candidate={id:h.id,units:c.units.length,revision:c.revision,last_unit:c.units.at(-1)?.unit};
  }
  console.log(JSON.stringify({at:v.at,active:current,started_at:launch?.started_at,elapsed_minutes:elapsed,thread:v.thread,units:v.units,revision:v.revision,stage:v.stage,candidate,events:v.events,latest:v.latest,tail:v.parts?.slice(-2)}));
}
