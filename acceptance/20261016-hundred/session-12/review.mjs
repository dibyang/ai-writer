import fs from 'node:fs';
import {runner,cli,project,stage,hash} from './workflow.mjs';
const end=Number(process.argv[2]);const from=end-5;const state=JSON.parse(fs.readFileSync(project+'/.writer/state.json'));
const report=`审查/${String(from).padStart(4,'0')}-${String(end).padStart(4,'0')}-模型知情连读.md`;
const input={from,to:end,kind:'model-self-review',report,source_hashes:{}};
for(let u=from;u<=end;u++){
 const entry=state.units.find(x=>x.unit===u);if(!entry)throw Error('No unit '+u);
 const f=entry.draft;input.source_hashes[f]=hash(project+'/'+f);
 const t=fs.readFileSync(project+'/'+f,'utf8');fs.appendFileSync(stage+'/reading.jsonl',JSON.stringify({at:new Date().toISOString(),path:f,sha256:hash(project+'/'+f),range:`full:1-${t.split(/\r?\n/).length}`,purpose:`第${end}章滚动连读${from}—${end}`,method:'actual full text inspection in model context'})+'\n');
}
fs.appendFileSync(project+'/'+report,'\n## 当前正文版本\n\n|文件|SHA256|\n|---|---|\n'+Object.entries(input.source_hashes).map(([f,h])=>`|${f}|${h}|`).join('\n')+'\n');
fs.writeFileSync(stage+`/review-${end}.json`,JSON.stringify(input,null,2)+'\n',{flag:'wx'});
const r=cli(`review-${end}-cli`,['review','--input',stage+`/review-${end}.json`]);console.log(r.stdout);console.error(r.stderr);if(r.exit_code!==0)process.exit(r.exit_code??1);
const c=cli(`check-review-${end}-cli`,['check']);console.log(c.stdout);console.error(c.stderr);process.exitCode=c.exit_code??1;
