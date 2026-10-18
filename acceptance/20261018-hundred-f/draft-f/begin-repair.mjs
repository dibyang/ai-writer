import fs from 'node:fs';import path from 'node:path';import {session} from '../session-support.mjs';import {functions,comparison} from './review-data.mjs';
const s=session('draft-f');
const report=`# F-F 101—106首轮登记后完整连读（修前）
六章在106登记后于本进程101、102、103、104、105、106顺序全文展示阅读，均Complete。当前revision396。逐章不同收益、相似结构与保留项见本报告绑定review中的模型手填判断，序列化输入保存在draft-f/review-data.mjs；不是脚本自动文学勾选。

确认问题：104第87行“刚才那把空着的椅子”与此前盒仍占、此后95行才露坐面冲突；读者会误想已有空椅。本阶段最小改为“那把被盒占着的椅子”，不改事件/归属/所知。106两处“店里”把周工作场所叫成店，设定/角色卡明确渡口调度员；应改“站里”，不将其数箱口述当沈亲见，不改职业。

101待核句最终为“摸到家里还剩的半包面”，观察JSON quote_present=false且快照SHA与当前相同，无仍在问题。102修后低头吹汤面自然，勺此前已搁碗边。原1—103本阶段不改。

## 真人语言别扭句
### 真人语言硬问题
104“刚才那把空着的椅子”经具体落地与指代复述两项测试均误导当前空位；106“店里”在角色基线及当面复述中误导职业。其余正常修辞不列硬问题。厨房/纸袋小动作与否定说明偏密为可选风格观察，不以扫词代文学。

结构：101私人索引实试、102亲看输球、103有价交付且未接追加、104葛当日整理/失单老人先离、105实删新开头写本人且何独立劳动、106周不读仍相处；未重复六次许可。105漏水是本日原稿先写后否定，非新增102既成事实。纸在106推至中央仍未交，回夹/包/家动作齐；不登记虚构周接纸。长期经费、旧款、余带、罗私事不收。

本报告保留修前问题。正式104—106保护区处理，尾段实读重登与CAS后再以最终稿完整六章复核，不将本报告伪称最终无问题。
`;
s.write('first-postrecord-review-101-106.md',report);const ref='审查/F-F-101-106首轮连读修前.md';fs.writeFileSync(path.join(s.project,ref),report,{flag:'wx'});
const t=JSON.parse(fs.readFileSync(path.join(s.stage,'review-template-101-106.json')));Object.assign(t,{report:ref,operation_id:'draft-f-101-106-initial-r396',chapter_functions:functions(),comparison});
console.log(s.run('review-101-106-before-fix',['review'],{input:t,entry:'embedded'}).value);
const st=s.state(),workflow={...st.governance,stage:'revision',task:'F批104—106已写；六章实读确认104椅位指代及106两处周工作地点称谓，只在104—106保护区最小修改并逐章实读重登，不改101或1—100，末次暂停。',authorization:{allowed_actions:['discuss','plan','revise'],draft_range:null,revise_range:{from:104,to:106},stop_conditions:['仅修104一处椅指代/106两处店里为站里，105完整核对重登','保护尾段review与CAS后最终101—106全文连读，暂停仅discuss/plan两范围null','不写107、不改旧章候选或101']}};
console.log(s.run('workflow-local-repair',['workflow','set'],{input:{expected_revision:st.revision,operation_id:'draft-f-local-repair-104-106',author_evidence:s.evidence(),workflow},entry:'embedded'}).value);
const r=s.run('revision-begin-local',['revision','begin'],{input:{expected_revision:s.state().revision,owner:'actual-Codex-draft-f-local-confirmed-fixes',from:104,through:106},entry:'embedded'});s.write('revision-local.json',r.value);console.log({id:r.value.id,workspace:r.value.workspace,base_revision:r.value.base_revision});
const b=session('draft-f',{project:r.value.workspace,token:r.value.token});console.log(b.run('branch-doctor',['doctor']).value.ok);
console.log(b.run('branch-rewind-104',['rewind','--from','104','--expected-revision',String(b.state().revision)]).value);
for(const [label,args] of [['branch-outline-104',['outline','--unit','104']],['branch-context-104',['context','--unit','104','--purpose','revision','--max-chars','120000']]]){const v=b.run(label,args);s.write(label+'.json',v.value);console.log({label,ok:v.value.ok});}
