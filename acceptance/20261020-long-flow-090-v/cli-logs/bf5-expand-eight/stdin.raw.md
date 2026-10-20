import fs from 'node:fs';import crypto from 'node:crypto';
const w='scenario/东岸末班船-扩展验证',sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const p='分段/0008/02-v1.md',raw=fs.readFileSync(`${w}/${p}`,'utf8');
const anchor='“帆布袋别挂这里，挡着。”他说。';
const added=`

她正要拿袋子，老板又问：“明天你还这个点来？”

“今天不是先试一回吗？”

“我问问。我明早要去进货，守不了灶。”

沈禾的手在袋带上停了一下。若再早一点，先把常规的也放上去，等他回来便能接住；这念头刚转过，她看看架上没凉的笼子，没有把时间往自己闹钟上挪。

“那就别先接早的。照平常的来，我一个人看不住里外。”

老板点头，刷子在笼底转了一圈，水珠落到围裙上。

“我也得腾一天去。停航了，送货的车不肯专为咱们拐。”

“你回来再看。今天哪儿卡住，等坐下了说。”

他抬头看她，像以为她还要把早晨那几句补完。她已经把袋子拿在手里，没有再说多起十分钟也行。老板将凳子往水池近处挪，给她让出回里间的路，说好，今天先让他把这两只洗完。

她侧身走过，肩头没再擦到袋子。早起的困还在，下午这段工夫，她也确实想要。`;
if(raw.split(anchor).length!==2)throw Error('anchor must occur once');
const next=raw.replace(anchor,anchor+added);
fs.writeFileSync(`${w}/分段/0008/02-v2.md`,next,{flag:'wx'});
const s=JSON.parse(fs.readFileSync(`${w}/.writer/state.json`));
const parts=['分段/0008/01-v1.md','分段/0008/02-v2.md'].map(path=>{const b=fs.readFileSync(`${w}/${path}`);return {path,sha256:sha(b),han:[...b.toString().replace(/^#.*$/gm,'').matchAll(/\p{Script=Han}/gu)].length};});
const total=parts.reduce((n,p)=>n+p.han,0);if(total<3500)throw Error('Han below 3500');
fs.writeFileSync('bf5-assemble-8-v2.json',JSON.stringify({unit:8,expected_revision:s.revision,draft:'正文/0008-半个钟头-v1.md',parts:parts.map(({path,sha256})=>({path,sha256})),separator:'\n\n'},null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({preserved:p,new_part:'分段/0008/02-v2.md',parts,total_han:total},null,2));
