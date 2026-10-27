import fs from'node:fs';import crypto from'node:crypto';import path from'node:path';import{fileURLToPath}from'node:url';
const X=path.dirname(fileURLToPath(import.meta.url)),P=path.join(X,'scenario/东岸末班船-再扩展验证'),r=n=>fs.readFileSync(path.join(P,n)),j=n=>JSON.parse(r(n)),h=b=>crypto.createHash('sha256').update(b).digest('hex'),put=(n,v)=>fs.writeFileSync(path.join(P,n),typeof v==='string'?v:JSON.stringify(v,null,2)+'\n',{flag:'wx',encoding:'utf8'});
const t=j('.writer/brc-inputs/review-25-30-final-v1.json');
t.comparison.similar_structures[1].differences=t.comparison.similar_structures[1].differences.replace('走56余分钟','关铺到返铺共58分钟');
t.comparison.distinct_gains[0]='25：补衣进入真实穿洗，两个私人约定都由具体人物发起；姑娘与沈互存姓名号码，不替人选书。';
const old=t.report;t.report='审查/X-BRC当前25-30完整比较复盘-v2.md';let report=r(old).toString('utf8').replace('走56余分钟','关铺到返铺共58分钟').replace('25：补衣进入真实穿洗，两个私人约定各有发起者与号码姓名，不替人选书。',t.comparison.distinct_gains[0]);
report+='\n版本说明：v1在正式review前读回，修正28关铺16:00到16:58为58分钟，明确只有姑娘与沈在25实际新互存姓名号码；另存v2，不改任何正文或旧来源。\n';
put(t.report,report);put('.writer/brc-inputs/review-25-30-final-v2.json',t);const b=j('审查/X-BRC当前25-30绑定清单-v1.json');b.report=t.report;b.report_sha256=h(r(t.report));b.input_sha256=h(r('.writer/brc-inputs/review-25-30-final-v2.json'));b.chapter_functions=t.chapter_functions;b.comparison=t.comparison;put('审查/X-BRC当前25-30绑定清单-v2.json',b);
console.log(JSON.stringify({report:t.report,report_sha256:b.report_sha256,input_sha256:b.input_sha256}));
