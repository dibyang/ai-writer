import fs from 'node:fs';
const base='acceptance/20261027-long-0100-al/';let s=fs.readFileSync(base+'update.mjs','utf8');
for(const [a,b] of [['0.10.0-long-al1','0.10.0-long-al2'],['update-options.json','update2-options.json'],['update-input.json','update2-input.json'],['update-verification.json','update2-verification.json'],["'update-plan'","'update2-plan'"],["'update-apply'","'update2-apply'"]])s=s.replaceAll(a,b);
fs.writeFileSync(base+'update2.mjs',s,{flag:'wx'});
