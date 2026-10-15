import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
const out=import.meta.dirname,p=path.join(out,'../acceptance/20261016-long/works/雨线档案'),rel='审查/1-12连续性修复-20261016.md';
const read=JSON.parse(fs.readFileSync(path.join(out,'final-reading.json'),'utf8'));
const hashes={};for(const row of read.units){const actual=crypto.createHash('sha256').update(fs.readFileSync(path.join(p,row.path))).digest('hex');if(actual!==row.sha256)throw Error('changed after reading');hashes[row.path]=row.sha256;}
const file=path.join(p,rel);if(fs.readFileSync(file,'utf8').includes('## 最终版本绑定'))throw Error('already bound');
fs.appendFileSync(file,'\n## 最终版本绑定\n\n最终登记revision：28。最终全稿阅读捕获SHA-256：`'+read.read_capture_sha256+'`。\n\n```json\n'+JSON.stringify(hashes,null,2)+'\n```\n');
fs.writeFileSync(path.join(out,'review-input.json'),JSON.stringify({from:1,to:12,kind:'model-self-review',report:rel,source_hashes:hashes},null,2)+'\n');
console.log(JSON.stringify({report:rel,report_sha256:crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex'),read_capture_sha256:read.read_capture_sha256}));
