import fs from 'node:fs';import path from 'node:path';import {base,j,save}from './e1-ops.mjs';
const root=j(path.join(base,'e-repaired-first-execution.json')).revision.workspace,i=j(path.join(root,'.writer/drafts/e3-replay-44.json')),p=[];
function set(keys,after){let x=i;for(const k of keys)x=x[k];p.push({path:keys,before:x,after});}
set(['summary'],i.summary.replace('豆干沈留宽条','原两片豆干中沈留三宽条；先吃一条、母见余两条，母回房后再吃半条、余一条半'));
set(['changes','characters','沈禾'],i.changes.characters['沈禾'].replace('宽豆干留口','原两片豆干留三宽条，母出房前吃完一条、母回房后再吃半条，余一条半'));
set(['changes','characters','许蓉女儿'],i.changes.characters['许蓉女儿'].replace('择切芹菜豆干','从原两片豆干切出沈要的三宽条，其余切细，亲见沈先吃一条、后半条留一条半；择切芹菜'));
set(['changes','characters','许蓉'],i.changes.characters['许蓉'].replace('宽豆干沈自要','亲见碟角两宽条、听沈说自要宽的；未见起初切三条或回房后又吃半条'));
set(['changes','timeline_append',0],i.changes.timeline_append[0].replace('切配','从原两片豆干切出三宽条及其余细条'));
set(['changes','timeline_append',1],i.changes.timeline_append[1].replace('两人坐食，','两人坐食，沈先吃完一宽条、留两条，').replace('回房。','回房；沈再吃另一条半，余一条整和半条。'));
const l=i.changes.ledger.T_AC_SHARED_MEAL;
set(['changes','ledger','T_AC_SHARED_MEAL','reader_known'],l.reader_known.replace('留整块和分碟真改变吃法。','留整块和分碟真改变吃法。原两片豆干切三宽条归沈那份，先吃完一条，母见余两条后回房，再吃另一条半，余一条整和半条。'));
set(['changes','ledger','T_AC_SHARED_MEAL','character_known','沈禾'],l.character_known['沈禾'].replace('自己软菜蒜多；','自己软菜蒜多；亲要原两片中切三宽条，先吃一条、母回房后再吃半条余一条半；'));
set(['changes','ledger','T_AC_SHARED_MEAL','character_known','许蓉女儿'],l.character_known['许蓉女儿'].replace('自己可直说偏粉。','自己可直说偏粉。从原两片切三宽条，亲见沈分两次吃一条及半条，余一条半。'));
set(['changes','ledger','T_AC_SHARED_MEAL','character_known','许蓉'],l.character_known['许蓉'].replace('听芋头6元与宽条缘由','听芋头6元与宽条缘由，亲见碟角两条宽豆干但不知起初切三条及回房后再吃半条'));
set(['changes','ledger','T_AC_SHARED_MEAL','evidence'],[...l.evidence,...['从原来留着的第二片边上切出三条','说完把这一半也吃了，碟角另两条还好好留着。','许蓉看见碟角留着两条宽豆干','如今桌上三条宽豆干吃掉一条半，还留一条整的和半条'].map(quote=>({unit:44,quote}))]);
save('e3-delta-44.json',p);console.log(JSON.stringify({unit:44,paths:p.length}));
