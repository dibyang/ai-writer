import fs from 'node:fs';import path from 'node:path';import {fileURLToPath} from 'node:url';import assert from 'node:assert/strict';
const X=path.dirname(fileURLToPath(import.meta.url)),h=JSON.parse(fs.readFileSync(path.join(X,'cli-logs/e-begin/stdout.raw.txt'),'utf8')),r=JSON.parse(fs.readFileSync(path.join(h.workspace,'.writer/drafts/er-replay30.json'),'utf8')),c=r.changes;
assert(r.summary.includes('19—20:30实际90分钟'));r.summary=r.summary.replace('19—20:30实际90分钟','19—20:40实际100分钟，20:25左右最终试摸后记录/收物');
assert(c.characters['许蓉女儿'].includes('19—20:30完整90分钟'));c.characters['许蓉女儿']=c.characters['许蓉女儿'].replace('19—20:30完整90分钟','19—20:40完整100分钟');
c.timeline_append[3]='第二十四日19—20:40：女第三课，老师赠薄棉边料，自完成裤兜里衬与外缝，20:25左右最终试摸后拍照/记纸/还剪刀收物，自针归盒，按100分钟收课。';
c.ledger.T_W_EVENING_CLASS.reader_known=c.ledger.T_W_EVENING_CLASS.reader_known.replace('19—20:30','19—20:40共100分钟');
assert.equal(c.ledger.T_W_EVENING_CLASS.evidence[1].quote,'八点半，老师叫收针');c.ledger.T_W_EVENING_CLASS.evidence[1].quote='八点四十，老师叫收针';
fs.writeFileSync(path.join(X,'er-input-patch30.json'),JSON.stringify({summary:r.summary,changes:c},null,2)+'\n',{flag:'wx'});
