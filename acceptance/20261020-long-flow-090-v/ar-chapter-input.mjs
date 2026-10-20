import fs from 'node:fs';import crypto from 'node:crypto';
const v='D:/work/other/ai-writer/acceptance/20261020-long-flow-090-v',w=v+'/scenario/东岸末班船-扩展验证';
const [mode,n]=process.argv.slice(2),unit=Number(n),state=JSON.parse(fs.readFileSync(w+'/.writer/state.json','utf8'));
if(![4,5,6].includes(unit))throw Error('Only 4-6');
const sha=b=>crypto.createHash('sha256').update(b).digest('hex'),read=f=>JSON.parse(fs.readFileSync(w+'/'+f,'utf8'));
const templateRef=unit===4?'.writer/drafts/v-ar-record-4-r18-before.json':`.writer/drafts/v-ar-record-${unit}-before.json`;
const template=read(templateRef);
const save=(ref,obj)=>{const raw=JSON.stringify(obj,null,2)+'\n';fs.writeFileSync(w+'/'+ref,raw,{flag:'wx'});console.log(JSON.stringify({ref,sha256:sha(Buffer.from(raw))}));};
if(mode==='assemble'){
 const dir=`分段/${String(unit).padStart(4,'0')}/v1`;
 const names=fs.readdirSync(w+'/'+dir).filter(f=>/^\d{2}\.md$/.test(f)).sort();
 const parts=names.map(name=>{const ref=dir+'/'+name,raw=fs.readFileSync(w+'/'+ref);return {path:ref,sha256:sha(raw),han:(raw.toString('utf8').replace(/^ {0,3}#{1,6}[ \t].*(?:\r?\n|$)/gm,'').match(/\p{Script=Han}/gu)??[]).length};});
 const total=parts.reduce((s,p)=>s+p.han,0),minimum=unit===5?3500:5000;
 console.log(JSON.stringify({unit,revision:state.revision,parts,total_han:total,minimum},null,2));
 if(total<minimum)throw Error('Chapter under requested minimum; do not assemble');
 if(template.expected_revision!==state.revision)throw Error('Write-before template revision changed');
 for(const [ref,hash] of Object.entries(template.source_hashes))if(sha(fs.readFileSync(w+'/'+ref))!==hash)throw Error('Write-before source changed: '+ref);
 save(`.writer/drafts/v-ar-assemble-${unit}.json`,{unit,expected_revision:state.revision,draft:template.draft,parts:parts.map(({path,sha256})=>({path,sha256})),separator:'\n\n'});
}else if(mode==='record'){
 const payload=read(`.writer/drafts/v-ar-changes-${unit}.json`),report=`审查/V-A-恢复-000${unit}-完整章自检.md`;
 if(state.revision!==template.expected_revision)throw Error('Template revision changed');
 for(const [ref,hash] of Object.entries(template.source_hashes))if(sha(fs.readFileSync(w+'/'+ref))!==hash)throw Error('Write-before source changed: '+ref);
 save(`.writer/drafts/v-ar-record-${unit}-filled.json`,{...template,summary:payload.summary,changes:payload.changes,draft_review:{reviewer:'同一实际V-A恢复Codex执行代理；完整章知情自检',report,draft_sha256:sha(fs.readFileSync(w+'/'+template.draft)),report_sha256:sha(fs.readFileSync(w+'/'+report))}});
}else throw Error('Unknown mode');
