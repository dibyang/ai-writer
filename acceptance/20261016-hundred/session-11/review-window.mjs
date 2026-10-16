import fs from 'node:fs';import path from 'node:path';import {cli,save,hash,project,stage} from './run-cli.mjs';
const [a,b,bodyFile]=process.argv.slice(2);const from=Number(a),to=Number(b);const sources={};
for(let n=from;n<=to;n++){
 const f='正文/'+fs.readdirSync(path.join(project,'正文')).find(f=>f.startsWith(String(n).padStart(4,'0')+'-'));sources[f]=hash(path.join(project,f));
 fs.appendFileSync(`${stage}/reading.jsonl`,JSON.stringify({path:project+'/'+f,sha256:sources[f],range:'full',purpose:`${from}—${to}滚动连读，逐章完整模型知情自检`,read_at:new Date().toISOString(),method:'FastCtx完整展示后模型实读；此脚本只绑定哈希'})+'\n');
}
const report=`审查/${from}-${to}-20261016-session11.md`;fs.mkdirSync(path.join(project,'审查'),{recursive:true});
const body=fs.readFileSync(path.join(stage,bodyFile),'utf8')+'\n\n|完整实读正文|SHA-256|\n|---|---|\n'+Object.entries(sources).map(([p,h])=>`|${p}|${h}|`).join('\n')+'\n';
fs.writeFileSync(path.join(project,report),body,'utf8');
save(`review-${to}.json`,{from,to,kind:'model-self-review',report,source_hashes:sources});
const r=cli(['review','--input',`${stage}/review-${to}.json`],`review-${to}-cli`);console.log(r.stdout,r.stderr);if(r.exit_code!==0)process.exit(r.exit_code??1);
const c=cli(['check'],`check-after-review-${to}`);console.log(c.stdout,c.stderr);process.exitCode=c.exit_code??1;
