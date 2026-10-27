import fs from 'node:fs';import path from 'node:path';
const base=path.resolve('acceptance/20261024-long-flow-090-ac');const input=JSON.parse(fs.readFileSync(path.join(base,'d-inputs/assemble46-final-v2.json')));input.draft='正文/0046-盒里最后一块-ac-d-v2.md';fs.writeFileSync(path.join(base,'d-inputs/assemble46-final-target.json'),JSON.stringify(input,null,2)+'\n',{flag:'wx'});
