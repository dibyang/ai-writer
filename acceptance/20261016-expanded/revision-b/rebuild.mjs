import fs from 'node:fs';
import assert from 'node:assert/strict';
import {json,write,stage,project,run} from './run.mjs';
const old=json(stage+'/before/work/.writer/state.json');
const oldSnaps=json(stage+'/before/replayed-snapshots.json');
const replacements=[
 ['九点三十五','九点五十'],['十点十分','十点二十五分'],
 ['第3日九点三十五起','第3日九点五十起'],['第3日十点十分','第3日十点二十五分'],
 ['等客户取冰箱后完整口述内牌给顾','等客户取冰箱后仅告顾箱内有浅布窄铜牌、归属未核及沈负责，未报牌面'],
 ['已首次向顾完整口述牌字刻线无日期独开未拍抄','只向顾说明浅布窄铜牌、归属未核及自己负责，未报铭文刻线日期'],
 ['第3日店内，客户优先后首次听沈完整口述箱内铜牌字样右下两线无日期、独开未拍抄，自己未亲见','第3日店内，客户优先后只听沈说箱内浅布窄铜牌、归属未核且仍由沈负责；尚不知铭文刻线和日期信息，未亲见'],
 ['依第11章全口述知牌','第14章唐离店、沈复封上架后，在前台首次听沈完整口述铭文、右下两线、正反未找到日期及首日独开未拍抄；未看照片或原牌'],
 ['第11章首次听沈完整内牌口述未亲见','第11章仅听沈说箱内浅布窄铜牌、归属未核且沈负责，不知牌面细节未亲见'],
 ['第14章前台未看原箱内牌，不替归属与保管担责','第14章一直前台未看原箱内牌；唐走沈复封上架后首次听完整铭文刻线与无日期口述，不替归属与保管担责'],
 ['第5告周第7告唐第11告顾','第5告周第7告唐；第11章仅告顾箱内有布牌，第14章唐走复封上架后才在前台首次完整告顾'],
 ['顾未见牌，钥匙原带未取','复封上架后在前台首次完整告顾铭文刻线和无日期、首日独见未拍抄；顾未亲见原牌，钥匙原带未取'],
 ['沈复封上架仍自负责，顾只在前台。','沈复封上架仍自负责，随后在前台首次完整告顾牌面及观察边界；顾全程未入开箱现场未亲见原牌。']
];
function strings(v){if(typeof v==='string'){for(const[a,b]of replacements)v=v.split(a).join(b);return v;}if(Array.isArray(v))return v.map(strings);if(v&&typeof v==='object')return Object.fromEntries(Object.entries(v).map(([k,x])=>[k,strings(x)]));return v;}
const fullQuote="牌上完整的字是‘西埠四号泊位’，右下角两条短刻线，正反都没找到日期。";
const genericQuote='铁箱里只有浅色棉布和一块窄铜牌。我自己开过，后来封上没再动。归属还没核清，暂放的责任仍是我的。';
const lampQuote='还有这整根灯，没拆。这里能暂放吗？不是只放那块小片。';
function expected(n){
 const s=strings(structuredClone(oldSnaps[n]));
 if(n>=7){s.timeline=s.timeline.map(t=>t.startsWith('第3日九点五十起')?t.replace('沈禾离旧站','临走助工卸装篷布、移通道小车入院角并扎绳垫轮后，沈禾离旧站'):t);s.ledger.T_HANDOVER.evidence.push({unit:7,quote:'工人请她搭把手，把通道里的小车移进院角。'});}
 if(n<11){if(s.ledger)for(const v of Object.values(s.ledger))v.evidence.sort((a,b)=>a.unit-b.unit);return s;}
 s.ledger.O_PLATE.character_known.顾遥=n<14?'第11章只听沈说箱内浅色棉布和窄铜牌、归属未核且沈负责；截至当前尚不知道完整铭文、刻线和日期信息，未亲见原牌。':'第14章唐16:54离店、沈将原箱复封上架后，首次在前台当面听沈完整口述西埠四号泊位、右下两短刻线、正反未找到日期、首日独开未拍抄及今天沈唐才拍工作照；一直未入开箱现场，未亲见原牌或看牌照。此前截至第13章仅知箱内浅布窄铜牌、归属未核且沈负责，不知牌面细节。';
 if(n<14)s.ledger.O_PLATE.reader_known='初始观察不变：沈第2章独见未拍抄，周第5章、唐第7章获完整口述，均未亲见牌；顾第11章只知箱内浅布窄铜牌，尚未获铭文刻线日期信息。';
 for(const e of s.ledger.O_PLATE.evidence)if(e.unit===11)e.quote=genericQuote;
 if(n>=14){
  s.ledger.O_PLATE.evidence.push({unit:14,quote:fullQuote},{unit:14,quote:'这回才把字告诉我啊。'});
  s.ledger.P_BOX.evidence.push({unit:14,quote:'昨天只说了箱里有布和牌。现在也是口头告诉你，不能算你见过原牌。'});
 }
 if(n===20){
  s.characters.沈禾=s.characters.沈禾.replace('小箱明早问负责人、长灯不接，未搬接。','随后展示灯柱原位工作照，实际问未拆整根灯能否暂放，宋只看照片拒收；小箱明早问负责人，未搬接。');
  s.characters.宋俭=s.characters.宋俭.replace('只示桌角待负责人明早核权属接管，不接长灯。','随后看沈出示的灯柱原位整根照片、听未拆及暂放请求，才拒长灯；未看原灯或读门背字。只示桌角待负责人明早核权属接管。');
  s.ledger.T_LAMP.character_known.宋俭='第20章沈实际展示灯柱原位整根工作照并问未拆整根可否暂放后拒收；只看照片，不亲见原灯、不读门背字，未获灯语或使用史。';
  s.ledger.T_LAMP.evidence.push({unit:20,quote:lampQuote});
  s.ledger.T_ARCHIVE.statement=s.ledger.T_ARCHIVE.statement.replace('长灯不接；','沈随后展示灯柱原位照问未拆整根可否暂放，宋只看照片才答长灯不接；');
  s.ledger.T_ARCHIVE.character_known.宋俭='第20章先看箱照获发现点和权属未明；后看沈展示的灯柱原位整根工作照并听未拆及暂放请求，才明确不接长灯；未见原箱原灯、未读门背字，不许沈把候问写成接收。';
  s.ledger.T_ARCHIVE.character_known.沈禾+='实际展示灯柱原位照、问未拆整根能否暂放后得到拒收；未搬灯，仅问位置。';
  s.ledger.T_ARCHIVE.evidence.push({unit:20,quote:lampQuote});
  s.timeline[s.timeline.length-1]=s.timeline.at(-1).replace('示箱照看候问桌角不接箱灯','示箱照看候问桌角；再展示灯柱原位整根照、问未拆整根暂放被拒，未接箱灯');
 }
 for(const v of Object.values(s.ledger))v.evidence.sort((a,b)=>a.unit-b.unit);
 return s;
}
const snaps=oldSnaps.map((_,n)=>expected(n));
write(stage+'/expected/snapshots.json',snaps);
function changes(n){
 const a=snaps[n-1],b=snaps[n],out={characters:{},timeline_append:b.timeline.slice(a.timeline.length),ledger:{}};
 for(const[k,v]of Object.entries(b.characters))if(a.characters[k]!==v)out.characters[k]=v;
 for(const[id,v]of Object.entries(b.ledger)){
  const prev=a.ledger?.[id]??{},d={};
  for(const[k,x]of Object.entries(v))if(!['evidence','introduced_unit','updated_unit'].includes(k)&&JSON.stringify(prev[k])!==JSON.stringify(x)){
   if(k==='character_known'){d[k]={};for(const[c,t]of Object.entries(x))if(prev[k]?.[c]!==t)d[k][c]=t;}
   else d[k]=x;
  }
  const ev=v.evidence.filter(e=>e.unit===n).map(e=>({unit:e.unit,quote:e.quote}));
  if(ev.length)d.evidence=ev;
  if(Object.keys(d).length){assert(ev.length,`Missing current evidence ${n} ${id}`);out.ledger[id]=d;}
 }
 return out;
}
function summary(n){let t=strings(old.units[n-1].summary);
 if(n===7)t=t.replace('九点五十分实际出发查访','临走帮工人挪通道小车、卸装篷布扎绳垫轮后九点五十分实际出发查访');
 if(n===11)t=t.replace('首次向顾遥完整口述内牌并说明归属待核','客户提起前天帮扶微波炉挂门帘，沈未接私单；只向顾说明箱内浅布窄铜牌、归属未核、暂放仍自己负责，未报铭文刻线日期');
 if(n===14)t=t.replace('顾只前台未见牌，告罗次早取扇','复封上架后沈在前台首次当面完整口述铭文、右下两短线、两面未找到日期及首日独开未拍抄给顾；顾一直前台，未入开箱现场未亲见牌，告罗次早取扇');
 if(n===20)t=t.replace('长灯不接，无交接','沈接着实际展示灯柱原位整根工作照、问未拆整根能否暂放，宋只看照片后才拒收长灯，未见原灯或读门背字，无交接');
 return t;
}
const n=Number(process.argv[3]);
if(process.argv[2]==='prepare'){
 const p=stage+'/inputs/'+String(n).padStart(4,'0')+'-plan.json';
 console.log(run(['plan','--project',project,'--input',p],String(n)+'-plan'));
 const c=run(['context','--project',project,'--unit',String(n),'--max-chars','120000'],String(n)+'-context');write(stage+'/contexts/'+n+'.json',c);
 const t=run(['record-template','--project',project,'--unit',String(n),'--draft',old.units[n-1].draft],String(n)+'-template');write(stage+'/templates/'+n+'.json',t);
 write(stage+'/inputs/'+String(n).padStart(4,'0')+'-record.json',{...t,summary:summary(n),changes:changes(n)});
 write(stage+'/contexts/'+n+'-readback.json',{revision:c.revision,plan:c.plan,snapshot:c.snapshot,recent:c.recent,outline:c.outline,continuity:c.continuity});
 console.log(JSON.stringify({unit:n,revision:t.expected_revision,summary:summary(n),context_gu:c.snapshot.characters.顾遥,context_recent:c.recent,context_keys:Object.keys(c),continuity_keys:Object.keys(c.continuity??{}),changed_ids:Object.keys(changes(n).ledger),knowledge_changes:{gu:changes(n).characters.顾遥,plate:changes(n).ledger.O_PLATE,box:changes(n).ledger.P_BOX?.character_known?.顾遥},timeline:changes(n).timeline_append},null,2));
}else if(process.argv[2]==='record'){
 fs.copyFileSync(stage+'/candidates/'+old.units[n-1].draft,project+'/'+old.units[n-1].draft);
 console.log(run(['record','--project',project,'--input',stage+'/inputs/'+String(n).padStart(4,'0')+'-record.json'],String(n)+'-record'));
 const current=json(project+'/.writer/state.json');write(stage+'/after/snapshots/'+String(n).padStart(4,'0')+'.json',current.snapshot);
 // Compare semantic fields and evidence order; ignore CLI-created anchor metadata.
 const strip=x=>JSON.parse(JSON.stringify(x,(k,v)=>['sha256','draft','line','introduced_unit','updated_unit'].includes(k)?undefined:v));
 assert.deepEqual(strip(current.snapshot),strip(snaps[n]));
 console.log('Semantic snapshot matched for '+n);
}
