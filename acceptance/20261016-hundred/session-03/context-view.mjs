import fs from 'node:fs';
const stage='acceptance/20261016-hundred/session-03';
const latest=s=>typeof s==='string'?s.split('；保留至')[0].split('；截至')[0].split('；历史有效')[0].split('；此前')[0]:s;
function omitted(o,out=[]){if(o&&typeof o==='object')for(const [k,v] of Object.entries(o)){if(k==='omitted_ids')out.push(...v);else omitted(v,out);}return out;}
for(const n of [37,38,39,40,41,42]){
 const c=JSON.parse(fs.readFileSync(`${stage}/context-${n}.json`,'utf8'));
 const v={unit:n,revision:c.revision,cast:c.plan.cast,outline:c.outline,characters:Object.fromEntries(Object.entries(c.snapshot.characters??{}).map(([p,x])=>[p,latest(x)])),continuity_author:c.continuity.author,omitted_ids:omitted(c.continuity),source_hashes:c.source_hashes};
 for(const entry of Object.values(v.continuity_author??{})){delete entry.evidence;delete entry.evidence_omitted;}
 fs.writeFileSync(`${stage}/context-view-${n}.json`,JSON.stringify(v,null,2)+'\n');
 console.log(n,'revision',c.revision,'included',Object.keys(v.continuity_author??{}).join(','),'omitted',v.omitted_ids.join(','));
}
