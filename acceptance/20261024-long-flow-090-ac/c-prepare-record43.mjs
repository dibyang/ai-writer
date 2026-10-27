import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';import assert from 'node:assert/strict';import {fileURLToPath} from 'node:url';
const base=path.dirname(fileURLToPath(import.meta.url)),project=JSON.parse(fs.readFileSync(path.join(base,'project.json'))).project,sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const input=JSON.parse(fs.readFileSync(path.join(project,'.writer/drafts/AC-C-record43-before.json'))),body=fs.readFileSync(path.join(project,input.draft),'utf8'),hash=sha(body);
for(const [ref,h] of Object.entries(input.source_hashes))assert.equal(sha(fs.readFileSync(path.join(project,ref))),h,ref);
const evidence=q=>{assert(body.includes(q),q);return {unit:43,quote:q};};
const pages=Array.from({length:Math.ceil(body.length/1800)},(_,i)=>JSON.parse(fs.readFileSync(path.join(base,`read-pages/c-registered43-p${i+1}.json`))));
for(const [i,p]of pages.entries()){assert.equal(p.sha256,hash);assert.equal(p.text,body.slice(i*1800,(i+1)*1800));}
const parts=fs.readdirSync(path.join(project,'分段/AC-C-0043')).sort().map(f=>({path:'分段/AC-C-0043/'+f,sha256:sha(fs.readFileSync(path.join(project,'分段/AC-C-0043',f)))}));
assert.equal(parts.map(p=>fs.readFileSync(path.join(project,p.path),'utf8')).join('\n\n'),body);
input.summary='第36日周一：沈照新闹钟吃自己的面，父仍扶杖垫凳，沈实早半小时到店洗盘备桌。女12点交清回家吃小半碗南瓜饭，母自己吃过/听戏回房。沈午前吃自带小饼，11点前应取订单客迟到，老板实际认分包/描清字条并接回电、接下午取货，12:30沈交清离店。沈到许家坐过十分钟喝水，亲收父文字称饭热吃/碟好拿/没热馒头并念给女，未见热饭过程；两人再同出买。女买芹菜3付10找7、豆干2付两枚1余5；沈选两小芋头6付10找4，原15余9。不买额外葱，不为满预算加量。返许家换手提袋/先后入厨，两人洗手、芋头带皮去泥沥小盆、芹菜初冲去坏叶仍整枝、豆干袋留浅盘；小锅/干米杯取出到干台，米仍未下、未切配开火，母未出房当老师。饭约推进仍partial。';
input.changes={characters:{
 '许蓉':'周一自己午饭已吃，亲见女回家垫小半碗/帮找自己爱听开头，分温水与备普通杯后回房；亲见沈到门后拿水便回房，答不用顺带。保留自己休息，不参加摊前购买/未见沈父热饭现场，未受邀全程评菜。',
 '许蓉女儿':'12点将实际工作交同事后回许家，吃母留小半碗饭，等沈到先坐；听沈念父饭热吃消息。与沈同到摊前择小把芹菜/两片豆干，实花3+2=5、余5自己包内；返家提芋头/初洗与取锅杯，菜仍未切、米未倒、灶未开。护纸/原纸/书未取出转交，母在房内。',
 '沈禾':'实早半小时到店，午前垫自带小饼，亲交未取订单与柜中物给老板，12:30离店到许家；坐过10分钟喝水后同买。亲收父文字称饭热吃/没热馒头，念女听，未见父热吃现场。两小芋头6实付10找4、原15余9；返许家交换提袋，初洗/摆盆，小锅和干米杯已在干台，未下米/切配/开火。',
 '沈成林':'周一早晨扶杖到厨房门边/坐回原椅垫伤脚，听女早去并问小碟盖，未让女替自己提前热那份。后本人文字称饭热过吃了/碟好拿/没热馒头；亲收沈已到许家坐水、等会儿买菜消息，不共享摊前花费与许家全现场，热饭具体过程未展示。',
 '谭老板':'亲见沈早半小时到，实际认柜中先卖盘/未取订单分包及描清字条、接客户回电告下午找自己；12:30接前柜让沈离店，订单仍留店待本人后来取，不知道买菜细节。'
},timeline_append:[
 '第36日周一早：沈照新闹钟吃面后实早半小时到糕店，父扶杖/垫脚仍在；父饭早晨未热吃现场不写。',
 '周一午间：女12点交清回家垫母留小半碗，母自吃/听戏回房；沈店里垫小饼，老板认迟到订单分包/字条、接客户回电，12:30沈真交柜离店。',
 '同日沈到许家先坐过10分钟，收父文字称热饭已吃/没热馒头并念给女听，后同出买。女芹菜3+豆干2共5、余5；沈两小芋头6、余9，各自实际付找。',
 '同日午后返许家：去泥/初洗、坏叶另小碟，芋头小盆/整枝芹菜另盆/豆干袋在浅盘；小锅与干米杯干台待量，止未切配、未下米、未开火，朋友饭未做吃洗。'
],ledger:{T_AC_SHARED_MEAL:{status:'partial',reader_known:'43周一窗口实际使用：女12点、沈早半小时/12:30交清；许家坐过10分钟再共同买，女3+2实花5余5，沈两小芋头6余9。返家材料初洗/分盆、锅杯取出，尚未切配/下米/开火/做成/吃/洗收；父热饭仅本人消息，沈女非现场。',character_known:{
 '沈禾':'亲经历早到/交柜/坐水/同买/自己付芋头6余9，听见并见女菜3豆干2余5；父文字称热吃已吃/没热馒头，自己未现场；许家当前初洗锅杯在位、尚未开火。',
 '许蓉女儿':'亲经历12点交班/母先吃自歇/等沈休息后同买，菜3豆干2实花5余5，亲见沈付芋头6余9；听沈念父消息，未见沈家。返家两人摆洗、未正式做吃洗。',
 '许蓉':'周一自己先吃，亲见女垫饭和沈到家后喝水，自己进房休息且答无需顺带；未到摊前、不共享全部钱款或父热吃消息，厨房一次借用尚未收回。',
 '沈成林':'周一早晨在家听沈早出；本人发消息称热饭吃了，收到沈到许家坐水/等会儿才买菜；未到许家或知摊前钱款。',
 '谭老板':'实际接过沈未取订单和柜中物，12:30让沈走/自己接下午取货，未见许家或摊前。'
},evidence:[evidence('老板看钟，说她来得正好，比平时早半小时'),evidence('墙钟刚到十二点，对方朝她摆手，说走吧'),evidence('他朝钟看，十二点半刚到，让她走'),evidence('她们起身时，已经过了原先说的十分钟。'),evidence('原来十块买过菜找七，如今余五'),evidence('原先备的十五还剩九'),evidence('饭热过吃了。碟好拿，没热馒头。'),evidence('厨房里还没开火')]} }};
const report='审查/AC-C43-登记前完整回读与纲文回对.md';
input.draft_review={reviewer:'Codex AC-C 知情模型自检',report,draft_sha256:hash,report_sha256:sha(fs.readFileSync(path.join(project,report)))};
delete input.output;delete input._instructions;
fs.writeFileSync(path.join(base,'c-inputs/record43-filled.json'),JSON.stringify(input,null,2)+'\n',{flag:'wx'});
const audit={at:new Date().toISOString(),draft:input.draft,sha256:hash,han:(body.replace(/^#{1,6} .*$/gm,'').match(/\p{Script=Han}/gu)||[]).length,bytes:Buffer.byteLength(body),pages:pages.length,read_labels:pages.map((_,i)=>`c-registered43-p${i+1}`),parts,parts_match:true,source_hashes_preserved:true,report:input.draft_review};
fs.writeFileSync(path.join(base,'c-inputs/43-final-audit.json'),JSON.stringify(audit,null,2)+'\n',{flag:'wx'});console.log(audit);
