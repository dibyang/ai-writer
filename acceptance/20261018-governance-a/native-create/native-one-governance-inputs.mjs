import fs from 'node:fs';
const base='acceptance/20261018-governance-a';
const initial=JSON.parse(fs.readFileSync(`${base}/commands/native-one-workflow-initial/stdout.raw.txt`,'utf8'));
const evidence=JSON.parse(fs.readFileSync(`${base}/native-create/native-one-author-evidence.json`,'utf8'));
const save=(name,obj)=>fs.writeFileSync(`${base}/native-create/native-one-${name}-input.json`,JSON.stringify(obj,null,2)+'\n');
const workflow=structuredClone(initial.workflow);
workflow.stage='trial';
workflow.task='仅试写第1至6章；第3、6章后实读复盘；六章后暂停正文，先讨论全书总纲';
workflow.authorization={allowed_actions:['discuss','plan','draft'],draft_range:{from:1,to:6},revise_range:null,stop_conditions:['第3章后暂停推进并滚动实读第1—3章','第6章后滚动实读第1—6章并复盘','第6章结束后正式转 structure，仅 discuss/plan，正文和修订范围均 null；不准备第7章细纲、不写第7章']};
workflow.planning={
 positioning:{status:'draft',refs:['设定/作品定位.md','设定/文风.md','设定/人物.md'],unresolved_ids:['定位草案待作者复盘采纳']},
 structure:{status:'draft',refs:['大纲/全书大纲.md'],unresolved_ids:['全书终局','全书篇幅','后续卷数'],reason:'作者仅要求先建简洁骨架，六章后才讨论全书总纲；草案未获整体采纳'},
 volume:{status:'draft',refs:['大纲/分卷/V1.json'],unresolved_ids:['试写卷契约待复盘采纳']},
 outline:{status:'draft',refs:[],unresolved_ids:['仅逐章生成1—6章细纲；第7章不准备']}
};
save('trial',{expected_revision:1,operation_id:'native-one-trial-001',author_evidence:{...evidence,quote:'本轮仅授权试写第1至6章，每章400–700正文汉字；六章后暂停正文并复盘，转为讨论全书总纲，不写第7章。'},workflow});
const decisions=[
 {name:'sect',quote:'宗门方向已选青岚宗，只确认这个方向，不确认经名、住舍人数和作息数字',decision:{id:'D_SECT',topic:'宗门方向',status:'confirmed',options:['青岚宗方向'],adopted_items:['青岚宗方向'],excluded_items:[],unresolved_items:['经名','住舍人数','作息数字'],effective_range:{from:1,to:null}}},
 {name:'craft',quote:'技艺路线已选炼器先行',decision:{id:'D_CRAFT',topic:'技艺路线',status:'confirmed',options:['炼器先行'],adopted_items:['炼器先行'],excluded_items:[],unresolved_items:[],effective_range:{from:1,to:null}}},
 {name:'first-item',quote:'首件法器仍未选，小盾仅推荐。',decision:{id:'D_FIRST_ITEM',topic:'首件法器',status:'candidate',options:['小盾（仅推荐）'],adopted_items:[],excluded_items:[],unresolved_items:['首件法器仍未选','小盾仅推荐'],effective_range:{from:1,to:null}}}
];
decisions.forEach((d,i)=>save(d.name,{expected_revision:2+i,operation_id:`native-one-decision-${d.name}-001`,author_evidence:{...evidence,quote:d.quote},decision:d.decision}));
console.log('准备1份 trial 和3份逐项决策输入；未执行产品写操作。');
