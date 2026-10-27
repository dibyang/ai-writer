import fs from'node:fs';import path from'node:path';import{fileURLToPath}from'node:url';
const a=path.dirname(fileURLToPath(import.meta.url));
const t=fs.readFileSync(path.join(a,'fvt1-workspace-checkpoint.mjs'),'utf8').replaceAll('final-tail-first','final-tail-recovery2').replaceAll('fvt1-workspace-checkpoint-verification','fvt4-workspace-checkpoint-verification');
fs.writeFileSync(path.join(a,'fvt4-workspace-checkpoint.mjs'),t,{flag:'wx'});
console.log(JSON.stringify({ok:true,created:'fvt4-workspace-checkpoint.mjs',project_writes:0}));
