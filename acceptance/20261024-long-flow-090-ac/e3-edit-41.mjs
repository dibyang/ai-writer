import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {base,j,main,sha,save} from './e1-ops.mjs';
const root=j(path.join(base,'e-repaired-first-execution.json')).revision.workspace,ref='正文/0041-让她自己推一次-ac-b-v1.md',file=path.join(root,ref),original=fs.readFileSync(file,'utf8');assert.equal(sha(Buffer.from(original)),j(path.join(main,'.writer/state.json')).units.find(u=>u.unit===41).sha256);
const edits=[
 ['钟到十一点出头。锅里饭还得焖，女人看他背好包，才从小包里取钱，先拿出五十，又翻找零钞，想换成正好的数。周岸说四十八，自己找她，不必凑；她一听便停，五十递到他手上。钱入掌，他从钱夹拿出两块，交回给她，等她收好，才在自己的本上写下工四十、料八，旁边添了已收。','钟到十一点出头。锅里饭还得焖，女人看他背好包，才从小包里取出一张五十，问连材料是不是这些。周岸答工四十、料十，合起来正好五十。她将纸币展开，递到他手上，自己拿回桌边的小包。他接过看清，钱夹里空出一格，将这一张收好，才在本上写下工四十、料十，旁边添了已收。'],
 ['女人将空碟下的八元条取出，叫他把工钱也写旁边，省得自己过几日只看见一根木头八块，忘了另一笔。','女人将空碟下的十元条取出，叫他把工钱也写旁边，省得自己过几日只看见一根木头十块，忘了另一笔。'],
 ['写明工四十、工料共四十八已收','写明工四十、工料共五十已收'],
 ['女儿说给了，五十找两，周岸也向她点一下头。','女儿说给了，五十正好，周岸也向她点一下头。'],
 ['材料支出八，工料实收四十八，两行分着。收回来的料钱不用再算作多得八块','材料支出十，工料实收五十，两行分着。收回来的料钱不用再算作多得十块'],
 ['今天门活那两块已找回主人，这一枚是自己的，混在一起的时候没觉得重，落到盘里才听得清。','那是下午买东西剩的，回来时顺手塞进口袋，一直没记起。小小一枚，隔着布摸不真切，落到盘里才听得清。']
];let current=original;for(const[before,after]of edits){assert.equal(current.split(before).length-1,1,before);current=current.replace(before,after);}
const han=t=>(t.replace(/^#.*$/gm,'').match(/\p{Script=Han}/gu)??[]).length;assert(han(current)>=10000);save('e3-u41-body-diff.json',{unit:41,ref,old_sha256:sha(Buffer.from(original)),new_sha256:sha(Buffer.from(current)),old_hanzi:han(original),new_hanzi:han(current),edits:edits.map(([before,after])=>({before,after})),scope:'labor40 material10 total50 exact; remove two-yuan change and dependent contrast, preserve separate afternoon coin'});fs.writeFileSync(file,current);console.log(JSON.stringify({unit:41,sha256:sha(Buffer.from(current)),chars:current.length,hanzi:han(current),edits:edits.length}));
