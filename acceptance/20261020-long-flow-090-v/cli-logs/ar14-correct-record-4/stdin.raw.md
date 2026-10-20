import fs from 'node:fs';import crypto from 'node:crypto';
const v='D:/work/other/ai-writer/acceptance/20261020-long-flow-090-v',w=v+'/scenario/东岸末班船-扩展验证';
const source=w+'/.writer/drafts/v-ar-record-4-filled.json',input=JSON.parse(fs.readFileSync(source,'utf8'));
const before=input.changes.characters['谭老板'];
input.changes.characters['谭老板']=before.replace('亲收许蓉两包8元，做包装小试；','两包共8元由沈禾收进钱盒，本人在场做包装小试；');
if(before===input.changes.characters['谭老板'])throw Error('Correction anchor missing');
delete input.changes.ledger.P_ORDER.previous_holder;
const raw=JSON.stringify(input,null,2)+'\n',target=w+'/.writer/drafts/v-ar-record-4-filled-v2.json';fs.writeFileSync(target,raw,{flag:'wx'});
console.log(JSON.stringify({target,sha256:crypto.createHash('sha256').update(raw).digest('hex'),reason:'Pre-record semantic review: payment physically received by Shen, not Tan; order holder unchanged, retain historical previous_holder Zhou by omitting unnecessary overwrite.',unchanged_sources:true,related_unchanged_review:{O_BOX_PAINT:'Original immutable fields and current knowledge preserved; no new paint event.',T_BACK:'21:37 return remains dated completed event.',T_CALLBACK:'21:10 contact/photo remains dated completed event.',T_DEPOSIT:'80 returned and home last confirmation unchanged; no new expense.'}},null,2));
