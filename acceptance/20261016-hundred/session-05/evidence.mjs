import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';
const stage='acceptance/20261016-hundred/session-05',project='acceptance/20261016-hundred/works/潮汐信号';
const hash=f=>crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');
const [op,...args]=process.argv.slice(2);
if(op==='recovery'){
 const rows=fs.readFileSync(stage+'/reading.jsonl','utf8').trim().split(/\r?\n/).map(JSON.parse).filter(r=>r.purpose==='recovery');
 const initial=JSON.parse(fs.readFileSync(stage+'/template-49.json','utf8')).source_hashes['.writer/state.json'];
 const text='\n## 恢复来源SHA-256\n\n|全文读取文件|SHA-256|范围|\n|---|---|---|\n'+rows.map(r=>`|${path.relative(project,r.path).replaceAll('\\','/')}|${r.sha256}|${r.range}|`).join('\n')+'\n\n第49章写前revision 147 state SHA-256（来自已冻结写前模板，仅哈希，不冒充全文读取）：'+initial+'\n';
 if(fs.readFileSync(stage+'/recovery.md','utf8').includes('## 恢复来源SHA-256'))throw Error('Already appended');fs.appendFileSync(stage+'/recovery.md',text);console.log(JSON.stringify({sources:rows.length,initial_state_sha256:initial}));
}else if(op==='snapshot-draft'){
 const [rel]=args;const dir=stage+'/pre-selfcheck';fs.mkdirSync(dir,{recursive:true});const dest=dir+'/'+path.basename(rel);fs.copyFileSync(path.join(project,rel),dest,fs.constants.COPYFILE_EXCL);console.log(JSON.stringify({source:rel,destination:dest,sha256:hash(dest),reason:'Before chapter54 pre-registration time correction'}));
}else if(op==='review-input'){
 const [from,to,report]=args;const sources={};
 for(const file of fs.readdirSync(project+'/正文')){const n=Number(file.slice(0,4));if(n>=Number(from)&&n<=Number(to)&&file.endsWith('.md'))sources['正文/'+file]=hash(project+'/正文/'+file);}
 if(Object.keys(sources).length!==Number(to)-Number(from)+1)throw Error('Incomplete source range');
 const reportPath=path.join(project,report);if(fs.readFileSync(reportPath,'utf8').includes('## 本报告绑定哈希'))throw Error('Report hashes already appended');
 fs.appendFileSync(reportPath,'\n## 本报告绑定哈希\n\n|正文路径|SHA-256|\n|---|---|\n'+Object.entries(sources).map(([f,h])=>`|${f}|${h}|`).join('\n')+'\n');
 const input={from:Number(from),to:Number(to),kind:'model-self-review',report,source_hashes:sources};fs.writeFileSync(stage+'/review-'+to+'.json',JSON.stringify(input,null,2)+'\n');console.log(JSON.stringify(input,null,2));
}else throw Error('Unknown operation');
