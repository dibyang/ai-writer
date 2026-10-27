import {outer,log,state} from './c-utils.mjs';
const p=log('ddr-preview59');
outer('ddr-preview59-related-review.json',{ok:p.ok,findings:p.findings,unchanged:p.unchanged,related:p.related_unchanged_ledger,judgment:'已实际检查相关原条目。父记纸/袋仍原位只见折口；课堂两纸/衣/布无新动作，沈在59新增听述母笑夸由characters和新relationship记；不把旧entry的57夜消息知识删除或当作59整段复活。新灯仍原主原桌，无价款变化；当前59新听戏由新fact和characters记，原灯object的57时间限定历史可保留。',checked_ids:['P_AD_FATHER_READING_NOTE58','P_W_CURTAIN_BAG','R_AD_FATHER_READING56','P_AC_PRACTICE_CLOTH','P_AD_NEW_DESK_LAMP54','P_AD_PRACTICE_NOTE52','P_CR_FEEDBACK_PAPER','P_W_COAT'],source_hashes:p.source_hashes,revision:state().revision});
outer('ddr-auxiliary-input-error2.json',{command:'读取context.snapshot.ledger',exit_code:1,error:'TypeError: snapshot中无ledger字段',reason:'辅助只读脚本误认context结构；无文件或状态写入',correction:'先打印实际keys，再读取权威state.snapshot.ledger中的三项；完整输出已在本进程实读',tool_defect:false});
console.log(JSON.stringify({ok:p.ok,findings:p.findings,related_review_saved:true}));
