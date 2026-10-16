const fs=require('node:fs'),path=require('node:path');
const n=Number(process.argv[2]),base=__dirname,p=path.resolve(base,'../works/潮汐信号');
const t=JSON.parse(fs.readFileSync(path.join(base,`cli/template-${n}.stdout.txt`),'utf8'));
const c=JSON.parse(fs.readFileSync(path.join(base,`changes-${n}.json`),'utf8'));
const s=JSON.parse(fs.readFileSync(path.join(p,'.writer/state.json'),'utf8'));
if(s.revision!==t.expected_revision)throw new Error('revision drift');
for(const [name,v]of Object.entries(c.changes.characters||{}))c.changes.characters[name]=v+'；此前已知与经历（按时点保留）：'+(s.snapshot.characters[name]||'首次出现');
for(const [id,e]of Object.entries(c.changes.ledger||{}))for(const [name,v]of Object.entries(e.character_known||{})){const old=s.snapshot.ledger[id]?.character_known?.[name];if(old)e.character_known[name]=v+'；此前知情（按时点保留）：'+old;}
t.summary=c.summary;t.changes=c.changes;
fs.writeFileSync(path.join(base,`record-${n}.json`),JSON.stringify(t,null,2)+'\n');
console.log(JSON.stringify({unit:n,expected_revision:t.expected_revision,source_hashes:t.source_hashes,ledger_changes:Object.keys(t.changes.ledger)}));
