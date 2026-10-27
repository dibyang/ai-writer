import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
const base=path.dirname(fileURLToPath(import.meta.url)),repo=path.resolve(base,'../..'),prior=path.join(repo,'acceptance/20261019-hundred-h'),source=path.join(prior,'work'),target=path.join(base,'work');
const digest=b=>crypto.createHash('sha256').update(b).digest('hex'),manifestBytes=fs.readFileSync(path.join(prior,'evidence-manifest.json')),manifest=JSON.parse(manifestBytes),rows=manifest.files.filter(r=>r.file.startsWith('work/'));
if(fs.existsSync(target))throw Error('Target already exists; retain prior candidate');
fs.mkdirSync(target,{recursive:true});let count=0,bytes=0;
for(const row of rows){const rel=row.file.slice(5),src=path.join(source,rel),dst=path.join(target,rel),body=fs.readFileSync(src);if(body.length!==row.bytes||digest(body)!==row.sha256)throw Error('Prior seal differs: '+rel);fs.mkdirSync(path.dirname(dst),{recursive:true});fs.writeFileSync(dst,body,{flag:'wx'});if(digest(fs.readFileSync(dst))!==row.sha256)throw Error('Copy differs: '+rel);count++;bytes+=body.length;if(count%500===0)fs.writeFileSync(path.join(base,'bootstrap-progress.json'),JSON.stringify({count,total:rows.length,bytes,at:new Date().toISOString()},null,2));}
const s=JSON.parse(fs.readFileSync(path.join(target,'.writer/state.json'))),auth='继续通过 Codex 扩大 0.10.0 的长篇实跑到百章规模，重点验证分卷迁移、多轮跨会话恢复、旧章修订后的连续性和不复制正文的工具更新，发现问题直接修复，保留完整验证记录，暂不修改现有作品，不提交、不推送。';
fs.writeFileSync(path.join(target,'研究/AJ轮真实任务授权.md'),auth+'\n',{flag:'wx'});
const result={ok:true,source,copy:target,source_manifest_sha256:digest(manifestBytes),files_copied:count,bytes_copied:bytes,schema:s.schema_version,revision:s.revision,units:s.units.length,tool_version:s.tool_control.installed.version,generation:s.tool_control.generation,authorization_quote:auth,note:'Explicitly copied prior synthetic validation work to a new independent fixture. The no-body-copy requirement applies to the subsequent tool update, not this baseline setup.'};
fs.writeFileSync(path.join(base,'bootstrap-verification.json'),JSON.stringify(result,null,2)+'\n',{flag:'wx'});console.log(JSON.stringify(result));
