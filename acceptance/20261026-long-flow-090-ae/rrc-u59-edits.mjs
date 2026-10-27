import fs from 'node:fs';import path from 'node:path';import {fileURLToPath} from 'node:url';
const A=path.dirname(fileURLToPath(import.meta.url)),x=JSON.parse(fs.readFileSync(path.join(A,'r-resume1-recovery-u59-replay-original.json'))),replacements=[];
function change(p,fn){let v=x;for(const k of p)v=v[k];const after=fn(v);if(after===v)throw Error('no change '+p);replacements.push({path:p,before:v,after});}
change(['summary'],s=>s.replace('晚15分钟','晚20分钟').replace('16:45到','16:50到').replace('17:11收书，沈约17:15前走洗头','17:11收书（同坐约21分钟、口语二十来分钟），沈随后在原17:15上限前离开去洗头'));
change(['changes','characters','沈禾'],s=>s.replace('先独看15分钟再与女相见半小时','先独看20分钟再与女相见约21分钟（二十来分钟）'));
change(['changes','characters','老何'],s=>s.replace('新灯72价格','新灯74价格'));
change(['changes','characters','许蓉女儿'],s=>s.replace('晚15分','晚20分').replace('16:45赴约','16:50赴约').replace('母新灯72','母新灯74'));
change(['changes','timeline_append',0],s=>s.replace('16:45','16:50'));
change(['changes','timeline_append',1],s=>s.replace('16:30—16:45','16:30—16:50'));
change(['changes','timeline_append',2],s=>s.replace('16:45—17:11','16:50—17:11（约21分钟，口语二十来分钟）'));
change(['changes','timeline_append',3],s=>s.replace('收书约17:15前离开岔口分别','收书随后起身，在原17:15上限前离开；到岔口分别（未给岔口另标精确时刻）'));
change(['changes','ledger','T_AD_BOOK_MEET59','reader_known'],s=>s.replace('晚15分','晚20分').replace('16:45到','16:50到').replace('实际交流半小时','实际同坐约21分钟（二十来分钟）'));
change(['changes','ledger','T_AD_BOOK_MEET59','evidence',0,'quote'],s=>s.replace('四点四十五','四点五十'));
fs.writeFileSync(path.join(A,'r-resume1-recovery-u59-replay-edits.json'),JSON.stringify({replacements},null,2)+'\n',{flag:'wx'});console.log({fields:replacements.length});
