import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';import assert from 'node:assert/strict';import{functionsByUnit,comparison}from './window-analysis.mjs';
const root=path.resolve('acceptance/20261024-long-flow-090-ac');const{project}=JSON.parse(fs.readFileSync(path.join(root,'project.json')));const sha=b=>crypto.createHash('sha256').update(b).digest('hex');const input=JSON.parse(fs.readFileSync(path.join(project,'.writer/drafts/AC-B-resume-review37-42-before.json')));delete input._instructions;
const coverage=[];const texts={};for(const[ref,hash]of Object.entries(input.source_hashes)){const unit=Number(ref.match(/\/(\d{4})-/)[1]);const b=fs.readFileSync(path.join(project,ref));assert.equal(sha(b),hash);texts[unit]=b.toString();const pages=Math.ceil(texts[unit].length/1800);for(let p=1;p<=pages;p++){const r=JSON.parse(fs.readFileSync(path.join(root,`read-pages/br-window${unit}-p${p}.json`)));assert.equal(r.sha256,hash);assert.equal(r.page,p);}coverage.push({unit,ref,sha256:hash,pages,body_han:(texts[unit].replace(/^#.*$/gm,'').match(/\p{Script=Han}/gu)||[]).length});}
input.chapter_functions=Object.entries(functionsByUnit).map(([u,vals])=>({unit:Number(u),...Object.fromEntries(['goal','obstacle','choice','consequence','relationship_change'].map((key,i)=>[key,{status:'observed',text:vals[i][0],evidence:[{unit:Number(u),quote:vals[i][1]}]}]))}));input.comparison=comparison;
input.issues=[{id:'I_AC_B_42_GLASSES_TARGET',type:'continuity',severity:'minor',confidence:'high',statement:'父亲正在找遥控，后句摸衣袋与领口眼镜相接，缺少转找眼镜的动作，物件目标衔接错。',suggestion:'改为拿起遥控想认屏幕字，才摸衣袋找眼镜；不改眼镜领口/父伤和后续动作。',evidence:[{unit:42,quote:'沈成林正低头找遥控，眼镜在领口挂着，自己摸了两回上衣袋，没摸到。'}]},{id:'I_AC_B_42_TYPO_KONGPA',type:'readability',severity:'minor',confidence:'high',statement:'“那怕还得叫他去”这里应为“那恐怕还得”，缺字使语义绊读。',suggestion:'补“恐”，保留客户可能再叫周看原柜而尚未约成。',evidence:[{unit:42,quote:'男人道那怕还得叫他去。'}]},{id:'I_AC_B_WINDOW_HELP_ECHO',type:'optional_style',severity:'suggestion',confidence:'medium',statement:'37—42帮助前停手/问话后让决定/喝水洗碗收束反复，部分旁白先替读者总结，存在读感趋同。',suggestion:'可减一两处解释性否定；保留真实交物/钱/换班等不同后果。本次不自动扩大改稿。',evidence:[{unit:39,quote:'没开盒，自己转头看母亲究竟在听什么。'},{unit:41,quote:'不必替他补一份整日坐守的记录。'},{unit:42,quote:'没再绕着桌子认还有什么需要提前教。'}]}];
const validate=x=>{if(!x||typeof x!=='object')return;if(Number.isInteger(x.unit)&&typeof x.quote==='string')assert(texts[x.unit].includes(x.quote),`${x.unit}:${x.quote}`);for(const v of Object.values(x))validate(v);};validate(input);
const report='审查/AC-B窗口37-42-初读问题报告.md';input.report=report;const reportText=`# AC-B窗口37—42初读：知情模型复核

同一创作模型实读，不是隔离盲读/真人验收或作者定稿。完成41、42登记后按37→42完整连续阅读当前六章46页，证据br-window37-p1…br-window42-p7，各页对应登记SHA。覆盖与汉字统计见br-inputs/window-initial-coverage.json。

${coverage.map(c=>`- ${c.unit}：${c.pages}页，正文${c.body_han}汉字，SHA ${c.sha256}`).join('\n')}

## 逐章功能、选择与收益

${Object.entries(functionsByUnit).map(([u,v])=>`### ${u}\n\n`+v.map((a,i)=>`${['目标','阻力','选择','后果','关系变化'][i]}：${a[0]} 原文：“${a[1]}”`).join('\n\n')).join('\n\n')}

## 结构比较

${comparison.similar_structures.map(s=>`${s.judgment}\n\n${s.differences}\n\n应保留：${s.preserve}\n\n边界：${s.uncertainty}`).join('\n\n')}

六章不是没有独立推进，但准备问答、停手与杯碗收束的频率偏高。特别42周五电话分量段在37问米、39谈锅、41说先坐之后有回声，新增价值在预算/做法选择，最有不同收益的却是周六补班与周日父实际取盒。可考虑减解释，不能为节奏将未发生的周一做成事实。

## 两项确认问题及处置

${input.issues.slice(0,2).map(x=>`${x.id}：${x.statement}\n\n原文：“${x.evidence[0].quote}”\n\n拟改：${x.suggestion}`).join('\n\n')}

按用户现授权40—42范围，采用代理范围内的小修，仅建42—42正式独立区。原稿9d2d5f…保留，不直接编辑已登记稿。修后重登42并完整尾段/窗口复核，再登记当前SHA报告。这份初读含已知问题，不能当最终通过。

## 连续性与未决

34门未拆→37约到人→38留旧条消息→39定工40料另问→40真拆/料8支→41固定亲试/50找2收48，有限回收，不推为冬天无风。37抽屉留下→38认漏回电话/18/周五约→41一侧试后退→42真装/亲交/实收18，原柜右边旧卡仍在且仅文字反馈。37饭约→39周四晚回复期限→40女问班→41母日期/沈当日回谭→42周六真补和周日父饭留冷，T_AC_SHARED_MEAL仍partial。工装老师见过/母选继续穿仍partial，不将学习课数或洗后软化夸大。柜门另一客户继续pending；父脚/复航/家史等未知不结案。

${comparison.limits}
`;
fs.writeFileSync(path.join(project,report),reportText,{flag:'wx'});fs.writeFileSync(path.join(root,'br-inputs/window-initial-coverage.json'),JSON.stringify(coverage,null,2)+'\n',{flag:'wx'});fs.writeFileSync(path.join(root,'br-inputs/review37-42-initial.json'),JSON.stringify(input,null,2)+'\n',{flag:'wx'});console.log(JSON.stringify({pages:coverage.reduce((n,x)=>n+x.pages,0),report,issues:input.issues.map(x=>x.id)},null,2));
