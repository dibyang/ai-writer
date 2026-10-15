import fs from 'node:fs';import path from 'node:path';
const base=path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/,'$1'));const [unit,label]=process.argv.slice(2);
const template=JSON.parse(fs.readFileSync(path.join(base,'record'+unit+'.json'),'utf8'));
const filled=JSON.parse(fs.readFileSync(path.join(base,'changes'+unit+'.json'),'utf8'));
fs.writeFileSync(path.join(base,'record'+unit+'.json'),JSON.stringify({...template,...filled},null,2)+'\n');console.log('filled saved prewriting template for unit '+unit);
