import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
const stage='acceptance/20261016-hundred/session-06',project='acceptance/20261016-hundred/works/潮汐信号',to=Number(process.argv[2]),from=to-5;
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const sources=Object.fromEntries(Array.from({length:6},(_,i)=>{const n=from+i,filename=fs.readdirSync(path.join(project,'正文')).find(f=>f.startsWith(String(n).padStart(4,'0')+'-'));if(!filename)throw Error(`Missing unit ${n}`);const p='正文/'+filename,b=fs.readFileSync(path.join(project,p));return [p,sha(b)];}));
const report=`审查/${String(from).padStart(4,'0')}-${String(to).padStart(4,'0')}-知情连读-session06.md`;
const recovery=JSON.parse(fs.readFileSync(path.join(stage,'recovery-sources.json'),'utf8'));
const old=recovery.sources.filter(x=>/^正文\/00(24|26|31|32|33|35|36|42|48)-/.test(x.path));
if(to===60){const e=JSON.parse(fs.readFileSync(path.join(stage,'read-40.json'),'utf8'))[0];old.push({...e,sha256:sha(fs.readFileSync(path.join(project,e.path)))});}
const body=fs.readFileSync(path.join(stage,`review-body-${to}.md`),'utf8');
fs.mkdirSync(path.join(project,'审查'),{recursive:true});
fs.writeFileSync(path.join(project,report),body+'\n\n## 本窗口全文与哈希\n\n'+Object.entries(sources).map(([p,h])=>`- ${p}；全文；SHA-256 ${h}`).join('\n')+'\n\n## 旧证据全文回查\n\n'+old.map(e=>`- ${e.path}；全文；SHA-256 ${e.sha256}；${e.purpose}`).join('\n')+'\n',{flag:'wx'});
fs.writeFileSync(path.join(stage,`review-${to}.json`),JSON.stringify({from,to,kind:'model-self-review',report,source_hashes:sources},null,2)+'\n',{flag:'wx'});
for(const [p,h] of Object.entries(sources))fs.appendFileSync(path.join(stage,'reading.jsonl'),JSON.stringify({at:new Date().toISOString(),path:path.resolve(project,p),sha256:h,range:'全文',purpose:`第${to}章后${from}—${to}六章连读`,method:'FastCtx read按顺序完整输出后确认',full_text_read:true})+'\n');
console.log(JSON.stringify({from,to,report,source_hashes:sources},null,2));
