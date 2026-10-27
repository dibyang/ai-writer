import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {P,put,json,sha} from './vf-artifacts.mjs';
const replacements=[['01-店门.md',[
 ['封口处露出几本薄册子的书脊','没盖严的箱口露出几本薄册子的书脊'],
 ['我让它们淋，我自己不淋，出来时想得挺好。','光顾着给书套袋子，倒没给自己拿把伞。']
]],['02-借出.md',[
 ['解开屏幕','解锁手机'],
 ['经过自家店那条巷子时，材料店就能看见了，偏偏不能直接过去。','从车棚望过去，材料店的招牌已经能看见了，中间却隔着那道锁住的院门。']
]]];
const parts=[];
for(const [name,pairs] of replacements){let text=fs.readFileSync(path.join(P,'分段/0001',name),'utf8');for(const [a,b] of pairs){assert.equal(text.split(a).length,2);text=text.replace(a,b);}const r='分段/0001-r2/'+name;put(r,text);parts.push({path:r,sha256:sha(text)});}
const original=json('.writer/drafts/record-1-original.json'),t=structuredClone(original);t.draft='正文/V01-借出的一天/0001-雨停以前-r2.md';delete t.output;
put('.writer/drafts/record-1-r2-template.json',t);
put('输入/assemble-1-r2.json',{unit:1,expected_revision:t.expected_revision,draft:t.draft,parts,separator:'\n\n'});
assert.deepEqual(t.source_hashes,original.source_hashes);assert.deepEqual(t.source_bindings,original.source_bindings);
console.log(JSON.stringify({ok:true,source_hashes_preserved:true,expected_revision:t.expected_revision,draft:t.draft,parts}));
