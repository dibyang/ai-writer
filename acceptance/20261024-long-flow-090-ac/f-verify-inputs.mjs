import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';import assert from 'node:assert/strict';import {fileURLToPath} from 'node:url';
const base=path.dirname(fileURLToPath(import.meta.url)),project=path.join(base,'scenario/东岸末班船-48章独立验证'),read=f=>JSON.parse(fs.readFileSync(f,'utf8')),sha=b=>crypto.createHash('sha256').update(b).digest('hex'),save=(f,j)=>fs.writeFileSync(f,JSON.stringify(j,null,2)+'\n',{flag:'wx'});
const list=read(path.join(base,'cli-logs/fresume-postreview-issues/stdout.txt')),state=read(path.join(project,'.writer/state.json')),review=read(path.join(base,'cli-logs/fresume-full-review/stdout.txt'));
assert.equal(state.revision,255);assert.equal(list.revision,255);assert.equal(review.ok,true);assert.deepEqual(review.coverage,[1,48]);
const reviewer='Codex F同原生ID 01a1703f-5d48-72e3-8fe2-b12b202fd72c；当前全48章276页知情模型实读';
const reasons={
 V_A_U5_TIME_METADATA:'当前全48章276页实读后复核。4章第二天5:20是停航首日；5章同日18:30先量；6章明确停航第一天下午四点回切。当前4/5 summary及journal timeline已写首日、6保留同日下午，首程取证ffirst-time-4-6.json且680项恢复/读后对比均未变。原application是tracking，正文同字节正确；保留原commit 3ec56fe0-3fbc-4bfe-9cb1-2253bdf0db68，F没有第二次修复或作者采纳。',
 I_F19_TITLE_TIME:'当前完整19首行提前的一个半钟头；原16点改14:30与原18:30交班改17均前移90分钟，16点旁白已坐一个半小时仍余一小时。历史文件名不变不等于正文标题未修。原application commit 2391c67a-1aac-4232-8351-c35e357de154对应当前正文仍同字节；F仅用当前全48章有效报告重新复核，不重造改稿。',
 I_X_DR36_BOOK_KNOWLEDGE:'原问题是36书约链家人知情追踪未随正文更新，原application tracking commit 4940f163-50c0-4289-a95d-a7af0daa030f保留。E后35/36价格从12正式改14，因此不能复用旧12元报告：本次35p3/p5真实报价/付款14，36p1女亲告母14和沈18未买，p2沈亲告父14并后给手机图。当前36 journal及T_X_BOOK_COMPANY.character_known明确许蓉36亲同女看花册/听14与18未买、沈父36亲听沈说14/18并看照片而非实体；没有退回35末未知。旧8册/沈20未花仍分开。当前全48章报告绑定全部新正文及依赖，原追踪修复仍解决，F不apply第二次。',
 I_AC_B_42_GLASSES_TARGET:'本次完整42p7先拿遥控认屏幕字，再摸两回上衣袋找眼镜；眼镜领口，沈叫低头后父看见并取下戴好，动作目标是眼镜。当前42正文与原application commit 79841afd-89d0-4193-a8ee-090f89ff6d5f修后同字节；E改变邻章和依赖所以用当前全48报告重新核，原真实提交/采纳不变。',
 I_AC_B_42_TYPO_KONGPA:'本次完整42p2实读男人道那恐怕还得叫他去；原缺字已保留修正，且周未据此自动约上门。42仍是原application commit 79841afd-89d0-4193-a8ee-090f89ff6d5f修后正文，当前全48报告覆盖E后依赖。只追加复核，不冒充F又补一字。',
 I_AC_C45_MEAL_DISH:'当前42p5—6留小半盒饭及浅碟菜，43父文字碟好拿/饭已热吃，45p6眼前一只小饭盒倒扣、装菜小碟已空；女未由空物补父中午过程。当前45 journal.characters沈禾明确亲见旧饭盒和菜碟已空。E把豆干转述改三条及女夜吃1.5，45整章SHA已不同于原application，器物段仍正确，不能只比整章hash当未核。本次全48当前报告覆盖42/43/45及后文46父小饭盒与沈自厚盒分沥。保留原实际commit 8d1da1d6-f999-4c6d-bb03-ca91f958434a，原修复目标仅45、42/43参考章及事后acknowledge历史不变；F不新采纳或伪造第二次实改。'
};
const ids=Object.keys(reasons);assert.deepEqual(list.issues.filter(x=>x.effective_status==='needs-recheck').map(x=>x.id),ids);
save(path.join(base,'f-old-issues-baseline.json'),list);
const comparison=[];
for(const [i,id]of ids.entries()){
 const item=list.issues.find(x=>x.id===id),app=item.application;
 const c=fs.readFileSync(path.join(project,app.commit_binding.ref));assert.equal(sha(c),app.commit_binding.sha256);
 const current=item.evidence.map(e=>{const u=state.units.find(x=>x.unit===e.unit);return {unit:e.unit,draft:u.draft,current_sha256:u.sha256,current_contains_original_evidence:fs.readFileSync(path.join(project,u.draft),'utf8').includes(e.quote)};});
 comparison.push({id,original_application:app,original_application_sha256:sha(JSON.stringify(app)),original_resolution_sha256:sha(JSON.stringify(item.resolution)),original_history:item.history,original_verification:item.verification,current_evidence_versions:current,judgment:'still-resolved',reason:reasons[id],new_review_ref:review.ref});
 save(path.join(base,`f-verify-${i+1}.json`),{expected_revision:255+i,operation_id:`f-current-reverify-${i+1}-r${255+i}`,id,review_ref:review.ref,reviewer,conclusion:'resolved',reason:reasons[id]});
}
const t=read(path.join(base,'ffirst-time-4-6.json'));for(const x of t)assert.equal(x.summary,state.units.find(u=>u.unit===x.unit).summary);
save(path.join(base,'f-old-issues-current-comparison.json'),{at:new Date().toISOString(),baseline_revision:255,new_review_ref:review.ref,review_range:[1,48],comparison,current_book_knowledge:state.snapshot.ledger.T_X_BOOK_COMPANY.character_known,tracking_time_summaries_equal_first_read:true,open_optional_preserved:list.issues.filter(x=>x.effective_status==='open').map(x=>x.id),limits:'Semantic conclusions authored by model after actual reading; script only carries them into immutable new verify inputs. No resolve/apply/acknowledge or new repair.'});
process.stdout.write(JSON.stringify({ok:true,revision:255,new_review_ref:review.ref,verification_inputs:ids.map((id,i)=>({id,input:`f-verify-${i+1}.json`,expected_revision:255+i})),optional_open:13},null,2)+'\n');
