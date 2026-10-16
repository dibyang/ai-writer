import {readFileSync,writeFileSync,existsSync,readdirSync,copyFileSync,mkdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
export const base='acceptance/20261016-expanded/session-d';
export const project='acceptance/20261016-expanded/works/潮汐信号';
export const hash=p=>createHash('sha256').update(readFileSync(p)).digest('hex');
export const read=p=>JSON.parse(readFileSync(p,'utf8'));
export const save=(p,v)=>writeFileSync(p,JSON.stringify(v,null,2)+'\n','utf8');
export const state=()=>read(project+'/.writer/state.json');
export const metrics=()=>state().units.map(u=>{const t=readFileSync(project+'/'+u.draft,'utf8');return {unit:u.unit,draft:u.draft,sha256:hash(project+'/'+u.draft),han:(t.replace(/^#.*(?:\r?\n|$)/,'').match(/\p{Script=Han}/gu)||[]).length};});
const action=process.argv[2];
if(action==='baseline'){
 copyFileSync(project+'/.writer/state.json',base+'/recovery-state-r26.json');
 const refs=['writer.json','.writer/state.json','设定/作品定位.md','设定/文风.md','设定/权威规则.md','设定/角色卡.md','大纲/全书大纲.md',...readdirSync(project+'/大纲/分卷').map(f=>'大纲/分卷/'+f),...state().units.flatMap(u=>[u.draft,`大纲/单元/${String(u.unit).padStart(4,'0')}.json`]),'审查/revision-a-0001-0012-全稿知情复核-r26.md'];
 save(base+'/recovery-sources.json',{created:new Date().toISOString(),revision:state().revision,files:Object.fromEntries(refs.map(r=>[r,hash(project+'/'+r)]))});
 save(base+'/initial-metrics.json',metrics());
}
if(action==='template'){
 const n=process.argv[3];const raw=read(base+`/cli/u${n}-template.stdout`);const t=raw.template??raw;
 save(base+`/u${n}-record-template.json`,t);save(base+`/u${n}-record.json`,t);
 console.log(JSON.stringify(raw,null,2));
}
if(action==='metrics') console.log(JSON.stringify(metrics(),null,2));
if(action==='prepare-record'){
 const n=Number(process.argv[3]);const t=read(base+`/u${n}-record-template.json`);const c=read(base+`/u${n}-changes.json`);
 const text=readFileSync(project+'/'+t.draft,'utf8');const han=(text.replace(/^#.*(?:\r?\n|$)/,'').match(/\p{Script=Han}/gu)||[]).length;
 if(han<1500||han>2000)throw Error('Han out of range: '+han);
 for(const [id,e] of Object.entries(c.changes.ledger??{})) for(const ev of e.evidence??[]) if(ev.unit===n&&!text.includes(ev.quote))throw Error('missing quote '+id+': '+ev.quote);
 delete t._instructions;Object.assign(t,c);save(base+`/u${n}-record.json`,t);
 console.log(JSON.stringify({unit:n,han,expected_revision:t.expected_revision,source_count:Object.keys(t.source_hashes).length,draft_sha256:hash(project+'/'+t.draft)}));
}
if(action==='context-info'){
 const n=process.argv[3];const c=read(base+`/cli/u${n}-context.stdout`);
 console.log(JSON.stringify({revision:c.revision,recall:c.continuity?.recall,snapshot:c.snapshot,keys:Object.keys(c)},null,2));
}
if(action==='review-input'){
 const from=Number(process.argv[3]),to=Number(process.argv[4]),name=process.argv[5];
 const us=state().units.filter(u=>u.unit>=from&&u.unit<=to);const report='审查/'+name+'.md';
 const hs=Object.fromEntries(us.map(u=>[u.draft,hash(project+'/'+u.draft)]));
 for(const u of us)if(hs[u.draft]!==u.sha256)throw Error('draft drift');
 let t=readFileSync(project+'/'+report,'utf8');
 t+='|单元/正文文件|SHA-256|\n|---|---|\n'+us.map(u=>`|${u.unit} ${u.draft}|${hs[u.draft]}|`).join('\n')+'\n';
 writeFileSync(project+'/'+report,t,'utf8');
 save(base+'/'+name+'-review.json',{from,to,kind:'model-self-review',report,source_hashes:hs});
 console.log(JSON.stringify({from,to,revision:state().revision,report,source_hashes:hs},null,2));
}
