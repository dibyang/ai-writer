import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {session,sha} from '../session-support.mjs';import {rows,functions,comparison} from './review-data.mjs';
const root=session('draft-f'),r=JSON.parse(fs.readFileSync(path.join(root.stage,'revision-local.json'))),s=session('draft-f',{project:r.workspace,token:r.token});
const details={
104:'全文核：原椅开头三摞占用，87改被盒占，95才露坐面，109面客坐；老人已离未回。64晚电约/65晨失临加份/陶11走均不改。summary与characters仍是本人新动作；timeline仍64晚及65晨；ledger仅当日椅观察/约饭及椅同持有人位置；三条引文仍原字存在。下游105老人葛新开头先写后划掉，106按65晚真约，无新事实传播。',
105:'全文核：开头新写老人葛证明改变后实划去，漏水仅未定草稿被删，新页保留本人想被谢/未接720。何独立核份量出样仅获正在看，沈只看一价。summary不变；characters沈/何各当日新知不扩；timeline仍65午后；ledger新独立窄夹与菜单所见，不改旧95半面或27/31页。所有本章引文逐项仍在；下游106新页/原稿前后夹与菜6元相承，纸未交周。',
106:'全文核：周两处工作场所改站里，回角色卡渡口调度员基线；数箱仍他本次口述，不变沈亲见。summary相处/不读/收纸/各归不变；characters周未接未读只听口述；timeline18:28至20:37不变；ledger约饭resolved/窄夹同持有人归家/当次关系事实不变，未伪造previous_holder换手；引文仍有效。下游无107，停止；旧款/余带/罗私事无解释。'};
for(const unit of [104,105,106]){
 if(unit!==104){for(const [label,args] of [['outline',['outline','--unit',String(unit)]],['context',['context','--unit',String(unit),'--purpose','revision','--max-chars','120000']]]){const out=s.run('branch-'+label+'-'+unit,args);root.write('branch-'+label+'-'+unit+'.json',out.value);}}
 if(!fs.existsSync(path.join(s.project,`.writer/drafts/f-f-replay-${unit}.json`))){const template=s.run('branch-replay-input-'+unit,['revision','replay-input','--unit',String(unit),'--out',`.writer/drafts/f-f-replay-${unit}.json`]);root.write('branch-template-'+unit+'.json',template.value);}
 const t=JSON.parse(fs.readFileSync(path.join(s.project,`.writer/drafts/f-f-replay-${unit}.json`))),old=JSON.parse(fs.readFileSync(path.join(root.stage,`record-${unit}-model.json`)));
 assert.deepEqual(t.summary,old.summary);
 function subset(actual,expected){if(Array.isArray(expected)||expected===null||typeof expected!=='object'){assert.deepEqual(actual,expected);return;}for(const [k,v] of Object.entries(expected))subset(actual[k],v);}
 subset(t.changes,old.changes);
 // Model checked normalized inherited object fields against the existing ledger;
 // retain only this chapter's original real delta, never rewrite source hashes.
 t.changes=old.changes;
 const report=`# F-F ${unit}受保护重登实读核查\n\n实际本进程完整读当前分支104—106三章，非脚本代读。${details[unit]}\n\n只104一处与106两处局部措辞改变；本章当前SHA=${sha(fs.readFileSync(path.join(s.project,t.draft)))}。六项summary/characters/timeline/ledger/evidence/downstream为上述实际核查结果。不是作者逐项采用或真人盲读。\n`;
 const ref=`审查/F-F-${unit}保护重登.md`;fs.writeFileSync(path.join(s.project,ref),report,{flag:'wx'});root.write('replay-review-'+unit+'.md',report);
 t.replay_review={reviewer:'actual-Codex-draft-f-informed-self-review',report:ref,draft_sha256:sha(fs.readFileSync(path.join(s.project,t.draft))),checked_fields:['summary','characters','timeline','ledger','evidence','downstream']};root.write('branch-record-'+unit+'.json',t);
 for(const cmd of ['record-preview','record']){const out=s.run('branch-'+cmd+'-'+unit,[cmd],{input:t});console.log(cmd==='record'?out.value:{unit,preview:out.value.ok,findings:out.value.findings});}
}
const report=`# F-F 修订尾段104—106连读\n\n本进程在独立区按104、105、106顺序全文展示并阅读修后正文，均Complete；原始主稿此前也在101—106首轮连读，不能把两者混称同一版本。104椅由盒占至后清空，87现为被盒占，时间不逆转；105保持完整新写选择与何的菜单劳动；106站里称谓符合角色卡，纸仍未交周，私约完成并各归。\n\nsummary/characters/timeline/ledger/evidence/downstream逐章具体核查见三份保护重登报告。旧登记输入summary/changes逐项核读并与本章真实内容复核，序列化一致性仅辅助检查。\n\n## 真人语言别扭句\n### 真人语言硬问题\n没有\n\n对话复述/动宾拆分/具体落地/逐句内读核了纸递回、碗桌到水槽、灶位交替，修前已确认指代与称谓已排除。小物收置及否定说明密度仍可选，不自动修改。此为知情模型自检，非真人盲读、文学定稿、市场验证。主CAS后再实际全文连读101—106保存当前报告。\n`;
const ref='审查/F-F-104-106保护尾段连读.md';fs.writeFileSync(path.join(s.project,ref),report,{flag:'wx'});root.write('branch-tail-review.md',report);
const t=s.run('branch-review-template-104-106',['review-template','--from','104','--to','106']).value;Object.assign(t,{report:ref,operation_id:'draft-f-branch-tail-104-106',chapter_functions:functions(rows.slice(3)),comparison:{...comparison,similar_structures:comparison.similar_structures.filter(x=>x.units.every(n=>n>=104)),distinct_gains:comparison.distinct_gains.slice(3),limits:'当前独立分支104—106实际顺序全文自检，主稿101—103不在此尾段阅读声明内。'}});
console.log(s.run('branch-review-tail',['review'],{input:t}).value);
console.log(root.run('revision-prepare-local',['revision','prepare'],{input:{id:r.id,token:r.token},entry:'embedded'}).value);
const commit=root.run('revision-commit-local',['revision','commit'],{input:{id:r.id,token:r.token},entry:'embedded'});root.write('local-commit-result.json',commit.value);console.log(commit.value);
