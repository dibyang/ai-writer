import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
const base=path.dirname(fileURLToPath(import.meta.url)),root=path.join(base,'work');
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const write=(p,v)=>fs.writeFileSync(path.join(root,p),JSON.stringify(v,null,2)+'\n',{flag:'wx'});
const read=p=>fs.readFileSync(path.join(root,p));
const [op,n,label]=process.argv.slice(2),unit=Number(n);
if(op==='part-length'){
 const rows=[1,2,3].map(i=>{const p=`分段/AL-b-${String(unit).padStart(4,'0')}/0${i}.md`;const s=read(p).toString('utf8').replace(/^#.*\n\s*\n/,'');return {part:i,han:(s.match(/\p{Script=Han}/gu)||[]).length};});console.log(JSON.stringify({unit,parts:rows,total_han:rows.reduce((a,b)=>a+b.han,0)}));
}else if(op==='template'){
 const b=fs.readFileSync(path.join(base,'commands',label,'stdout.raw.txt'));
 JSON.parse(b);fs.writeFileSync(path.join(root,`研究/AL-b-record${unit}-template.json`),b,{flag:'wx'});
 console.log(JSON.stringify({saved:unit,sha256:sha(b)}));
}else if(op==='assemble-input'){
 const t=JSON.parse(read(`研究/AL-b-record${unit}-template.json`));
 const parts=[1,2,3].map(i=>{const p=`分段/AL-b-${String(unit).padStart(4,'0')}/0${i}.md`;return {path:p,sha256:sha(read(p))};});
 write(`研究/AL-b-assemble${unit}${label?'-'+label:''}.json`,{unit,expected_revision:t.expected_revision,draft:t.draft,parts,separator:'\n\n'});
 console.log(JSON.stringify({unit,parts,template_keys:Object.keys(t)}));
}else if(op==='preserve-assembly'){
 const t=JSON.parse(read(`研究/AL-b-record${unit}-template.json`));
 const from=path.resolve(root,t.draft),to=path.resolve(root,`分段/AL-b-${String(unit).padStart(4,'0')}/assembled-before-reread.md`);
 if(!from.startsWith(root+path.sep)||!to.startsWith(root+path.sep)||fs.existsSync(to))throw Error('Unsafe preservation');
 fs.renameSync(from,to);console.log(JSON.stringify({preserved:path.relative(root,to),sha256:sha(fs.readFileSync(to))}));
}else if(op==='metrics'){
 const t=JSON.parse(read(`研究/AL-b-record${unit}-template.json`)),b=read(t.draft),s=b.toString('utf8'),body=s.replace(/^#.*\r?\n\s*\n/,'');
 const parts=[1,2,3].map(i=>read(`分段/AL-b-${String(unit).padStart(4,'0')}/0${i}.md`));
 const a=Buffer.from(parts.map(x=>x.toString('utf8')).join('\n\n'));
 const result={unit,draft:t.draft,han:(body.match(/\p{Script=Han}/gu)||[]).length,codepoints:[...body].length,sha256:sha(b),parts_match:a.equals(b),parts:parts.map((x,i)=>({part:i+1,han:(x.toString('utf8').replace(/^#.*\n\s*\n/,'').match(/\p{Script=Han}/gu)||[]).length,sha256:sha(x)}))};
 fs.writeFileSync(path.join(base,`session-b-length${unit}.json`),JSON.stringify(result,null,2)+'\n',{flag:'wx'});console.log(JSON.stringify(result));
}else throw Error('Unknown non-product helper operation');
