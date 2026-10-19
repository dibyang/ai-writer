import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
const base=path.dirname(fileURLToPath(import.meta.url));
const repos=['LiPu-jpg/Openwrite','leenbj/novel-creator-skill','MaoXiaoYuZ/Long-Novel-GPT'];
async function get(url){const r=await fetch(url,{signal:AbortSignal.timeout(45000)});if(!r.ok)throw Error(`${r.status} ${url}`);return r.json();}
for(const repo of repos){
 const dir=path.join(base,'references',repo.split('/')[1]);fs.mkdirSync(dir,{recursive:true});
 const meta=await get(`https://api.github.com/repos/${repo}`),branches=repo==='LiPu-jpg/Openwrite'?[meta.default_branch,'native-core']:[meta.default_branch];
 for(const branch of branches){
  const commit=await get(`https://api.github.com/repos/${repo}/commits/${encodeURIComponent(branch)}`),sha=commit.sha,tree=await get(`https://api.github.com/repos/${repo}/git/trees/${sha}?recursive=1`);
  if(tree.truncated)throw Error('tree truncated');const sub=path.join(dir,branch);fs.mkdirSync(sub,{recursive:true});
  const index={repo,branch,commit:sha,at:new Date().toISOString(),license:meta.license,tree:tree.tree};fs.writeFileSync(path.join(sub,'inventory.json'),JSON.stringify(index,null,2)+'\n',{flag:'wx'});
  const files=tree.tree.filter(x=>x.type==='blob'&&/^(README[^/]*|LICENSE[^/]*|COPYING[^/]*|THIRD_PARTY_NOTICES[^/]*)$/i.test(x.path));
  const saved=[];
  for(const row of files){const r=await fetch(`https://raw.githubusercontent.com/${repo}/${sha}/${row.path}`,{signal:AbortSignal.timeout(45000)});if(!r.ok)throw Error(`${r.status} ${row.path}`);const bytes=Buffer.from(await r.arrayBuffer());fs.writeFileSync(path.join(sub,row.path),bytes,{flag:'wx'});saved.push({file:row.path,sha256:crypto.createHash('sha256').update(bytes).digest('hex'),bytes:bytes.length});}
  fs.writeFileSync(path.join(sub,'selected-files.json'),JSON.stringify(saved,null,2)+'\n',{flag:'wx'});console.log(JSON.stringify({repo,branch,sha,license:meta.license?.spdx_id,files:tree.tree.length,saved:saved.map(x=>x.file)}));
 }
}
