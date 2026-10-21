import fs from 'node:fs';import crypto from 'node:crypto';import assert from 'node:assert/strict';
const n=Number(process.argv[2]),W='acceptance/20261021-long-flow-090-w/',P=W+'scenario/东岸末班船-规模验证/',s=JSON.parse(fs.readFileSync(P+'.writer/state.json')),t=JSON.parse(fs.readFileSync(P+`.writer/drafts/d-record-${n}-template.json`));
assert.equal(s.revision,t.expected_revision);const dir=`分段/${String(n).padStart(4,'0')}/v1/`,files=fs.readdirSync(P+dir).filter(f=>f.endsWith('.md')).sort();
const parts=files.map(f=>{const b=fs.readFileSync(P+dir+f);return {path:dir+f,sha256:crypto.createHash('sha256').update(b).digest('hex'),bytes:b.length,body_han:(b.toString('utf8').replace(/^#.*\r?\n/,'').match(/\p{Script=Han}/gu)||[]).length};});
const total=parts.reduce((z,v)=>z+v.body_han,0);assert(total>=(n===24?8000:6000));assert(parts.length>=(n===24?4:3));
fs.writeFileSync(W+`d-${n}-final-parts-measure.json`,JSON.stringify({parts,total},null,2)+'\n',{flag:'wx'});
fs.writeFileSync(W+`inputs/d-assemble-${n}.json`,JSON.stringify({unit:n,expected_revision:s.revision,draft:t.draft,parts:parts.map(({path,sha256})=>({path,sha256})),separator:'\n\n'},null,2)+'\n',{flag:'wx'});console.log({unit:n,total,parts:parts.length});
