import path from'node:path';import{fileURLToPath}from'node:url';import{spawnSync}from'node:child_process';
const a=path.dirname(fileURLToPath(import.meta.url)),u=process.argv[2];
for(const args of [[path.join(a,'fvr1-finalize-unit.mjs'),u],[path.join(a,'fvr1-cli.mjs'),'work',`fvr1-preview-u${u}`,'record-preview','--input',path.join(a,'fvr1-inputs',`u${u}-reviewed.json`)],[path.join(a,'fvr1-view.mjs'),'preview',u]]){
  const r=spawnSync(process.execPath,args,{encoding:'utf8',windowsHide:true,timeout:130000,maxBuffer:64*1024*1024});
  if(args[0].endsWith('fvr1-cli.mjs')){if(r.status!==0)process.stdout.write(r.stdout??'');}else process.stdout.write(r.stdout??'');
  process.stderr.write(r.stderr??'');if(r.status!==0)process.exit(r.status??1);
}
