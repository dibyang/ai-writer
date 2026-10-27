import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';import assert from 'node:assert/strict';import {fileURLToPath}from'node:url';
const X=path.dirname(fileURLToPath(import.meta.url)),P=path.join(X,'scenario/东岸末班船-再扩展验证'),j=JSON.parse(fs.readFileSync(path.join(X,'f-current-audit.json'),'utf8'));
const keys=['V_A_U5_TIME_METADATA','I_F19_TITLE_TIME','I_X_DR36_BOOK_KNOWLEDGE'];
const sources=Object.fromEntries(['.writer/objects/c90f0d78c76dbb9dc6bc6d7ed56c68b589f3470940cf222011244101a0913129.source','.writer/objects/bbc56b1c15e97bb9d22895d04979687543f7a5b93b710ebf36d8df02b6b95858.source','大纲/单元/0033.json'].map(f=>[f,crypto.createHash('sha256').update(fs.readFileSync(path.join(P,f))).digest('hex')])));
assert.equal(sources['大纲/单元/0033.json'],'c90f0d78c76dbb9dc6bc6d7ed56c68b589f3470940cf222011244101a0913129');
const out={sources,issues:j.issues.issues.filter(i=>keys.includes(i.id)),ledger:Object.fromEntries(Object.entries(j.relevant_ledger).map(([id,e])=>[id,{type:e.type,statement:e.statement,status:e.status,reader_known:e.reader_known,character_known:e.character_known}]))};
fs.writeFileSync(path.join(X,'f-current-detail.json'),JSON.stringify(out,null,2)+'\n',{flag:'wx'});console.log(JSON.stringify(out,null,2));
