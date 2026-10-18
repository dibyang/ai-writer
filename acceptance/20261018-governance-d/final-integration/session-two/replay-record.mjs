import fs from 'node:fs';
import {dir,work,read,save,hash,input,run} from './ops.mjs';
const n=Number(process.argv[2]),a=read(dir+'/candidate-a.json'),p=a.workspace;
const labels={3:['26-preview-3','27-record-3'],4:['29-preview-4','30-record-4'],5:['32-preview-5','33-record-5'],6:['35-preview-6','36-record-6']};
const source=p+'/.writer/drafts/native-d-two-replay-'+n+'.json';const v=read(source);delete v.output;
const facts={
3:'summary保持雨夜防潮、亲读徐兰一行、借存方向未知、免提约八点半和邀分饭；characters三人位置/所知不变；timeline仍第一天雨夜。ledger O_BOX仍长凳砖毛巾/锁未开，O_BOOK仍林禾暂管/待老邵说明，T_CLAIM partial、T_BLUE pending、OBS_REGISTER原观察不逆改。唯一失效引文是O_BOOK中收好簿子的原句，改用本次实读的借物簿句；不以新措辞推断收存地点。原ledger的抽屉描述属于保留的既有登记，未把控制改字当新位置证据。downstream第4章林禾摊昨晚页、亲手交老邵，第5章簿已带走；第6章无簿新动作。钥匙及纸样无提前转移，from7备忘不入旧章。',
4:'summary仍老邵说明混箱、自有存入，三人开箱，蓝布针法与余料有限核对，纸样用途未定，选择晾修。characters仍只知道现场听到/看到的信息，不升级成排他鉴定；timeline第二天上午。ledger旧簿交老邵、钥匙收回林禾抽屉、纸样留柜台晾放，OBS_BLUE/OBS_REGISTER不被解释覆盖。evidence逐条对照本章原句，只有第3章上游版本已变；本章当前各引文仍成立。downstream第5章工具拧紧和纸样入套，第6章签单接钥匙移箱，承接有效；不新增控制变化。',
5:'summary仍修松螺丝、周梅决定清点、划掉自有工具、钥匙留林禾一夜，约明天十点交箱。characters不扩大信任为全然和好；timeline第二天下午。ledger O_KEY仍林禾布袋抽屉，纸样回晾干木箱，旧簿由老邵带走。evidence对照钥匙放回布袋里一整句，重复里字未复发；本章原字节保持。downstream第6章签单、从布袋倒出递钥匙与搬箱回应约定，没有费用或用途提前决定。旧已修复意见沿用原application，待提交后按当前依赖重核。',
6:'summary仍第三天十点交接、林禾承认误怪伞、缠柄后先拿回、吃面，未来留镇/费用/纸样复制未定。characters老邵未被补写新知，林禾与周梅只有有限和解；timeline第三天十点至午间。ledger箱在周梅矮架、钥匙在其围裙内小钩钥匙圈、纸样随箱，签单林禾，旧簿老邵；T_CLAIM与T_BLUE resolved，R_LISTEN partial、T_PATTERN/T_FUTURE intentional-open保持。evidence逐句对照接钥匙、串圈、费用待问和未定回县；downstream没有第7章，from7候选不能当事实/授权。本章既有工程控制措辞原字节保留。'
};
if(!facts[n])throw Error('bad unit');
let corrected=0;
if(n===3){const e=v.changes.ledger.O_BOOK.evidence[0];if(e.quote!=='林禾收好簿子，把湿抹布拧进水桶，周梅扶着桶沿，免得她连桶一起提起来。')throw Error('Unexpected old anchor');e.quote='林禾收好借物簿，把湿抹布拧进水桶，周梅扶着桶沿，免得她连桶一起提起来。';corrected++;}
const original=read(dir+'/before-candidates-state.json').units[n-1];
if(n>3&&hash(p+'/'+v.draft)!==original.sha256)throw Error('unexpected body change');
const mismatches=[];function scan(x){if(!x||typeof x!=='object')return;if(x.quote&&x.unit){const u=read(dir+'/before-candidates-state.json').units[x.unit-1];if(!fs.readFileSync(p+'/'+u.draft,'utf8').includes(x.quote))mismatches.push(x);}for(const y of Object.values(x))scan(y);}scan(v.changes);if(mismatches.length)throw Error('unreviewed mismatched quotes '+JSON.stringify(mismatches));
const report='审查/D批第'+n+'章重登实读.md';
const readings=[n-1,n,n+1,n+2,n+3].filter((x,i,arr)=>x>=1&&x<=6&&arr.indexOf(x)===i).map(x=>{const u=read(dir+'/before-candidates-state.json').units[x-1];return {unit:x,path:u.draft,sha256:hash(p+'/'+u.draft),basis:x===2?'main第2章完整阅读；区内字节匹配':'本次A区完整正文阅读；区内字节匹配'};});
save(p+'/'+report,'# D批第'+n+'章重登实读\n\nsynthetic acceptance；native-d-two知情模型实际阅读，不是脚本语义证明。原稿、A新稿及相关下游已完整核读。\n\n'+JSON.stringify({old_draft_sha256:original.sha256,current_draft_sha256:hash(p+'/'+v.draft),replay_source_sha256:hash(source),readings,checked_fields:['summary','characters','timeline','ledger','evidence','downstream'],corrected_quote_count:corrected},null,2)+'\n\n'+facts[n]+'\n\n只保留原summary与changes的事实语义；第3章仅一处对象称谓及相应引文变更。版本证据由正式record产生，不手改旧账本或状态。4–6原字节不改。\n');
v.replay_review={reviewer:'native-d-two Codex informed model reading; synthetic acceptance',report,draft_sha256:hash(p+'/'+v.draft),checked_fields:['summary','characters','timeline','ledger','evidence','downstream']};
const file=input('record-'+n,v),opt={entry:'bin/ai-writer.mjs',project:p};
const preview=run(labels[n][0],['record-preview','--input',file,'--revision-token',a.token],opt);save(dir+'/preview-'+n+'-parsed.json',preview);console.log(JSON.stringify({unit:n,preview_ok:preview.ok,findings:preview.findings,changes_keys:Object.keys(preview.changes??{})}));if(!preview.ok)throw Error('Stop preview');
save(dir+'/record-'+n+'-result.json',run(labels[n][1],['record','--input',file,'--revision-token',a.token],opt));
