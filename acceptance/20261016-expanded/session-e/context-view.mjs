import fs from 'node:fs';
const stage='acceptance/20261016-expanded/session-e';
const n=Number(process.argv[2]),c=JSON.parse(fs.readFileSync(`${stage}/${n}-context.json`));
const first=s=>String(s).split(/；此前(?:已知与经历|知情保留|状态|知情记录)/u)[0];
const view={unit:c.unit,revision:c.revision,plan:c.plan,outline:c.outline,snapshot:Object.fromEntries(Object.entries(c.snapshot.characters).map(([k,v])=>[k,first(v)])),recent:c.recent,previous_ending:c.previous_ending,continuity:{author:Object.fromEntries(Object.entries(c.continuity.author).map(([id,v])=>[id,v])),reader:c.continuity.reader,characters:Object.fromEntries(Object.entries(c.continuity.characters).map(([name,entries])=>[name,Object.fromEntries(Object.entries(entries).map(([id,v])=>[id,first(v)]))])),recall:c.continuity.recall},source_hashes:c.source_hashes};
fs.writeFileSync(`${stage}/${n}-context-view.json`,JSON.stringify(view,null,2)+'\n');
console.log(JSON.stringify({unit:n,revision:c.revision,selected:Object.keys(c.continuity.author),omitted_ids:c.continuity.recall.omitted_ids,characters:view.snapshot,reader:c.continuity.reader,knowledge:view.continuity.characters,outline:c.outline,previous_ending:c.previous_ending}));
