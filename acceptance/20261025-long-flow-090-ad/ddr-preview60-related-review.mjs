import {outer,log,state,assert} from './c-utils.mjs';
const p=log('ddr-preview60-corrected');assert.equal(p.ok,true);assert.deepEqual(p.findings,[]);
outer('ddr-preview60-related-review.json',{revision:state().revision,ok:p.ok,findings:p.findings,source_hashes:p.source_hashes,related:p.related_unchanged_ledger,judgment:'已核相关未变项：两册仍59各归原主，60女回房看书无新增借还/书签改字；相约已resolved不再预约。练布/小纸/反馈纸没有新起针或新记录，原57结果不抄旧段覆盖；父袋和父纸本章未出场。柜原门与原收讫纸没有新进户观察，电话另记本日有限fact，不将旧56定位抹去；旧价格/用料/本次交付已结不重记。衣只说袖仍认/穿班，无新的拆补或永久效果，旧时间限定历史可保留。现无需改未变条目。',checked_ids:[...p.related_unchanged_ledger.candidates.map(x=>x.id),'P_AD_CABINET_DOOR55','P_AD_CABINET_NOTE55','T_D_CABINET_PHOTOS','F_AD_CABINET_FEE55','F_AD_CABINET_USE56','P_W_COAT']});
console.log(JSON.stringify({ok:true,manual_related_review_saved:true}));
