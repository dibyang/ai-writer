import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import crypto from 'node:crypto';import {spawnSync} from 'node:child_process';import {fileURLToPath} from 'node:url';
const base=path.dirname(fileURLToPath(import.meta.url)),root=path.resolve(base,'../..'),work=path.join(base,'scenario','雨棚后的灯'),cli=path.join(root,'bin/ai-writer.mjs'),capture=path.join(base,'run.mjs');
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
function command(label,args){const r=spawnSync(process.execPath,[capture,label,process.execPath,cli,...args],{cwd:root,encoding:'utf8',windowsHide:true,timeout:120000});assert.equal(r.status,0,r.stdout+'\n'+r.stderr);return JSON.parse(fs.readFileSync(path.join(base,'commands',label,'stdout.raw.txt')));}
function write(ref,text){const file=path.join(work,ref);fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,typeof text==='string'?text:JSON.stringify(text,null,2)+'\n');return file;}
function input(name,value){const file=path.join(base,name+'.json');fs.writeFileSync(file,JSON.stringify(value,null,2)+'\n',{flag:'wx'});return file;}
command('init',['init','--path',work,'--kind','novel','--mode','long','--title','雨棚后的灯']);
write('研究/本轮验证范围.md','# 独立合成验证授权\n\n本轮只在新建的《雨棚后的灯》验证作品内规划十二章四卷，写前两卷六章。其中第一、四章分段创作并合章实读；允许修复该验证作品及工具在实跑中暴露的问题。完成六章后暂停正文并导出草稿。允许保存和恢复本轮Codex会话、生成本地记录。不修改任何现有作品，不提交、推送或发布。\n\n这是代理将本次用户测试授权落实到独立样例的范围声明，不冒充用户逐条指定了虚构人物和情节。\n');
write('设定/权威规则.md','# 权威规则\n\n故事完全虚构，当代南埠老街。林照回乡帮助旧露天放映场办一场小型放映，何岚借出雨棚，许舟帮忙修补旧幕布，周伯保留旧节目单。人物靠交流和实际劳动推进；不引入凶案、阴谋、失忆或超自然力量。\n\n旧节目单背面的三格方框是可以改变解释、不能改变观察的线索；第一章只记录三格，第四章通过周伯当面说明及旧字样逐项核对，不能让未在场的何岚或许舟自动知道。旧幕布和节目单的保管、交接以正文为准。人物不知道章号、账本ID或作者的未选路线。\n\n前六章兑现筹备与小范围放映的阶段承诺；旧片完整来历留给后两卷，不在本轮提前编造或揭晓。技术细节只写常识性外观与行动，不借虚构专业结论推动因果。\n');
write('设定/文风.md','# 文风\n\n近距离第三人称，以林照所见为主；朴素、温和但不把普通生活磨成美句。保留雨、旧布、灯影等感知，篇幅来自行动及人物各自的顾虑。何岚说话务实，会算自家店关门的损失；许舟急着证明自己，愿意干活但不替长辈解释回忆；周伯会避谈欠下的承诺，也关心自己的材料被弄坏。允许安静结尾，不强迫钩子。不同章的选择与结果不能只是反复拿表、核表、再查表。\n');
write('设定/全书大纲.md','# 全书骨架（计划，不是已发生事实）\n\n十二章四卷。第一卷1—3章：借雨棚、找幕布、重新召集旧街坊，明确各人愿意付出的东西。第二卷4—6章：理解节目单三格、补好幕布并办一次有限放映，兑现一个小承诺，旧片来历仍留白。第三卷7—9章：若获后续授权再讨论旧片来历与外出寻访，当前不细化，不写正文。第四卷10—12章：考虑长期借场和邻里关系的代价，结局细节待下一轮作者选择。\n\n本轮写1—6章后暂停。未来卷纲不进入事实账本。\n');
write('研究/场地备忘.md','# 虚构场地备忘\n\n何岚的小店北侧雨棚、南埠渡口候船亭及周伯住处是不同地点。借到雨棚不等于一直可以用，货架要每晚推回店里；渡口亭子借用只谈有限场次。\n\n'+Array.from({length:25},(_,i)=>`备忘${i+1}：候选布置图仅用于本轮讨论，不证明已经搬运、修补或得到他人承诺。`).join('\n')+'\n');
const state=()=>JSON.parse(fs.readFileSync(path.join(work,'.writer/state.json')));
const evidence={local_source:'研究/本轮验证范围.md',source_sha256:sha(fs.readFileSync(path.join(work,'研究/本轮验证范围.md'))),quote:'写前两卷六章',locator:'synthetic-scope-for-user-test',recorded_by:'Codex Q verification'};
const current=command('workflow-show',['workflow','show','--project',work]).workflow;
const workflow={...current,stage:'trial',task:'独立验证前两卷六章，第一和第四章分段合章，六章后暂停',authorization:{allowed_actions:['discuss','plan','draft'],draft_range:{from:1,to:6},revise_range:null,stop_conditions:['完成第六章后暂停正文','未选路线不得写入已发生事实']}};
command('workflow-set',['workflow','set','--project',work,'--input',input('workflow-input',{expected_revision:state().revision,operation_id:'q-workflow-1',author_evidence:evidence,workflow})]);
for(let v=1;v<=4;v++){const start=(v-1)*3+1,end=v*3;command('volume-'+v,['volume','--project',work,'--input',input('volume-'+v,{id:'V'+v,title:['借一个地方','把灯挂起来','尚待讨论的旧片','尚待讨论的长约'][v-1],start,end,promises:v===1?['确认一次有限放映的筹备条件']:v===2?['核对三格的意义并完成一次有限放映']:['未来骨架，未授权正文'],constraints:['人物知情与物品交接由正文确定'],reserved:['旧片完整来历'],arcs:[{id:'A'+v,start,end,goal:v<3?'让筹备改变人物可行行动':'未来计划',payoff:v===2?'兑现小范围放映':v===1?'确认下一步筹备条件':'未定',forbidden:['不揭晓旧片完整来历']}]})]);}
const plans=[
{unit:1,title:'借来的雨棚',goal:'为试映借到一个可用的地方',change:'从独自收拾变成有边界的合作，留住旧节目单',beats:['林照与何岚协商雨棚使用时间并承担搬回货架的责任','许舟帮忙搬货，旧幕布留在何岚处晾干，尚未交给他修补','周伯把旧节目单交给林照，背面只有三格方框可观察，含义未明'],cast:['林照','何岚','许舟','周伯'],forbidden:['不解释三格含义','何岚不掌握周伯尚未说出的来历']},
{unit:2,title:'还没拆的纸套',goal:'确认能借用的材料与愿意出力的人',change:'接受周伯只借节目单不借旧片原件的限制',beats:['林照带节目单登门，周伯同意以后带来核对字样','许舟承认不懂修补先学习，放弃替长辈许诺'],cast:['林照','周伯','许舟']},
{unit:3,title:'渡口的空椅',goal:'确认雨棚放不下的人怎样参加',change:'林照放弃一次接纳所有人的方案，保留只办一场小放映',beats:['林照和何岚实看候船亭而非凭图定场地','何岚拒绝连续多晚闭店，林照接受有限场次并约周伯下次核对'],cast:['林照','何岚','周伯']},
{unit:4,title:'听见停顿',goal:'让三格的含义有当面可核的来历并推进修补',change:'理解旧时三处放映而不偷解旧片来源，将幕布实际交给许舟',beats:['林照带原节目单与周伯逐项辨认校门、雨棚和渡口三格的旧字样','何岚离场后周伯才讲三格的旧用途，许舟仍未听见说明','林照把晾干的幕布从何岚处取来并交到许舟手里，约好补完归还'],cast:['林照','周伯','何岚','许舟'],recall_ids:['O_GRID','O_PROGRAM','T_GRID']},
{unit:5,title:'帘上那一针',goal:'把借物承诺变成可用的幕布',change:'许舟承认补痕能看见，何岚接受真实修补结果',beats:['许舟完成补缝后将幕布交还何岚保管','林照当面告诉何岚和许舟三格含义，区分转述与亲见原字'],cast:['林照','许舟','何岚'],recall_ids:['O_CURTAIN','T_GRID']},
{unit:6,title:'开映以前',goal:'完成一次有限放映并妥善收回借物',change:'从替旧场地追完整过去，转为承认眼下能做成的小事',beats:['按约搬回货架并挂好幕布完成一次小范围放映','林照把原节目单交还周伯，旧片来历仍不知道','散场后何岚收好幕布，未替下一轮许下长期场地'],cast:['林照','许舟','何岚','周伯'],recall_ids:['O_PROGRAM','O_CURTAIN','T_GRID']}
].map(p=>({...p,arc_id:p.unit<=3?'A1':'A2',setting_refs:['设定/全书大纲.md'],research_refs:p.unit===1?['研究/场地备忘.md']:[],forbidden:p.forbidden??['不揭晓旧片完整来历']}));
for(const plan of plans.slice(0,3))command('plan-'+plan.unit,['plan','--project',work,'--input',input('plan-'+plan.unit,plan)]);
fs.writeFileSync(path.join(base,'planned-next.json'),JSON.stringify(plans.slice(3),null,2)+'\n',{flag:'wx'});
fs.writeFileSync(path.join(base,'scenario-config.json'),JSON.stringify({root,work,cli,embedded:path.join(work,'.writer/tool/bin/ai-writer.mjs'),evidence,plans},null,2)+'\n',{flag:'wx'});
command('initial-status',['status','--project',work]);command('outline-1',['outline','--project',work,'--unit','1']);
command('context-1',['context','--project',work,'--unit','1','--max-chars','60000','--out','.writer/context-1.json']);
console.log(JSON.stringify({ok:true,work,revision:state().revision}));
