import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const here=path.dirname(fileURLToPath(import.meta.url));
const [a,b,out]=process.argv.slice(2),read=n=>JSON.parse(fs.readFileSync(path.join(here,n+'.json')));
const x=read(a),y=read(b),diff=[];
function walk(p,u,v){if(JSON.stringify(u)===JSON.stringify(v))return;if(u&&v&&typeof u==='object'&&typeof v==='object'&&!Array.isArray(u)&&!Array.isArray(v)){for(const k of new Set([...Object.keys(u),...Object.keys(v)]))walk([...p,k],u[k],v[k]);}else diff.push({at:p.join('.'),before:u,after:v});}
walk(['snapshot'],x.main_snapshot,y.main_snapshot);
const result={from:a,to:b,revisions:[x.main_revision,y.main_revision],chapter1_record_equal:JSON.stringify(x.main_units[0])===JSON.stringify(y.main_units[0]),text_changes:y.texts.filter((t,i)=>t.main_sha256!==x.texts[i].main_sha256),snapshot_diffs:diff,retained_changes:y.retained.filter(t=>x.retained.find(z=>z.path===t.path)?.sha256!==t.sha256),unit_summaries:y.main_units.map((u,i)=>({unit:u.unit,changed:u.summary!==x.main_units[i]?.summary,before:x.main_units[i]?.summary,after:u.summary})).filter(u=>u.changed),units_equal:JSON.stringify(x.main_units)===JSON.stringify(y.main_units),snapshot_equal:JSON.stringify(x.main_snapshot)===JSON.stringify(y.main_snapshot)};
fs.writeFileSync(path.join(here,out+'.json'),JSON.stringify(result,null,2)+'\n',{flag:'wx'});console.log(JSON.stringify(result,null,2));
