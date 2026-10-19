import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
const [phase,packageName]=process.argv.slice(2),base=import.meta.dirname;
assert.match(phase??'',/^[a-z][a-z0-9-]*$/);assert.match(packageName??'',/^package-0\.[78]\.\d+(?:-v2)?$/);
const raw=fs.readFileSync(path.join(base,phase,'events.jsonl'),'utf8'),events=raw.trim().split(/\r?\n/).map(JSON.parse),rows=[];
assert.equal(JSON.parse(fs.readFileSync(path.join(base,phase,'process-result.json'))).exit_code,0);
for(const ref of ['writer-project/SKILL.md','writer-novel/SKILL.md','writer-review/SKILL.md','writer-novel/references/story-development.md','writer-novel/references/scene-connections.md']){
  const file=path.resolve(base,'sources',packageName,'.agents/skills',ref),bytes=fs.readFileSync(file),lines=bytes.toString('utf8').split(/\r?\n/),total=lines.at(-1)===''?lines.length-1:lines.length,seen=new Set(),reads=[];
  for(const e of events){const i=e.item;if(e.type!=='item.completed'||i?.type!=='mcp_tool_call'||i.server!=='fastctx'||i.tool!=='read'||typeof i.arguments?.file_path!=='string'||path.resolve(i.arguments.file_path).toLowerCase()!==file.toLowerCase())continue;let matches=0;for(const c of i.result?.content??[])if(c.type==='text')for(const line of c.text.split(/\r?\n/)){const m=line.match(/^(\d+)\t(.*)$/);if(m&&lines[Number(m[1])-1]===m[2]){seen.add(Number(m[1]));matches++;}}if(matches)reads.push({event_id:i.id,matching_lines:matches});}
  const missing=[];for(let n=1;n<=total;n++)if(!seen.has(n))missing.push(n);assert.equal(missing.length,0,ref+' missing lines '+missing.join(','));rows.push({file,sha256:crypto.createHash('sha256').update(bytes).digest('hex'),total_lines:total,reads,complete_line_exposure:true});
}
const result={ok:true,phase,package:packageName,rows,basis:'Exact current numbered lines exposed in completed FastCtx tool results; proves exposure, not comprehension, human independence or literary quality.'};
fs.writeFileSync(path.join(base,phase,'resource-reading-verification.json'),JSON.stringify(result,null,2)+'\n',{flag:'wx'});console.log(JSON.stringify({ok:true,phase,files:rows.length}));
