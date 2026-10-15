import fs from 'node:fs';
import path from 'node:path';
const label=String(Number(process.argv[2])).padStart(2,'0');
const c=JSON.parse(fs.readFileSync(path.join(import.meta.dirname,`cli/context-${label}/stdout.txt`),'utf8'));
console.log(JSON.stringify({unit:c.unit,revision:c.revision,plan:c.plan,snapshot:c.snapshot,outline:c.outline,author:Object.fromEntries(Object.entries(c.continuity.author).map(([id,v])=>[id,{...v,evidence:undefined}])),reader:c.continuity.reader,characters:c.continuity.characters,recall:c.continuity.recall},null,2));
