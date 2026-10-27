import path from 'node:path';import{base,j,save}from './e1-ops.mjs';const root=j(path.join(base,'e-second-execution.json')).revision.workspace,i=j(path.join(root,'.writer/drafts/e4-replay-46.json')),l=i.changes.ledger.T_AC_SHARED_MEAL,p=[];const set=(keys,after)=>{let x=i;for(const k of keys)x=x[k];p.push({path:keys,before:x,after});};
set(['changes','ledger','T_AC_SHARED_MEAL','reader_known'],l.reader_known+' 原两片豆干留三宽条，44沈吃一条半、45女夜吃余一条半的当前事实保持；46女“我都吃了”只传已吃净，不生出新豆干或剩量。');
set(['changes','ledger','T_AC_SHARED_MEAL','character_known','沈禾'],l.character_known['沈禾']+' 保留亲见原三宽条及自己吃一条半，45已实告父三条；此夜才文字知女留的菜已吃净。');
set(['changes','ledger','T_AC_SHARED_MEAL','character_known','许蓉女儿'],l.character_known['许蓉女儿']+' 自知原三宽条余一整条和半条在45夜已吃净，此夜实告沈菜都吃了。');
set(['changes','ledger','T_AC_SHARED_MEAL','character_known','沈成林'],l.character_known['沈成林']+' 保留45听女实述三宽条并问三条够否的知识；不知道女友家夜吃净菜现场。');save('e4-delta-46.json',p);console.log(JSON.stringify({unit:46,paths:p.length,body_changed:false}));
