import fs from 'node:fs';
import crypto from 'node:crypto';
const b='acceptance/20261016-expanded/session-c',p='acceptance/20261016-expanded/works/潮汐信号';
const [label,report,a,z]=process.argv.slice(2),from=Number(a),to=Number(z);
const s=JSON.parse(fs.readFileSync(p+'/.writer/state.json','utf8'));
const hashes={},coverage=[];
for(const u of s.units.filter(u=>u.unit>=from&&u.unit<=to)){
 const raw=fs.readFileSync(p+'/'+u.draft),h=crypto.createHash('sha256').update(raw).digest('hex');
 if(h!==u.sha256)throw new Error('changed draft');hashes[u.draft]=h;
 coverage.push({unit:u.unit,draft:u.draft,sha256:h,lines:raw.toString('utf8').split('\n').length,han:(raw.toString('utf8').split('\n').slice(1).join('\n').match(/\p{Script=Han}/gu)||[]).length});
}
fs.appendFileSync(p+'/'+report,'\n## 当前正文绑定\n\n| 章 | 文件 | SHA-256 |\n| --- | --- | --- |\n'+coverage.map(x=>`| ${x.unit} | ${x.draft} | ${x.sha256} |`).join('\n')+'\n');
fs.writeFileSync(`${b}/${label}-review-input.json`,JSON.stringify({from,to,kind:'model-self-review',report,source_hashes:hashes},null,2)+'\n');
fs.writeFileSync(`${b}/${label}-read-coverage.json`,JSON.stringify({nature:'同一模型知情实读，不是真人或独立审查',revision:s.revision,coverage},null,2)+'\n');
console.log(JSON.stringify({from,to,revision:s.revision,report}));
