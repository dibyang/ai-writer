import fs from 'node:fs';import path from 'node:path';
const base=path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/,'$1'));const project=path.resolve(base,'../works/雨线档案');
const [from,to,label,report]=process.argv.slice(2);const source_hashes=JSON.parse(fs.readFileSync(path.join(base,label+'.hashes.json'),'utf8'));
fs.appendFileSync(path.join(project,report),'\n```json\n'+JSON.stringify(source_hashes,null,2)+'\n```\n');
fs.writeFileSync(path.join(base,'review-'+from+'-'+to+'.json'),JSON.stringify({from:+from,to:+to,kind:'model-self-review',report,source_hashes},null,2)+'\n');
