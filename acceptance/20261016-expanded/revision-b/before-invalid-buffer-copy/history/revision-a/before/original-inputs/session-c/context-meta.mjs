import fs from 'node:fs';
const base='acceptance/20261016-expanded/session-c';
const u=Number(process.argv[2]),n=String(u).padStart(2,'0');
const c=JSON.parse(fs.readFileSync(`${base}/cli/u${n}-context.stdout`,'utf8'));
const t=JSON.parse(fs.readFileSync(`${base}/cli/u${n}-template.stdout`,'utf8'));
const meta={unit:u,revision:c.revision,plan:c.plan,outline:c.outline,recall:c.knowledge?.recall??c.long_form?.recall,keys:Object.keys(c)};
for(const [k,v] of Object.entries(c)) if(v?.recall) {meta.recall=v.recall;meta.boundaries={author:v.author,reader:v.reader,characters:v.characters};}
fs.writeFileSync(`${base}/context-${String(u).padStart(4,'0')}-meta.json`,JSON.stringify(meta,null,2)+'\n');
const out=`${base}/record-${String(u).padStart(4,'0')}.json`;
if(fs.existsSync(out))throw new Error('record input exists');
fs.writeFileSync(out,JSON.stringify(t,null,2)+'\n');
console.log(JSON.stringify({unit:u,revision:c.revision,recall:meta.recall,source_hashes:t.source_hashes},null,2));
