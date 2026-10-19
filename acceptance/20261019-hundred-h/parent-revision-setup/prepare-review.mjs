// Transcribes the parent's actual earlier full readings and stated judgments.
// It checks literal references and fills CLI metadata; it does not infer literary quality.
import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';import assert from 'node:assert/strict';import {fileURLToPath} from 'node:url';
const here=path.dirname(fileURLToPath(import.meta.url)),base=path.dirname(here),unit=Number(process.argv[2]),j=p=>JSON.parse(fs.readFileSync(p)),sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const candidates=j(path.join(base,'read-d/revision-candidates.json')).candidates,candidate=candidates.find(x=>x.unit===unit);assert.ok(candidate&&[72,79,83].includes(unit));
const state=j(path.join(base,'work/.writer/state.json')),record=state.units.find(x=>x.unit===unit),bytes=fs.readFileSync(path.join(base,'work',record.draft)),body=bytes.toString('utf8');assert.equal(sha(bytes),candidate.sha256);assert.equal(record.sha256,candidate.sha256);
const template=j(path.join(base,'commands','parent-review-template-'+unit,'stdout.raw.txt'));assert.equal(template.expected_revision,state.revision);assert.equal(template.from,unit);assert.equal(template.to,unit);
const content={
  72:{id:'H72_REPEATED_KNOWLEDGE',type:'optional_style',severity:'suggestion',confidence:'medium',
    statement:'19行何已说未听夹子，21行沈刚讲完经过，23行再解释今日才知/上次未全知，做客的当下延后；原知情链正确，是可选压缩而非硬错。',
    benefit:'保留19与21全部知识传递及23原纸未补名、不去验夹，只省同场第三次时间自证。',
    functions:{goal:['何来分饼做客，沈补齐旧两页滑落和归还消息。','想来坐半小时'],obstacle:['未定工作试图占整周空闲，既有知情解释又多次打断做客。','可能两条，不必替我留一整周。'],choice:['何不跑去验夹，沈拒将未确认七个下午先给出去。','但不能因为怕，先把没确认的七个下午都算成自己的工作。'],consequence:['本次480收齐，旧两段仍待，未来工作须另问。','这一次两小时核听共四百八十，真的齐了。'],relationship_change:['何带自己的试样与鞋来做客，不替沈保后单或承担更多义务。','你介绍人，不是替我保一份一定成的活。']}},
  79:{id:'H79_SINGLE_BRICK_REFERENCE',type:'readability',severity:'suggestion',confidence:'high',
    statement:'两块砖的半月缺口可以按一组砖的简写理解，但缺少临车道那块的限定，容易误构成两处缺口；补定位有净收益，不宣判实体已变。',
    benefit:'恢复36/71原观察已有的单块定位，减少空间回查；不动两块砖、罩、水泥、车辆与通路有限性。',
    functions:{goal:['新司机与接货者安排厚板装卸和邹双筐当次通过。','清早临时接这趟，号码是经办发来的'],obstacle:['司机赶十一点的车，厚板需多人，边路不能被尾板堵住。','后头有人十一点要用车'],choice:['先带看与腾架，双筐先过，不以两试许诺永久。','今天先照这个办法做，不拿两回就答以后都成。'],consequence:['板当次收进，司机按实际时刻离；不补全日雨路已通。','九点三十五过一点，板收进去了。'],relationship_change:['司机和邹带着各自工作成本配合，也有萝卜玩笑。','别来找自己的萝卜算账。']}},
  83:{id:'H83_REPEATED_PHONE_EXCLUSION',type:'optional_style',severity:'suggestion',confidence:'medium',
    statement:'71/73/75/81已用真实电话明确何在家、沈亲见后转述、没开盒和范围；83再列何没见布/袋字是可选解释压缩，不是原文知识错。',
    benefit:'删最后一次视觉排除，保留免提授权与全部实际内容、何未目击和不领人看，再回邱穿针与沈买线。',
    functions:{goal:['沈买线时亲见邱收盒换位，并把有限变化告诉何。','刚才她把扣好的透明盒从柜上收进柜里，没开，也没重新看纸。'],obstacle:['柜上取衣袋挤盒，位置与查看许可需要分清。','这上头越放越没地方。'],choice:['邱不开盒收进下柜，沈免提传话而不要求何复背。','盒盖没开，袋仍在里面'],consequence:['何只获搬位转述，没获得再印或领人看的许可。','自己这次听的是盒换了放处，不是又要去印一套'],relationship_change:['何与邱有自己的玩笑，沈不抢替邱穿针。','沈想将自己手里线头递去，又看颜色不是她正用的，便收回']}}
}[unit];
const observed={unit};for(const [field,[text,quote]]of Object.entries(content.functions)){assert.ok(body.includes(quote),unit+'/'+field+' literal quote');observed[field]={status:'observed',text,evidence:[{unit,quote}]};}
template.operation_id='H-parent-formal-'+unit+'-v1';template.report='审查/H轮父-旧章'+unit+'候选.md';template.chapter_functions=[observed];template.comparison={similar_structures:[],distinct_gains:[content.benefit],preserve:candidate.preserve,optional_adjustments:['仅按具体原句作上述最小改善，不按词频批删。'],limits:'父此前已经实际全文读取本章，当前SHA与当时冻结版本一致；这是一章窄范围复核，辅助读过的旧源不冒称中间全部章节连读。不是自动文学判断、真人盲读或锁内正式修订读稿。'};
template.issues=[{id:content.id,type:content.type,severity:content.severity,confidence:content.confidence,statement:content.statement,suggestion:candidate.proposed_text,evidence:[{unit,quote:candidate.quote}]}];delete template._instructions;
const report=['# H轮父前置审稿：第'+unit+'章','', '这是父模型此前实际全文阅读后的意见登记，当前版本SHA：'+candidate.sha256+'。原句与净收益已经写入parent-new-chapter-notes或parent-candidate-review-part1/read-d候选；这里不新增阅读范围或声称保护会话已经开始。','', '类别：'+content.type+'；严重度：'+content.severity+'；置信度：'+content.confidence+'。这三个候选均不标成必须修复的实体硬错。','',content.statement,'', '原句：'+candidate.quote,'','拟改：'+candidate.proposed_text,'','收益：'+content.benefit,'','检验与风险：'+candidate.language_tests.map(x=>x.test+'：'+x.result).join('；'),'','保留：'+candidate.preserve.join('；'),'','辅助来源与下游：'+candidate.downstream.join('；'),'','79的背景定位来自父已全文读过的36/71及read-d实际版本，报告只声称本章窄范围。其他章的背景读稿不等于授权改写或整段连读。','', '采用仍须另走当前授权下的代理resolve；不冒充作者逐条选择。后续begin后要在锁内复读、修改与逐章重登，当前没有正文修改。',''].join('\n');
const destination=path.join(base,'work',template.report);fs.writeFileSync(destination,report,{flag:'wx'});fs.writeFileSync(path.join(here,'review-'+unit+'.json'),JSON.stringify(template,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({prepared:true,unit,revision:state.revision,id:content.id,source_sha256:candidate.sha256,report:template.report}));
