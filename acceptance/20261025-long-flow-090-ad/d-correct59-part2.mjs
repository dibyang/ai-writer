import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';import assert from 'node:assert/strict';import {fileURLToPath} from 'node:url';
const base=path.dirname(fileURLToPath(import.meta.url)),p=JSON.parse(fs.readFileSync(path.join(base,'project.json'))).project,sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const ref='分段/AD-D-0059/02.md',original=fs.readFileSync(path.join(p,ref),'utf8');
const edits=[
['原书签在前一晚停的地方。','原书签仍夹在上回停的地方。'],
['穿鞋时，手碰到包侧的针盒轮廓，她才发觉原来用的是上课回来那只袋，里头还有自己没取净的小盒。她将盒拿出来，放回干桌内，换成平日装书的薄袋，水杯另手提。东西从一只换到另一只，方才赶路的那一点急倒逼她真正看了一眼手里拿什么。','穿鞋时，她低头看见桌下收着的课袋，手里提的却是平日装书的薄袋。原针盒早已收回桌内干处，今日用不着取。她将水杯换到另一手，书袋口合好，方才赶路的那一点急终于缓下来。'],
['沈禾说完自己笑，像觉得这句讲了等于没讲。女孩也笑，问她要不要看自己刚翻的那张，那张有一大片颜色，用不着从盆后找。说着便把十四元的花册摊开，不是上次最先看的红花，深浅两片挨着，下面留一条细枝。','沈禾说完自己笑，像觉得这句讲了等于没讲。女孩也笑，问她要不要看自己刚翻的那张，那张有一大片颜色，用不着从盆后找。说着便把十四元的花册摊开，不是上次最先看的红花，深浅两片挨着，下面留一条细枝。她先将自己的小夹纸取出，留在掌下。']
];let corrected=original;for(const [a,b]of edits){assert.equal(corrected.split(a).length,2);corrected=corrected.replace(a,b);}
const dest='分段/AD-D-0059-修正/02.md';fs.mkdirSync(path.dirname(path.join(p,dest)),{recursive:true});fs.writeFileSync(path.join(p,dest),corrected,{flag:'wx'});
fs.writeFileSync(path.join(base,'d-59-partial-corrections.json'),JSON.stringify({at:new Date().toISOString(),reason:'partial self-review before first stop; preserve unregistered initial text and choose corrected current02, no source/template/state edits',original:{ref,sha256:sha(Buffer.from(original))},corrected:{ref:dest,sha256:sha(Buffer.from(corrected))},edits:edits.map(([before,after])=>({before,after}))},null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({ok:true,first_han:(fs.readFileSync(path.join(p,'分段/AD-D-0059/01.md'),'utf8').replace(/^#{1,6} .*$/gm,'').match(/\p{Script=Han}/gu)||[]).length,second_han:(corrected.match(/\p{Script=Han}/gu)||[]).length,corrected:dest}));
