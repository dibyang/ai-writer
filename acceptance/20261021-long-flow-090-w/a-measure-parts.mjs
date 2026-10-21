import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
const W=path.dirname(fileURLToPath(import.meta.url)),P=path.join(W,'scenario/东岸末班船-规模验证');
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const name=process.argv[2];if(!/^a-[a-z0-9-]+\.json$/.test(name??''))throw Error('Unique W output filename required');
const parts=[];
for(const n of ['01','02']){const rel='分段/0013/v1/'+n+'.md',f=path.join(P,rel);if(!fs.existsSync(f))continue;const raw=fs.readFileSync(f),text=raw.toString('utf8'),body=text.split(/\r?\n/).filter(line=>!/^\s*#{1,6}\s/.test(line)).join('\n');parts.push({path:rel,sha256:sha(raw),bytes:raw.length,lines:text.split('\n').length,body_han_characters:(body.match(/\p{Script=Han}/gu)??[]).length,body_non_whitespace_characters:[...body.replace(/\s/g,'')].length,headings:text.split(/\r?\n/).filter(line=>/^\s*#{1,6}\s/.test(line))});}
const report={measured_at:new Date().toISOString(),method:'Unicode Script=Han; remove Markdown heading lines; exclude punctuation, digits, Latin, whitespace. Counts do not judge literary substance.',parts,total_body_han:parts.reduce((s,p)=>s+p.body_han_characters,0)};
fs.writeFileSync(path.join(W,name),JSON.stringify(report,null,2)+'\n',{flag:'wx'});console.log(JSON.stringify(report,null,2));
