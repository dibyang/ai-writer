import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
const base=path.dirname(fileURLToPath(import.meta.url)),[phase,fromText,toText,targetArg]=process.argv.slice(2),from=Number(fromText),to=Number(toText),target=path.resolve(targetArg??path.join(base,'work'));
assert.ok(/^[a-z][a-z0-9-]*$/.test(phase??'')&&Number.isSafeInteger(from)&&from>=1&&to>=from);
const json=f=>JSON.parse(fs.readFileSync(f)),sha=b=>crypto.createHash('sha256').update(b).digest('hex'),events=fs.readFileSync(path.join(base,phase,'events.jsonl'),'utf8').split(/\r?\n/).filter(Boolean).map(JSON.parse);
const mainState=json(path.join(base,'work/.writer/state.json')),rows=[];
for(let unit=from;unit<=to;unit++){
 const old=mainState.units.find(u=>u.unit===unit);assert.ok(old,'Unit not registered in main '+unit);const absolute=path.resolve(target,old.draft),bytes=fs.readFileSync(absolute),lines=bytes.toString('utf8').replace(/^\uFEFF/,'').split(/\r?\n/),covered=new Set(),reads=[],mismatches=[];
 for(const event of events){const item=event.item;if(event.type!=='item.completed'||item?.type!=='mcp_tool_call'||item.server!=='fastctx'||item.tool!=='read'||typeof item.arguments?.file_path!=='string'||path.resolve(item.arguments.file_path).toLowerCase()!==absolute.toLowerCase())continue;
   const texts=(item.result?.content??[]).filter(x=>x.type==='text').map(x=>x.text),matched=[];for(const text of texts)for(const row of text.split(/\r?\n/)){const match=row.match(/^(\d+)\t(.*)$/);if(!match)continue;const n=Number(match[1]);if(lines[n-1]===match[2]){covered.add(n);matched.push(n);}else mismatches.push({event_id:item.id,line:n,reason:'Displayed line differs from this exact body version; not counted'});}
   reads.push({event_id:item.id,arguments:item.arguments,matching_lines:matched.length,first:matched[0]??null,last:matched.at(-1)??null});
 }
 const missing=[];for(let n=1;n<=lines.length;n++){// FastCtx need not emit a final zero-width logical line after a trailing LF.
   if(n===lines.length&&lines[n-1]==='')continue;if(!covered.has(n))missing.push(n);
 }
 const digest=sha(bytes),dest=path.join(base,'reading-audit/versions',digest+'.md');fs.mkdirSync(path.dirname(dest),{recursive:true});if(fs.existsSync(dest))assert.equal(sha(fs.readFileSync(dest)),digest);else fs.writeFileSync(dest,bytes,{flag:'wx'});
 rows.push({unit,draft:old.draft,target:absolute,sha256:digest,bytes:bytes.length,characters:bytes.toString('utf8').length,logical_lines:lines.length,full_matching_line_coverage:missing.length===0,missing_lines:missing,reads,mismatches});
}
const result={ok:rows.every(r=>r.full_matching_line_coverage),phase,from,to,target,units:rows.length,characters:rows.reduce((n,r)=>n+r.characters,0),rows,basis:'Exact displayed FastCtx lines in actual completed Codex MCP read events, compared to a preserved body version. Coverage proves exposure of text, not comprehension or literary quality.'};
const dest=path.join(base,'reading-audit',phase+'.json');fs.writeFileSync(dest,JSON.stringify(result,null,2)+'\n',{flag:'wx'});console.log(JSON.stringify({ok:result.ok,phase,units:rows.length,characters:result.characters,incomplete:rows.filter(r=>!r.full_matching_line_coverage).map(r=>({unit:r.unit,missing:r.missing_lines}))}));if(!result.ok)process.exitCode=1;
