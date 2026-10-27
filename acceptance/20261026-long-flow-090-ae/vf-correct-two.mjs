import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {P,put,json,sha} from './vf-artifacts.mjs';
const replacements=[['01-来电.md',[
 ['我早半个钟头下来。','我提前下来。']
]],['02-约定以后.md',[
 ['她想起早上自己蹲在车棚下面，把装眼镜的盒子摸了两遍，怕里头也进了水。','她想起早上站在车棚下面等雨，眼镜盒还揣在外套内袋里。'],
 ['周岚说得回去了','周岚说得回去接着摆书了'],
 ['至少走到楼下时不怕檐水滴上去','至少走出店门时不怕檐水滴上去']
]]];
const parts=[];for(const [name,pairs] of replacements){let text=fs.readFileSync(path.join(P,'分段/0002',name),'utf8');for(const[a,b]of pairs){assert.equal(text.split(a).length,2);text=text.replace(a,b);}const r='分段/0002-r2/'+name;put(r,text);parts.push({path:r,sha256:sha(text)});}
const original=json('.writer/drafts/record-2-original.json'),t=structuredClone(original);t.draft='正文/V01-借出的一天/0002-迟一天的消息-r2.md';delete t.output;put('.writer/drafts/record-2-r2-template.json',t);put('输入/assemble-2-r2.json',{unit:2,expected_revision:t.expected_revision,draft:t.draft,parts,separator:'\n\n'});assert.deepEqual(t.source_hashes,original.source_hashes);assert.deepEqual(t.source_bindings,original.source_bindings);console.log(JSON.stringify({ok:true,draft:t.draft,parts,source_hashes_preserved:true}));
