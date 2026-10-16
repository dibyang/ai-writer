import fs from 'node:fs';import crypto from 'node:crypto';
const stage='acceptance/20261016-hundred/session-13',project='acceptance/20261016-hundred/works/潮汐信号',from=+process.argv[2],to=+process.argv[3],report=process.argv[4],suffix=process.argv[5]??String(to);
const source_hashes={};for(let n=from;n<=to;n++){const f=fs.readdirSync(project+'/正文').find(f=>f.startsWith(String(n).padStart(4,'0')+'-'));if(!f)throw Error('missing chapter '+n);const rel='正文/'+f;source_hashes[rel]=crypto.createHash('sha256').update(fs.readFileSync(project+'/'+rel)).digest('hex');}
fs.appendFileSync(project+'/'+report,'\n## 实读版本哈希\n\n'+Object.entries(source_hashes).map(([p,h])=>'- '+p+' `'+h+'`').join('\n')+'\n');
const j={from,to,kind:'model-self-review',report,source_hashes};fs.writeFileSync(stage+'/review-'+suffix+'.json',JSON.stringify(j,null,2)+'\n',{flag:'wx'});console.log(j);
