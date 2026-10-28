import fs from 'node:fs';import crypto from 'node:crypto';
const root=new URL('./work/',import.meta.url),read=p=>fs.readFileSync(new URL(p,root),'utf8');
const t=JSON.parse(read('研究/AN-a-review115-120.json'));
t.chapter_functions.find(r=>r.unit===117).obstacle.evidence[0].quote='说自己今天下午已站得够久，不想去了又跟着一口锅走。';
t.operation_id='AN-a-rolling115-120-r479-v2';
const prev=t.report;t.report='审查/AN-a-115-120-滚动连续性复核-v2.md';
let checked=0;
function check(e){const p=Object.keys(t.source_hashes).find(p=>p.includes('/'+String(e.unit).padStart(4,'0')+'-'));if(!p||!read(p).includes(e.quote))throw Error('Bad quote '+e.unit+' '+e.quote);checked++;}
for(const row of t.chapter_functions)for(const k of ['goal','obstacle','choice','consequence','relationship_change'])for(const e of row[k].evidence)check(e);
for(const x of t.comparison.similar_structures)for(const e of x.evidence)check(e);
fs.writeFileSync(new URL(t.report,root),read(prev)+'\n修正版附记：a-review.mjs首次在辅助引文核验处exit1，117 obstacle引文凭记忆多加“她”导致原句不存在。原报告/输入/脚本保留，未运行原生review；本版仅将该引文改为正文实际连续子串，统一核完30项功能引文和6项比较引文后才保存。未改正文、来源或state，不将辅助错误写作产品缺陷。\n',{flag:'wx'});
fs.writeFileSync(new URL('研究/AN-a-review115-120-v2.json',root),JSON.stringify(t,null,2)+'\n',{flag:'wx'});
const out={ok:true,checked_quotes:checked,report:t.report,report_sha256:crypto.createHash('sha256').update(read(t.report)).digest('hex')};
fs.writeFileSync(new URL('./review-v2-quote-check.json',import.meta.url),JSON.stringify(out,null,2)+'\n',{flag:'wx'});console.log(JSON.stringify(out));
