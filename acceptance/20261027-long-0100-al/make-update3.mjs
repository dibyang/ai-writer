import fs from 'node:fs';
const base='acceptance/20261027-long-0100-al/';let s=fs.readFileSync(base+'update.mjs','utf8');
for(const [a,b] of [['0.10.0-long-al1','0.10.0-long-al2'],['update-options.json','update3-options.json'],['update-input.json','update3-input.json'],['update-verification.json','update3-verification.json'],["run('update-plan'","run('update3-plan'"],["run('update-apply'","run('update3-apply'"]])s=s.replaceAll(a,b);
fs.writeFileSync(base+'update3.mjs',s,{flag:'wx'});
