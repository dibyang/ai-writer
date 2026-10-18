import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
const base=path.dirname(fileURLToPath(import.meta.url)),dir=path.join(base,'reading-audit'),sha=b=>crypto.createHash('sha256').update(b).digest('hex'),results=[];
for(const name of fs.readdirSync(dir).filter(n=>n.endsWith('.json')).sort()){
 const proof=JSON.parse(fs.readFileSync(path.join(dir,name)));if(!Array.isArray(proof.rows)||!proof.phase)continue;assert.equal(proof.ok,true,name);assert.ok(/^[a-z][a-z0-9-]*$/.test(proof.phase));
 const events=fs.readFileSync(path.join(base,proof.phase,'events.jsonl'),'utf8').split(/\r?\n/).filter(Boolean).map(JSON.parse);
 for(const row of proof.rows){assert.ok(/^[a-f0-9]{64}$/.test(row.sha256));const bytes=fs.readFileSync(path.join(dir,'versions',row.sha256+'.md'));assert.equal(sha(bytes),row.sha256);const lines=bytes.toString('utf8').replace(/^\uFEFF/,'').split(/\r?\n/),covered=new Set();
   for(const event of events){const item=event.item;if(event.type!=='item.completed'||item?.type!=='mcp_tool_call'||item.server!=='fastctx'||item.tool!=='read'||typeof item.arguments?.file_path!=='string'||path.resolve(item.arguments.file_path).toLowerCase()!==path.resolve(row.target).toLowerCase())continue;
     for(const block of item.result?.content??[]){if(block.type!=='text')continue;for(const text of block.text.split(/\r?\n/)){const match=text.match(/^(\d+)\t(.*)$/);if(match&&lines[Number(match[1])-1]===match[2])covered.add(Number(match[1]));}}
   }
   for(let n=1;n<=lines.length;n++){if(n===lines.length&&lines[n-1]==='')continue;assert.ok(covered.has(n),`${name} unit${row.unit} line${n}`);}
 }
 results.push({phase:proof.phase,from:proof.from,to:proof.to,units:proof.rows.length,characters:proof.characters,exact_saved_versions_verified:true});
}
assert.ok(results.length>0);const oldUnits=new Set();for(const r of results)if(['read-a-update','read-b','read-c','read-d'].includes(r.phase))for(let n=r.from;n<=r.to;n++)oldUnits.add(n);
console.log(JSON.stringify({ok:true,proof_files:results.length,total_unit_exposures:results.reduce((n,r)=>n+r.units,0),baseline_unique_units:oldUnits.size,results,basis:'Read-only replay against immutable saved body versions and actual Codex MCP read text. It does not turn historical reading into current literary review or prove comprehension.'},null,2));
