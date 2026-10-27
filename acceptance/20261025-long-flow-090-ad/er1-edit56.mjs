import fs from'node:fs';import path from'node:path';import assert from'node:assert/strict';import{base,j,sha}from'./ef-lib.mjs';
const r=j(path.join(base,'e-revision-private.json')),f=path.join(r.workspace,'正文/0056-留给她自己试-ad-cr-v2.md');let t=fs.readFileSync(f,'utf8');
const edits=[['料十二','料十六'],['报十二','报十六'],['买了十二元','买了十六元'],['六十元，五十元一张，十元一张','七十元，五十元一张，二十元一张'],['从钱夹找出两元','从钱夹找出八元，一张五元和三张一元'],['顺口说的六十','顺口说的七十'],['我都准备六十了','我都准备七十了'],['我找你两块','我找你八块'],['对方将两元收回','对方将八元收回'],['找回的两元','找回的八元'],['那张五十和十元都在','那张五十和二十元都在'],['找回去的两元','找回去的八元'],['找二。','找八。']];
for(const[a,b]of edits){assert(t.includes(a),a);t=t.replaceAll(a,b);}fs.writeFileSync(f,t);console.log(JSON.stringify({file:f,sha256:sha(fs.readFileSync(f)),chars:t.length,pages:Math.ceil(t.length/1800),edits}));
