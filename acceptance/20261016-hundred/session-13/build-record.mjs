import fs from 'node:fs';
import crypto from 'node:crypto';
const base='acceptance/20261016-hundred/session-13',project='acceptance/20261016-hundred/works/潮汐信号',n=+process.argv[2];
const s=JSON.parse(fs.readFileSync(project+'/.writer/state.json')),input=JSON.parse(fs.readFileSync(base+'/'+(process.argv[3]??('template-'+n+'-before.json')))),data=JSON.parse(fs.readFileSync(base+'/changes-'+n+'.json'));
if(s.revision!==input.expected_revision)throw Error('revision changed before record preparation');
for(const [name,v]of Object.entries(data.characters??{}))data.characters[name]=v+'；历史有效信息（以下均为原章时点，不作当前状态）：'+(s.snapshot.characters[name]??'');
for(const [id,x]of Object.entries(data.ledger??{})){
 const old=s.snapshot.ledger[id];
 for(const [name,v]of Object.entries(x.character_known??{}))x.character_known[name]='第'+n+'章：'+v+(old?.character_known?.[name]?'；历史有效信息（以下均为原章时点，不作当前状态）：'+old.character_known[name]:'');
 if(x.custody){if(!old?.custody?.holder)throw Error('new custody must be handled explicitly '+id);x.previous_holder=old.custody.holder;}
 x.evidence=x.evidence.map(quote=>({unit:n,quote}));
}
input.summary=data.summary;delete data.summary;input.changes=data;
delete input._instructions;
fs.writeFileSync(base+'/record-'+n+'.json',JSON.stringify(input,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({unit:n,expected_revision:input.expected_revision,source_hashes:input.source_hashes,changed_ids:Object.keys(data.ledger??{}),input_sha256:crypto.createHash('sha256').update(fs.readFileSync(base+'/record-'+n+'.json')).digest('hex')}));
