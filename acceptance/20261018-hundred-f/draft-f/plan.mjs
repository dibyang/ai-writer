import fs from 'node:fs';
import path from 'node:path';
import {session} from '../session-support.mjs';
const s=session('draft-f');
const refs=['设定/作品定位.md','设定/文风.md','设定/权威规则.md','设定/续部人物与场所.md','大纲/F轮104-106现场续纲.md'];
const input={expected_revision:s.state().revision,operation_id:'draft-f-authorized-104-106',author_evidence:s.evidence(),workflow:{stage:'drafting',task:'F轮真实授权内代理分批选择：先已全文连读登记97—103，本进程仅续写104—106并101—106全文复核；不代表作者逐项选择，至106暂停。',authorization:{allowed_actions:['discuss','plan','draft'],draft_range:{from:104,to:106},revise_range:null,stop_conditions:['106停止；末次paused仅discuss/plan且两个范围null','不改已登记101或1—100；本阶段确认旧问题只交正式48—106分支','不启动其他代理/会话，不联网，不提交推送发布']},planning:Object.fromEntries(['positioning','structure','volume','outline'].map(k=>[k,{status:'draft',refs:k==='positioning'?refs.slice(0,2):['大纲/F轮104-106现场续纲.md'],unresolved_ids:[]}]))}};
console.log(JSON.stringify(s.run('workflow-104-106',['workflow','set'],{input,entry:'embedded'}).value));
const plans=[
{unit:104,title:'椅子今天放不下',goal:'当日椅位冲突里不为期限结束补永久人手',change:'老人先离，葛自承担失去当次加份/延误整理的选择，沈不接固定清位；明确今晚私约',beats:['64日晚短电话实际聊103未接追加，双方约65日晚周家饭','65晨原椅占干盒，后架未整，普通位与备餐也冲突','老人先办自己的事；葛临加外带失一份，自己清出当日坐处','陶当班到11实走；沈只有限参与不担日常，葛不续期表'],cast:['沈禾','周砚','葛筠','陶敏','读报老人'],recall_ids:['T_ROUTE_COMMON','T_ROOM_AFTER33','R_SHEN_ZHOU']},
{unit:105,title:'开头划掉以后',goal:'实际撤新稿借别人证明改变的开头，写本人新经历',change:'新页无评仍完成；何自己的菜单劳动有进度，非专职评委',beats:['新纸先写老人/葛替自己作证的开头，实划掉另写本人看球/未接追加','买晚间菜途经打印处，何正在核菜单样与客户份量价格，劳动未完不凭空到账','沈回家自读新页，保留自己的虚荣而非周内心，独立新夹','带纸赴约意愿不等同周答读；旧95半面不动'],cast:['沈禾','何映'],recall_ids:['P_SELF_PAGE_95','T_VOICE_CONSENT','R_SHEN_ZHOU']},
{unit:106,title:'先坐一会儿',goal:'私约允许周不想当场读，承受当日关系后果',change:'新页仍沈持，不靠听读数量换亲密；晚饭与各归真实完成，106停止',beats:['按65日晚周家私约带菜与新页到场，做饭有双方劳动','沈拿纸问，周说今天想说话不想看，沈有失落；递出/收回动作清楚','两人说自己眼下在意并改变当晚安排，非重演输球道歉','沈自带新页归家，账和空工作时段如实留；无公开/同居/新订单结论'],cast:['沈禾','周砚'],recall_ids:['P_SELF_PAGE_95','R_SHEN_ZHOU','T_PAID_WORK']}
];
for(const p of plans){p.arc_id='V14A2';p.setting_refs=refs;p.research_refs=['研究/F轮用户授权与执行范围.md'];p.forbidden=['不解余带与罗私事','不改95旧半面或101正文','不假造到账、全部知情或永久服务','首稿朝3500—3700汉字，不重复解释凑数'];s.write('plan-'+p.unit+'.json',p);console.log(JSON.stringify(s.run('plan-'+p.unit,['plan'],{input:p,entry:'embedded'}).value));}
const outline=s.run('outline-104',['outline','--unit','104'],{entry:'embedded'});s.write('outline-104.json',outline.value);console.log(JSON.stringify(outline.value));
const context=s.run('context-104',['context','--unit','104','--max-chars','120000'],{entry:'embedded'});s.write('context-104.json',context.value);console.log(JSON.stringify({context_keys:Object.keys(context.value),omitted_ids:context.value.omitted_ids,sources:context.value.sources}));
const t=s.run('record-template-104',['record-template','--unit','104','--draft','正文/0104-椅子今天放不下.md'],{entry:'embedded'});s.write('template-104.json',t.value);console.log(JSON.stringify(t.value));
