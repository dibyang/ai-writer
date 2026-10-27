import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {base,j,main,sha,save} from './e1-ops.mjs';
const root=j(path.join(base,'e-repaired-first-execution.json')).revision.workspace,ref='正文/0044-锅里留着各人的味-ac-c-v1.md',file=path.join(root,ref),original=fs.readFileSync(file,'utf8');assert.equal(sha(Buffer.from(original)),j(path.join(main,'.writer/state.json')).units.find(u=>u.unit===44).sha256);
const edits=[
 ['那我能留两条宽点的？','那我能留三条宽点的？'],
 ['沈禾见她真将那片转来，笑着说两条就行，不是叫她整盘换成自己家的。姑娘点头，先把眼前这片切完，再从另一片边上落两条，宽得认得出来，放到浅盘一角。','沈禾见她真将那片转来，笑着说三条就行，不是叫她整盘换成自己家的。姑娘点头，先把眼前这片切完，再从原来留着的第二片边上切出三条，比细丝宽些，放到浅盘一角。第二片余下的，她仍照自己喜欢的切细，没再添一片。'],
 ['不把另外那两条也一起拌成救不回的咸','不把另外那三条也一起拌成救不回的咸'],
 ['豆干的两条宽边留在浅盘一角','豆干的三条宽边留在浅盘一角'],
 ['沈禾想要的两条宽边仍在她那份上','沈禾想要的三条宽边仍在她那份上'],
 ['说这两条自己先留住','说这三条自己先留住'],
 ['将那两条宽豆干中的一条夹回自己的碗里','将那三条宽豆干中的一条夹回自己的碗里'],
 ['沈禾将宽条剩的那一半举给她，说今天这条还行，自己总算能咬两口。','沈禾将宽条剩的那一半举给她，说今天这条还行，自己总算能咬两口。说完把这一半也吃了，碟角另两条还好好留着。'],
 ['许蓉看见那两条宽豆干只剩一条，不知为何另有这一角','许蓉看见碟角留着两条宽豆干，不知为何另有这一角'],
 ['她的软叶那份剩了少许，蒜末粘在边上，自己尝到后头，还是会换姑娘那边吃两口。','她的软叶那份剩了少许，蒜末粘在边上，自己尝到后头，还是会换姑娘那边吃两口。碟角的宽豆干，她又夹起一条，咬下一半，余下的半条放回自己这边，没有夹到姑娘的碟里。'],
 ['如今桌上两条宽豆干早吃掉一条半，余下那点也混在软叶里','如今桌上三条宽豆干吃掉一条半，还留一条整的和半条，在软叶那份的碟角']
];let current=original;for(const[before,after]of edits){assert.equal(current.split(before).length-1,1,before);current=current.replace(before,after);}const han=t=>(t.replace(/^#.*$/gm,'').match(/\p{Script=Han}/gu)??[]).length;assert(han(current)>=14000);save('e3-u44-body-diff.json',{unit:44,ref,old_sha256:sha(Buffer.from(original)),new_sha256:sha(Buffer.from(current)),old_hanzi:han(original),new_hanzi:han(current),edits:edits.map(([before,after])=>({before,after})),scope:'same original two tofu sheets cut three wide strips; first strip finished before mother sees two; later half eaten leaves one and half; no change to taro, ingredients, money or ownership'});fs.writeFileSync(file,current);console.log(JSON.stringify({unit:44,sha256:sha(Buffer.from(current)),chars:current.length,hanzi:han(current),edits:edits.length}));
