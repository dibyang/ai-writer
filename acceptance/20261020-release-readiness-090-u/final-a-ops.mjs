import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';import assert from 'node:assert/strict';
const U='D:/work/other/ai-writer/acceptance/20261020-release-readiness-090-u',W=U+'/scenario-final/东岸末班船';
const read=f=>JSON.parse(fs.readFileSync(f,'utf8')),sha=b=>crypto.createHash('sha256').update(b).digest('hex'),put=(f,v)=>fs.writeFileSync(f,JSON.stringify(v,null,2)+'\n',{flag:'wx'});
const [mode,arg]=process.argv.slice(2),state=()=>read(W+'/.writer/state.json');
const partInfo=ref=>{const b=fs.readFileSync(W+'/'+ref),t=b.toString('utf8'),body=t.replace(/^#{1,6}\s+.*(?:\r?\n|$)/gmu,'');return {path:ref,sha256:sha(b),bytes:b.length,body_han:[...body.matchAll(/\p{Script=Han}/gu)].length};};
function tree(dir){if(!fs.existsSync(dir))return {exists:false,files:[]};const files=[];function walk(d){for(const e of fs.readdirSync(d,{withFileTypes:true}).sort((a,b)=>a.name.localeCompare(b.name))){const f=path.join(d,e.name);assert.ok(!e.isSymbolicLink());if(e.isDirectory())walk(f);else files.push({path:path.relative(dir,f).replaceAll('\\','/'),sha256:sha(fs.readFileSync(f))});}}walk(dir);return {exists:true,files};}
if(mode==='resume'){
 const baseline=read(U+'/final-a-before/manifest.json'),parts=read(U+'/final-a-parts-verified/manifest.json');
 assert.equal(state().revision,3);for(const s of baseline.sources)assert.equal(sha(fs.readFileSync(W+'/'+s.ref)),s.sha256);
 for(const p of parts.parts)assert.equal(sha(fs.readFileSync(W+'/'+p.ref)),p.sha256);
 const t=read(W+'/.writer/drafts/final-record-1-before.json');assert.equal(t.expected_revision,3);for(const [ref,h]of Object.entries(t.source_hashes))assert.equal(sha(fs.readFileSync(W+'/'+ref)),h);
 const id=read(U+'/final-commands/final-a-32-identify-resume/stdout.raw.txt'),v=read(U+'/zip-delivery-verification.json');assert.equal(id.observed_content_id,v.content_id);assert.equal(v.content_id,'ff6cde0f1be3459f7d8a4249e3dd8ee3eec39d468df48f9c2f11308e5bd6641b');
 put(U+'/final-a-resume-verification.json',{ok:true,revision:3,content_id:v.content_id,original_sources_checked:baseline.sources.length,template_valid:true,parts:parts.parts,prompt_sha256:sha(fs.readFileSync(U+'/final-a-resume-prompt.md')),authorization_note:'Current user explicitly authorizes resumed chapters 1-2. Prior process stop was met. Retain old workflow and original template at revision 3; no source or hash refresh.'});
 console.log('Verified original sources, original two parts, revision 3, template and ZIP identity.');
}else if(mode==='assemble-input'){
 const unit=Number(arg),folder='分段/'+String(unit).padStart(4,'0')+'/v1',parts=fs.readdirSync(W+'/'+folder).filter(n=>/^[0-9]{2}\.md$/.test(n)).sort().map(n=>partInfo(folder+'/'+n));
 const draft=unit===1?'正文/0001-灯下的箱子.md':'正文/0002-多跑的一趟.md';
 const input={unit,expected_revision:state().revision,draft,parts:parts.map(p=>({path:p.path,sha256:p.sha256})),separator:'\n\n'};
 put(W+'/.writer/drafts/final-a-assemble-'+unit+'.json',input);console.log(JSON.stringify({input,parts,total_body_han:parts.reduce((n,p)=>n+p.body_han,0)},null,2));
}else if(mode==='verify-assembly'){
 const unit=Number(arg),input=read(W+'/.writer/drafts/final-a-assemble-'+unit+'.json'),raw=fs.readFileSync(W+'/'+input.draft),expected=Buffer.concat(input.parts.flatMap((p,i)=>i?[Buffer.from(input.separator),fs.readFileSync(W+'/'+p.path)]:[fs.readFileSync(W+'/'+p.path)]));
 assert.ok(raw.equals(expected));for(const p of input.parts)assert.equal(partInfo(p.path).sha256,p.sha256);
 const info=partInfo(input.draft);assert.ok(info.body_han>=(unit===1?5000:3500));
 put(U+'/final-a-assembly-'+unit+'-verification.json',{ok:true,unit,...info,parts:input.parts,exact_byte_join:true,state_revision:state().revision});console.log(JSON.stringify({ok:true,unit,...info,exact_byte_join:true},null,2));
}else if(mode==='guard-snapshot'){
 const snapshot={state_sha256:sha(fs.readFileSync(W+'/.writer/state.json')),journal:tree(W+'/.writer/journal'),objects:tree(W+'/.writer/objects'),whole_writer:tree(W+'/.writer')};
 put(U+'/final-a-guard-'+arg+'.json',snapshot);if(arg!=='before'){const before=read(U+'/final-a-guard-before.json');assert.deepEqual(snapshot,before);}
 console.log(JSON.stringify({ok:true,stage:arg,state_sha256:snapshot.state_sha256,objects:snapshot.objects.files.length,journal:snapshot.journal.files.length,whole_writer_files:snapshot.whole_writer.files.length,unchanged:arg!=='before'}));
}else if(mode==='fill-record'){
 const unit=Number(arg),template=read(W+'/.writer/drafts/'+(unit===1?'final-record-1-before.json':'final-a-record-2-before.json')),semantic=read(W+'/.writer/drafts/final-a-content-'+unit+'.json');
 assert.equal(template.expected_revision,state().revision);for(const [ref,h]of Object.entries(template.source_hashes))assert.equal(sha(fs.readFileSync(W+'/'+ref)),h);
 const input={...template,...semantic};delete input._instructions;delete input.output;
 const report='审查/final-a-000'+unit+'-完整章自检.md';input.draft_review={reviewer:'本次原生Codex执行代理；知情自检',report,draft_sha256:sha(fs.readFileSync(W+'/'+input.draft)),report_sha256:sha(fs.readFileSync(W+'/'+report))};
 put(W+'/.writer/drafts/final-a-record-'+unit+'-valid.json',input);console.log(JSON.stringify({ok:true,unit,expected_revision:input.expected_revision,draft_review:input.draft_review}));
}else throw Error('Unknown operation');
