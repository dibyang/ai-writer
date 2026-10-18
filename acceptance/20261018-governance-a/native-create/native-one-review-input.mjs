import fs from 'node:fs';
import crypto from 'node:crypto';
const to=Number(process.argv[2]);
if(![3,6].includes(to)) throw Error('only actually read rolling windows');
const b='acceptance/20261018-governance-a', p=`${b}/works/纸灯札记`;
const source_hashes={};
for(let u=1;u<=to;u++) {
  const record=JSON.parse(fs.readFileSync(`${b}/native-create/native-one-u${u}-record.json`,'utf8'));
  source_hashes[record.draft]=crypto.createHash('sha256').update(fs.readFileSync(`${p}/${record.draft}`)).digest('hex');
}
if(Object.keys(source_hashes).length!==to) throw Error('incomplete coverage');
const report=`审查/0001-000${to}-滚动连读.md`;
if(!fs.existsSync(`${p}/${report}`)) throw Error('write report after reading');
const input={from:1,to,kind:'model-self-review',report,source_hashes};
fs.writeFileSync(`${b}/native-create/native-one-review-${to}-input.json`,JSON.stringify(input,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify(input,null,2));
