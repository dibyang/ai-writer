import fs from 'node:fs';
import path from 'node:path';
import {cli,runner,save,project,stage,hash} from './run-cli.mjs';
const [n,draft]=process.argv.slice(2);const unit=Number(n);
for(const [args,label] of [[['outline','--unit',n],`outline-${n}-write`],[['plan','--input',`${stage}/plan-${n}.json`],`plan-${n}-cli`],[['context','--unit',n,'--max-chars','1000000'],`context-${n}-cli`],[['record-template','--unit',n,'--draft',draft],`template-${n}-cli`]]){
 const r=cli(args,label);if(r.exit_code!==0){console.log(r.stdout,r.stderr);process.exit(1);}
 if(label.startsWith('context')){
  const j=JSON.parse(r.stdout);save(`context-${n}.json`,j);
  const entries=[];let omitted=[];
  function walk(v,p=''){if(!v||typeof v!=='object')return;if(v.statement)entries.push({path:p,statement:v.statement,status:v.status,due_unit:v.due_unit,reader_known:v.reader_known,custody:v.custody});if(v.omitted_ids)omitted=v.omitted_ids;for(const [k,x]of Object.entries(v))if(k!=='source_hashes')walk(x,p+'/'+k);}
  walk(j);
  console.log(JSON.stringify({context_keys:Object.keys(j),unit:j.unit,revision:j.revision,characters:Object.fromEntries(Object.entries(j.snapshot?.characters??{}).map(([k,v])=>[k,v.split(/；历史有效信息|；保留有效历史|；截至第/)[0]])),entries,omitted_ids:omitted,source_hashes:j.source_hashes},null,2));
  save(`omitted-${n}.json`,{unit,omitted_ids:omitted,review_note:'逐项按当前情节相关性核对：已结主线不调用；旧物不移动；已读当前ledger索引与显式recall覆盖本章消费项。省略项不是删除授权。'});
 }else if(label.startsWith('template')){
  const j=JSON.parse(r.stdout);save(`record-${n}-before.json`,j);save(`record-${n}.json`,j);console.log(JSON.stringify({template_saved:true,unit,keys:Object.keys(j),revision:j.expected_revision??j.revision,source_hashes:j.source_hashes,changes:j.changes},null,2));
 }else console.log(label+' '+r.stdout);
}
console.log(JSON.stringify({now:new Date().toISOString(),elapsed_s:Math.round((Date.now()-Date.parse('2026-10-16T11:20:29.717Z'))/1000)}));
