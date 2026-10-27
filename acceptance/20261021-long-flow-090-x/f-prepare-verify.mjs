import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
const X=path.dirname(new URL(import.meta.url).pathname.replace(/^\/(\w:)/,'$1'));
const configs={
 'f-verify-u5':{id:'V_A_U5_TIME_METADATA',revision:171,previous:'f-review-current-36',reason:'本次f-current-full完整重读当前1—36章后的复核，不是新修复。4章清晨、5章当天18:30量柜、6章明确回切同日下午，当前摘要/时间线保持原tracking修复的一致性。保留原application与commit，不改正文、不新增作者决定。'},
 'f-verify-f19':{id:'I_F19_TITLE_TIME',revision:172,previous:'f-verify-u5',reason:'本次f-current-full当前1—36章全读后复核。19章正文标题提前的一个半钟头，与原16点改14:30、原18:30交回改17点均为90分钟一致；课程受控100分钟是另一事项。保留旧文件路径与原application/commit，不声称F做第二次标题修复。'},
 'f-verify-dr36':{id:'I_X_DR36_BOOK_KNOWLEDGE',revision:173,previous:'f-verify-f19',reason:'本次完整全读与当前追踪对照的复核，不是新修复。35真实同行姑娘12元自购、沈18未买20未花；36母亲和沈父均已听见结果，沈父看的是手机红花图而非实书。E后当前ledger保留36已知，未退回35。保留原tracking application和commit，不新增apply或改正文。'}
};
const label=process.argv[2];const c=configs[label];assert(c,'unknown label');
const prev=JSON.parse(fs.readFileSync(path.join(X,'cli-logs',c.previous,'result.json'),'utf8'));assert.equal(prev.exit_code,0);
const s=JSON.parse(fs.readFileSync(path.join(X,'scenario/东岸末班船-再扩展验证/.writer/state.json'),'utf8'));assert.equal(s.revision,c.revision);
const ref=JSON.parse(fs.readFileSync(path.join(X,'cli-logs/f-review-current-36/stdout.raw.txt'),'utf8')).ref;
const input={expected_revision:c.revision,operation_id:label+'-current-full',id:c.id,review_ref:ref,reviewer:'X-F model current-full recheck',conclusion:'resolved',reason:c.reason};
const file=path.join(X,label+'.json');assert(!fs.existsSync(file));fs.writeFileSync(file,JSON.stringify(input,null,2)+'\n','utf8');console.log(file);
