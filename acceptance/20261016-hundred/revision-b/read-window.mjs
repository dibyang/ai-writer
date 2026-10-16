import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';
const stage=path.resolve('acceptance/20261016-hundred/revision-b'),work=path.resolve('acceptance/20261016-hundred/works/潮汐信号'),base=JSON.parse(fs.readFileSync(path.join(stage,'baseline.json'),'utf8'));
const [start,end]=process.argv.slice(2).map(Number);for(let n=start;n<=end;n++){const u=base.units.find(x=>x.unit===n),b=fs.readFileSync(path.join(work,u.draft));console.log(JSON.stringify({unit:n,draft:u.draft,sha256:crypto.createHash('sha256').update(b).digest('hex')}));console.log(b.toString('utf8'));}
