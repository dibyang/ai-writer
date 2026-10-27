import fs from'node:fs';import path from'node:path';import{fileURLToPath}from'node:url';import{spawnSync}from'node:child_process';
const a=path.dirname(fileURLToPath(import.meta.url)),unit=Number(process.argv[2]);if(!Number.isInteger(unit)||unit<4||unit>25)throw Error('Stage unit range');
const c=JSON.parse(fs.readFileSync(path.join(a,'fvr1-private-ownership.json'),'utf8')),s=JSON.parse(fs.readFileSync(path.join(c.workspace,'.writer/state.json'),'utf8'));
if(s.units.length!==unit-1)throw Error('Must be actual next registered boundary');
for(const[label,args]of[[`fvr1-context-u${unit}`,['context','--purpose','revision','--unit',String(unit),'--max-chars','200000']],[`fvr1-replay-u${unit}`,['revision','replay-input','--unit',String(unit),'--out',`.writer/drafts/fvr1-replay-u${unit}-original.json`]]]){
  const r=spawnSync(process.execPath,[path.join(a,'fvr1-cli.mjs'),'work',label,...args],{encoding:'utf8',windowsHide:true,timeout:130000,maxBuffer:64*1024*1024});
  fs.writeFileSync(path.join(a,label+'.console.txt'),r.stdout??'',{flag:'wx'});if(r.status!==0){process.stdout.write(r.stdout??'');process.stderr.write(r.stderr??'');process.exit(r.status??1);}
}
const v=spawnSync(process.execPath,[path.join(a,'fvr1-view.mjs'),'replay',String(unit)],{encoding:'utf8',windowsHide:true,maxBuffer:1024*1024});process.stdout.write(v.stdout);process.stderr.write(v.stderr);process.exitCode=v.status??1;
