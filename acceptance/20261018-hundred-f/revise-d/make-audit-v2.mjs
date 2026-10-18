import fs from 'node:fs';
const p=new URL('./',import.meta.url);let t=fs.readFileSync(new URL('audit-final.mjs',p),'utf8');
t=t.replace("p+'/history-position-'+i","p+'/entry-'+(x && typeof x==='object' ? JSON.stringify({unit:x.unit,quote:x.quote,id:x.id}) : JSON.stringify(x))");
t=t.replace("'audit-before-review.json'","'audit-before-review-v2.json'").replace('snapshotDiffs:snapshotDiffs.map','snapshotDiffs:snapshotDiffs.filter(x=>!x.path.endsWith(\'/sha256\')).map');
fs.writeFileSync(new URL('audit-final-v2.mjs',p),t,{flag:'wx'});
