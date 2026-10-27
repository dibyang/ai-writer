import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
const X=path.dirname(fileURLToPath(import.meta.url));
const P=path.join(X,'scenario','东岸末班船-再扩展验证');
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const sha=f=>hash(fs.readFileSync(path.join(P,f)));
const read=f=>JSON.parse(fs.readFileSync(path.join(P,f),'utf8'));
const write=(f,o)=>{fs.mkdirSync(path.dirname(path.join(P,f)),{recursive:true});fs.writeFileSync(path.join(P,f),JSON.stringify(o,null,2)+'\n',{encoding:'utf8',flag:'wx'});};
const state=read('.writer/state.json');
const parts31=['01-c-v1.md','01b-c-v1.md','02-c-v2.md','03-c-v2.md','04-c-v2.md','05-c-v2.md'].map(x=>'分段/0031/'+x);
const han=f=>(fs.readFileSync(path.join(P,f),'utf8').replace(/^#.*$/gm,'').match(/\p{Script=Han}/gu)||[]).length;
if(process.argv[2]==='assemble31-final'){
 const parts=parts31.map(f=>({path:f,sha256:sha(f)}));
 const counts=parts31.map(f=>({file:f,han:han(f),sha256:sha(f)}));
 write('.writer/c-inputs/assemble31-final.json',{unit:31,expected_revision:state.revision,draft:'正文/0031-门外留一张纸-c-v2.md',parts,separator:'\n\n'});
 console.log(JSON.stringify({revision:state.revision,counts,total:counts.reduce((a,x)=>a+x.han,0)},null,2));
}else if(process.argv[2]==='prepare32'){
 const evidence=read('.writer/c-inputs/workflow-trial31.json').author_evidence;
 const planning=structuredClone(state.governance.planning);planning.outline={status:'draft',refs:[],unresolved_ids:['32写前真实plan；33尚未创建']};
 write('.writer/c-inputs/workflow-outline32.json',{expected_revision:state.revision,operation_id:'x-c-outline32-first',author_evidence:evidence,workflow:{stage:'outline',task:'31真实登记后规划32；本首次只写32前两段3000—4500汉字即停，不合章不登记；同ID再恢复32/33。',authorization:{allowed_actions:['discuss','plan'],draft_range:null,revise_range:null,stop_conditions:['先plan32再采用真实引用','本次32两段首停，不建33/34','不把32未登记事件进state']},planning}});
 write('.writer/c-inputs/plan32.json',{unit:32,title:'茶慢慢凉下来',arc_id:'A12',goal:'周岸真正到廖家坐下喝茶，两人从工作熟人进入能够闲坐的朋友关系，在留出的半下午各有话说、也有不说话的自在。',change:'完整章拟周廖实际相聚到近四点，各回工作；首次只完成到家落座与最初看花交流，留后半下午未完，不登记。',beats:['接31末周沿巷走近，两点到廖家/两条毛巾门，放自带水杯、坐家椅、廖开茶，私人相约终于实际发生','从花叶差别与各自养花兴趣聊天，周只看不修，廖有自己的记忆和取舍，茶渐凉而人还坐着；首次停在此段末','后续从各自吃饭/住处/空闲说起，有不同喜好，余下交流需实际写','临四点看时间、收杯、告别，周取自己的袋/杯，廖准备晚市','完整章收在各自回程及工作重启的有限后果，不强结其他两链'],cast:['周岸','面摊主'],setting_refs:['设定/人物与声音.md','大纲/扩大骨架-X.md','大纲/X-C近期执行纲-31-33.md'],research_refs:[],recall_ids:['T_X_TEA_AFTER_WORK','T_X_COAT_DAILY','T_X_BOOK_COMPANY'],forbidden:['本首次仅前两段3000—4500字，不赶完32/33，不创建34','不修花架抵茶，不补造父辈秘密，不提前书约','未登记32不进入state，原24和原观察三字段不变','到期为章号非故事日期；周六8:30另一门仍未来']});
 console.log(JSON.stringify({revision:state.revision,prepared:'outline32/plan32'}));
}else if(process.argv[2]==='adopt32'){
 const evidence=read('.writer/c-inputs/workflow-trial31.json').author_evidence;
 const planning=structuredClone(state.governance.planning);planning.outline={status:'adopted',refs:['大纲/单元/0031.json','大纲/单元/0032.json','大纲/X-C近期执行纲-31-33.md'],unresolved_ids:['33同ID恢复完成32后再规划','32前两段仅中间稿，不进事实','茶本章完整后才核兑现；衣33/书35未结']};
 write('.writer/c-inputs/workflow-trial32.json',{expected_revision:state.revision,operation_id:'x-c-trial32-first',author_evidence:evidence,workflow:{stage:'trial',task:'X-C首次：31已登记，仅写32前约两段3000—4500汉字后正常退出；保留有限31—33授权供根同ID恢复32/33，32未完不assemble/record/入state；33完成后当前28—33完整连读正式review；不建34。',authorization:{allowed_actions:['discuss','plan','draft'],draft_range:{from:31,to:33},revise_range:null,stop_conditions:['本首次32两段真实中途停点正常退出，不赶完三章','32未登记不入state，原模板/来源/段SHA全部保存','同ID恢复32/33后28—33正式复盘；34未获本轮授权','禁代理/源码/原作品/旧封存修改/导出/提交推送']},planning}});
 console.log(JSON.stringify({revision:state.revision,prepared:'trial32'}));
}else throw Error('unknown operation');
