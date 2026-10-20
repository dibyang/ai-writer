import fs from 'node:fs';import crypto from 'node:crypto';
const v='D:/work/other/ai-writer/acceptance/20261020-long-flow-090-v',w=v+'/scenario/东岸末班船-扩展验证';
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const read=f=>JSON.parse(fs.readFileSync(w+'/'+f,'utf8'));
const old=read('.writer/drafts/v-ar-review-1-6-filled.json'),next=read('.writer/drafts/v-ar-review-1-6-r23-before.json');
if(next.expected_revision!==23||JSON.stringify(old.source_hashes)!==JSON.stringify(next.source_hashes))throw Error('Read versions changed');
for(const [ref,hash]of Object.entries(next.source_hashes))if(sha(fs.readFileSync(w+'/'+ref))!==hash)throw Error('Source drift '+ref);
const evidence=[{unit:4,quote:'今晚六点半能来看看，先量，不一定就能装'},{unit:5,quote:'六点半，我看到了。'},{unit:6,quote:'停航第一天的下午四点'}];
for(const e of evidence){const ref=Object.keys(next.source_hashes)[e.unit-1];if(!fs.readFileSync(w+'/'+ref,'utf8').includes(e.quote))throw Error('Quote missing');}
const input={...next,operation_id:'v-ar-review-1-6-time-addendum-r23',report:'审查/V-A-恢复-0001-0006-连读补记-时间登记问题.md',chapter_functions:old.chapter_functions,comparison:{...old.comparison,limits:old.comparison.limits+' 最终status识别第5章登记summary/timeline误写停航次日晚，正确为停航首日晚；已正式列为未修复意见，正文未改、未开启修订。'},issues:[{id:'V_A_U5_TIME_METADATA',type:'continuity',severity:'minor',confidence:'high',statement:'第5章登记summary及timeline两处停航次日晚误导到停航第二日；正文承接第4章今晚六点半，实际应是停航首日晚（末班船次日晚）。',suggestion:'根核验后决定正式纠正登记的授权与路径。本阶段不改state、不新开修订；续写须读取本问题并保持正确日序，不能由错误标签推造次晨取糕已发生。',evidence}]};
fs.writeFileSync(w+'/.writer/drafts/v-ar-review-1-6-time-addendum.json',JSON.stringify(input,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({revision:next.expected_revision,unchanged_source_hashes:true,issues:input.issues.map(x=>x.id),input_sha256:sha(fs.readFileSync(w+'/.writer/drafts/v-ar-review-1-6-time-addendum.json'))}));
