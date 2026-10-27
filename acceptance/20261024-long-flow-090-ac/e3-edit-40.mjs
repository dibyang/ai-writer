import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {base,j,main,sha,save} from './e1-ops.mjs';
const root=j(path.join(base,'e-repaired-first-execution.json')).revision.workspace,ref='正文/0040-取下来的那一条-ac-b-v1.md',file=path.join(root,ref),original=fs.readFileSync(file,'utf8');
assert.equal(sha(Buffer.from(original)),j(path.join(main,'.writer/state.json')).units.find(u=>u.unit===40).sha256);
const edits=[
 ['对方报八块一根，若要长的另拿。','对方报十块一根，若要长的另拿。'],
 ['朝女人说店里有可挑的，八块；自己去一趟','朝女人说店里有可挑的，十块；自己去一趟'],
 ['先问八块这根够不够整道。','先问十块这根够不够整道。'],
 ['那你先看。八块就八块，别最后一算又多一样。','那你先看。十块就十块，别最后一算又多一样。'],
 ['他说八块那根写清就行','他说十块那根写清就行'],
 ['老板添了日期，把纸推来。周岸从钱夹取十块，对方找回两枚硬币，他接到掌心，先收钱，再将那张写着八元的小纸叠好，放进本子夹页。','老板添了日期，把纸推来。周岸从钱夹取十块，递过去，老板将纸币展平看过，说正好，收进台下的钱匣。周岸等他腾出手，把那张写着十元的小纸叠好，放进本子夹页。'],
 ['店里那张八元条也在','店里那张十元条也在'],
 ['这一根八块，我付了。','这一根十块，我付了。'],
 ['八元小条压在空碟下','十元小条压在空碟下']
];
let current=original;for(const [before,after]of edits){assert.equal(current.split(before).length-1,1,before);current=current.replace(before,after);}
const han=t=>(t.replace(/^#.*$/gm,'').match(/\p{Script=Han}/gu)??[]).length;assert(han(current)>=14000);
save('e3-u40-body-diff.json',{unit:40,ref,old_sha256:sha(Buffer.from(original)),new_sha256:sha(Buffer.from(current)),old_hanzi:han(original),new_hanzi:han(current),edits:edits.map(([before,after])=>({before,after})),scope:'controller material8to10; labor40; exact10 payment no change; not global number substitution'});
fs.writeFileSync(file,current);console.log(JSON.stringify({unit:40,sha256:sha(Buffer.from(current)),chars:current.length,hanzi:han(current),edits:edits.length}));
