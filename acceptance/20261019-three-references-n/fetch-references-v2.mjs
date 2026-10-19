import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';import {fileURLToPath} from 'node:url';
const base=path.dirname(fileURLToPath(import.meta.url)),repos=['LiPu-jpg/Openwrite','leenbj/novel-creator-skill','MaoXiaoYuZ/Long-Novel-GPT'];
async function request(url){for(let i=0;i<3;i++){try{const r=await fetch(url,{signal:AbortSignal.timeout(15000)});if(!r.ok)throw Error(`${r.status} ${url}`);return r;}catch(e){fs.appendFileSync(path.join(base,'fetch-errors.jsonl'),JSON.stringify({at:new Date().toISOString(),url,attempt:i+1,error:e.message,cause:e.cause?.code})+'\n');if(i===2)throw e;await new Promise(r=>setTimeout(r,1000*(i+1)));}}}
async function get(url){return (await request(url)).json();}
for(const repo of repos){const dir=path.join(base,'references',repo.split('/')[1]);fs.mkdirSync(dir,{recursive:true});const meta=await get(`https://api.github.com/repos/${repo}`);
 for(const branch of repo==='LiPu-jpg/Openwrite'?[meta.default_branch,'native-core']:[meta.default_branch]){
  const sub=path.join(dir,branch);fs.mkdirSync(sub,{recursive:true});const inv=path.join(sub,'inventory.json');let index;
  if(fs.existsSync(inv))index=JSON.parse(fs.readFileSync(inv));else{const commit=await get(`https://api.github.com/repos/${repo}/commits/${encodeURIComponent(branch)}`),tree=await get(`https://api.github.com/repos/${repo}/git/trees/${commit.sha}?recursive=1`);if(tree.truncated)throw Error('truncated tree');index={repo,branch,commit:commit.sha,at:new Date().toISOString(),license:meta.license,tree:tree.tree};fs.writeFileSync(inv,JSON.stringify(index,null,2)+'\n',{flag:'wx'});}
  const files=index.tree.filter(x=>x.type==='blob'&&/^(README[^/]*|LICENSE[^/]*|COPYING[^/]*|THIRD_PARTY_NOTICES[^/]*)$/i.test(x.path)),saved=[];
  for(const row of files){const dest=path.join(sub,row.path);if(!fs.existsSync(dest)){const r=await get(`https://api.github.com/repos/${repo}/contents/${encodeURIComponent(row.path)}?ref=${index.commit}`);if(r.encoding!=='base64')throw Error('expected base64');fs.writeFileSync(dest,Buffer.from(r.content,'base64'),{flag:'wx'});}const bytes=fs.readFileSync(dest);saved.push({file:row.path,sha256:crypto.createHash('sha256').update(bytes).digest('hex'),bytes:bytes.length});}
  const selected=path.join(sub,'selected-files.json');if(!fs.existsSync(selected))fs.writeFileSync(selected,JSON.stringify(saved,null,2)+'\n',{flag:'wx'});console.log(JSON.stringify({repo,branch,sha:index.commit,license:index.license?.spdx_id,files:index.tree.length,saved:saved.map(x=>x.file)}));
 }
}
