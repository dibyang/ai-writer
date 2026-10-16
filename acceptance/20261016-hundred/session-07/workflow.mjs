import fs from 'node:fs';
import {stage,project,runner,hash,write,cli} from './session.mjs';
const [action,n,title]=process.argv.slice(2);const unit=Number(n);const stem=String(unit).padStart(4,'0');
if(action==='timing')console.log(JSON.stringify({started:runner.last('status-initial').started_at,now:new Date().toISOString(),elapsed_minutes:Math.round((Date.now()-Date.parse(runner.last('status-initial').started_at))/60000)}));
if(action==='prepare'){
 const p=stage+'/plan-'+unit+'.json';cli('plan-'+unit,['plan','--input',p]);
 const c=cli('context-'+unit,['context','--unit',n,'--max-chars','120000']);write(stage+'/context-'+unit+'.json',c);
 const t=cli('template-'+unit,['record-template','--unit',n,'--draft','正文/'+stem+'-'+title+'.md']);write(stage+'/template-'+unit+'.json',t);write(stage+'/record-'+unit+'.json',t);
 const first=s=>s.split(/；(?:历史|保留|此前|截至)/)[0];
 const view={unit,revision:c.revision,characters:Object.fromEntries(Object.entries(c.snapshot.characters).map(([k,v])=>[k,first(v)])),outline:c.outline,selected:Object.fromEntries(Object.entries(c.continuity.author).map(([id,x])=>[id,{statement:x.statement,status:x.status,custody:x.custody,due_unit:x.due_unit}])),omitted_ids:c.continuity.recall.omitted_ids,source_hashes:c.source_hashes};
 write(stage+'/context-view-'+unit+'.json',view);console.log(JSON.stringify({context_view:view,template:t},null,2));
}
if(action==='register'){
 const t=JSON.parse(fs.readFileSync(stage+'/template-'+unit+'.json','utf8'));const input=JSON.parse(fs.readFileSync(stage+'/changes-'+unit+'.json','utf8'));const s=JSON.parse(fs.readFileSync(project+'/.writer/state.json','utf8')).snapshot;
 if(t.expected_revision!==JSON.parse(fs.readFileSync(project+'/.writer/state.json','utf8')).revision)throw Error('Revision changed before registration');
 t.summary=input.summary;t.changes=input.changes;
 for(const [k,v] of Object.entries(t.changes.characters??{})){if(s.characters[k])t.changes.characters[k]=v+'；保留的有效历史（以下均为原章时点，不作当前位置）：'+s.characters[k];}
 for(const [id,x] of Object.entries(t.changes.ledger??{})){for(const [name,v] of Object.entries(x.character_known??{})){const old=s.ledger[id]?.character_known?.[name];if(old)x.character_known[name]=v+'；历史有效信息（原章时点）：'+old;}}
 write(stage+'/record-'+unit+'.json',t);
 const r=cli('record-'+unit,['record','--input',stage+'/record-'+unit+'.json']);console.log(JSON.stringify(r,null,2));
 console.log(JSON.stringify(cli('check-'+unit,['check']),null,2));
}
if(action==='readmark'){
 const file=fs.readdirSync(project+'/正文').find(p=>p.startsWith(stem+'-'));const p=project+'/正文/'+file;
 fs.appendFileSync(stage+'/reading.jsonl',JSON.stringify({at:new Date().toISOString(),path:p,sha256:hash(p),range:'全文',purpose:title||'成稿完整实读自检',method:'模型实际完整阅读FastCtx输出，非哈希扫描'})+'\n');console.log(hash(p));
}
if(action==='read-window'){
 for(let i=unit-(Number(title)||6)+1;i<=unit;i++){const f=fs.readdirSync(project+'/正文').find(p=>p.startsWith(String(i).padStart(4,'0')+'-'));const p=project+'/正文/'+f;console.log('\nBEGIN '+p+' SHA256 '+hash(p)+'\n'+fs.readFileSync(p,'utf8')+'\nEND '+i);}
}
if(action==='review'){
 const from=unit-5;const report='审查/'+String(from).padStart(4,'0')+'-'+stem+'-会话07知情连读.md';const sources={};
 for(let i=from;i<=unit;i++){const f='正文/'+fs.readdirSync(project+'/正文').find(p=>p.startsWith(String(i).padStart(4,'0')+'-'));sources[f]=hash(project+'/'+f);fs.appendFileSync(stage+'/reading.jsonl',JSON.stringify({at:new Date().toISOString(),path:project+'/'+f,sha256:sources[f],range:'全文',purpose:from+'—'+unit+'六章连读，逐章实读/截断部分已补读',method:'模型实际读取正文输出，脚本仅绑定哈希'})+'\n');}
 fs.appendFileSync(project+'/'+report,'\n'+Object.entries(sources).map(([p,h])=>'- '+p+' | '+h).join('\n')+'\n');
 const input={from,to:unit,kind:'model-self-review',report,source_hashes:sources};write(stage+'/review-'+unit+'.json',input);
 console.log(JSON.stringify(cli('review-'+unit,['review','--input',stage+'/review-'+unit+'.json']),null,2));console.log(JSON.stringify(cli('check-review-'+unit,['check']),null,2));
}
if(action==='count'){
 const file=fs.readdirSync(project+'/正文').find(p=>p.startsWith(stem+'-'));const p=project+'/正文/'+file;const t=fs.readFileSync(p,'utf8').replace(/^#.*(?:\r?\n|$)/,'');const han=(t.match(/\p{Script=Han}/gu)||[]).length;
 console.log(JSON.stringify({unit,path:p,sha256:hash(p),han}));
}
