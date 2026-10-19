import fs from 'node:fs';
const n=Number(process.argv[2]),H='acceptance/20261019-hundred-h',D=H+'/draft-c';
const t=JSON.parse(fs.readFileSync(H+'/commands/draft-c-template-'+n+'/stdout.raw.txt')),a=JSON.parse(fs.readFileSync(D+'/changes-'+n+'.json')),s=JSON.parse(fs.readFileSync(H+'/work/.writer/state.json'));
if(s.revision!==t.expected_revision)throw Error('stale template');
t.summary=a.summary;t.changes={characters:Object.fromEntries(Object.entries(a.character_updates).map(([k,v])=>[k,v+'；此前有效状态/知识按原章时点保留：'+s.snapshot.characters[k]])),timeline_append:a.timeline_append,ledger:a.ledger};
fs.writeFileSync(D+'/record-'+n+'.json',JSON.stringify(t,null,2)+'\n',{flag:'wx'});console.log({unit:n,expected_revision:t.expected_revision,ledger:Object.keys(a.ledger)});
