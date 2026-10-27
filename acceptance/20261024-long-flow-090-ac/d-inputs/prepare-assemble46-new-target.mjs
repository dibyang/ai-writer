import fs from 'node:fs';import path from 'node:path';
const base=path.resolve('acceptance/20261024-long-flow-090-ac');const input=JSON.parse(fs.readFileSync(path.join(base,'d-inputs/assemble46-final-v2.json')));input.draft='分段/AC-D-0046/assembled-v2.md';fs.writeFileSync(path.join(base,'d-inputs/assemble46-new-target.json'),JSON.stringify(input,null,2)+'\n',{flag:'wx'});
