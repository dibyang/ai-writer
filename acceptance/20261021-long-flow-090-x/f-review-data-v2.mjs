// Corrected report anchors, with the original draft data preserved.
import {rows as original} from './f-review-data.mjs';
export const rows=structuredClone(original);
const corrections=[[4,0,'昨夜自己说了少蒸两笼'],[11,4,'那我也告诉你哪天才有空。'],[18,4,'她索性放下手机，让它从头唱'],[23,4,'我说的是洗。吃完我总得洗。']];
for(const [unit,index,quote] of corrections)rows.find(r=>r[0]===unit)[2][index]=quote;
