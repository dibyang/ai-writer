import test from 'node:test';import assert from 'node:assert/strict';import {publicJsonObjects} from './public-read-outputs.mjs';
const page={file:'D:/AD/正文/章.md',page:1,pages:2,text:'他说："{这只是正文} [也不是数组]"。\\换行\n下一行'};
test('keeps exact text in consecutive pretty JSON page returns',()=>{
 const second={...page,page:2,text:'末页：\\"与右花括号 }'};
 assert.deepEqual(publicJsonObjects(JSON.stringify(page,null,2)+'\n'+JSON.stringify(second,null,2)+'\n'),[page,second]);
});
test('supports one page and a JSON array without unwrapping serialized strings',()=>{
 assert.deepEqual(publicJsonObjects(JSON.stringify(page)),[page]);assert.deepEqual(publicJsonObjects(JSON.stringify([page,{...page,page:2}])),[page,{...page,page:2}]);
 assert.deepEqual(publicJsonObjects(JSON.stringify({output:JSON.stringify(page)})),[{output:JSON.stringify(page)}]);
});
test('rejects a whole truncated or malformed batch rather than crediting a prefix',()=>{
 assert.deepEqual(publicJsonObjects(JSON.stringify(page)+'\n{"file":"cut'),[]);
 assert.deepEqual(publicJsonObjects(JSON.stringify(page)+'\n{"broken":}'),[]);
});
test('rejects warning prefixes, trailing logs, and ellipsis markers',()=>{
 for(const raw of ['Warning: truncated output\n'+JSON.stringify(page),JSON.stringify(page)+'\n... omitted ...',JSON.stringify(page)+'\nprocess failed'])assert.deepEqual(publicJsonObjects(raw),[]);
});
