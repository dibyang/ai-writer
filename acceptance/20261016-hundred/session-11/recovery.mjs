import fs from 'node:fs';
import path from 'node:path';
import {project,stage,hash,save} from './run-cli.mjs';
const chapters=[25,31,35,36,40,48,54,56,72,74,75,79,80,81,82,83,84];
const sources=['writer.json',...fs.readdirSync(path.join(project,'设定')).filter(f=>f.endsWith('.md')).map(f=>'设定/'+f),'大纲/全书大纲.md','大纲/续部总纲.md','大纲/分卷/V12.json','大纲/分卷/V13.json',...chapters.map(n=>'正文/'+fs.readdirSync(path.join(project,'正文')).find(f=>f.startsWith(String(n).padStart(4,'0')+'-')))];
for(const f of sources)fs.appendFileSync(path.join(stage,'reading.jsonl'),JSON.stringify({path:project+'/'+f,sha256:hash(path.join(project,f)),range:'full',purpose:chapters.some(n=>f.startsWith('正文/'+String(n).padStart(4,'0')))?'最近六章恢复或recall定位后的旧正文连续性核对':'现行设定、文体和卷契约恢复',read_at:new Date().toISOString(),method:'FastCtx完整正文已展示并由模型实读；随后计算哈希'})+'\n');
fs.mkdirSync(path.join(stage,'baseline'),{recursive:true});fs.copyFileSync(path.join(project,'.writer/state.json'),path.join(stage,'baseline/state-r269.json'));
save('recovery-sources.json',{revision:269,state_sha256:hash(path.join(project,'.writer/state.json')),sources:Object.fromEntries(sources.map(f=>[f,hash(path.join(project,f))]))});
const body=`# 本阶段恢复记录

机器开始时间：2026-10-16T11:20:29.717Z。恢复来自当前作品，未读其他阶段请求、结果、聊天或旧状态；只读共享command-runner无剧情辅助代码。status初始revision269、84章、next85，无漂移或欠审。当前state仅只读，原样备份于baseline，权威写入仅CLI。

实际情境停在第51日20:28以后，沈禾镇家继续读旧小说，周砚带画册、笔盒离开，两人各钥各家。第54日19—20:30周家各吃后坐是已约但未执行。第44日所选“未来一月住镇家”有效，不将本批重新算成第一次决定，更不自动同居。第51日9:07新12分钟核听尾240实到，本次480齐，改片未接。

原箱含布牌宋俭服务室里间干板代存，原带另干柜格；原钥、原通知和原簿赵瑛新库分袋/盒。原灯范勤原位断电、围挡检查处不是公众开放。沈只有工作照/转录与自有载体，母原盘家抽屉，长线家抽屉另袋停用。第83章邱将扣合透明盒原袋移到下柜干布格，未开盒；原缺名两页及松细夹/现宽夹仍按54章历史，不声称83重新检查。使用两页、大字四页、标改试样与罗三页均沈家分袋暂停。84杯画夹沈家用本，普通白杯归原柜，不是旧物。

沈亲见79车及80座位后段；47雨沟只范未说完半句，不补全日。乔、范不自动知道葛店，葛不自动知道车场。邹79才当面知道45离后两车试行安排。周只知道74月约、84本次新活完成与外声误记口述，不知客户文件、工钱总额、83邱移盒；何83在家免提仅获移盒口述，72才首次获48滑页/两夹完整经过，不倒算旧现场。何40已获罗许可完整预读三页并还沈，罗只知道其预看获准，不预填何后来的现场结果。唐37只读稿而不亲听旧带；历史首说/改口、原观察不可逆。

未结：T_RETURN_MONTH/T_ROUTE_COMMON due88；T_SHARED_EVENING_84与T_SHOP_SEAT_NEXT_80 due88。T_KEEPER_SHARE due56已有有限三轮180结清与退出，长期人钱未定；T_HE_OLD_PAY due56旧240已到，两段未清。T_ROOM_AFTER33 due64仍暂停无新排期；T_SOUND_CONTEXT due72已有职业实践但余带不获声源答案。T_PAGE_PAIR/T_VOICE_CONSENT due100仍partial，原纸缺名事实与逐版本退出尚需后卷实践。不得改due清零，不把54日前店椅每一天或沈缺席时段写成她全见。

本批回查重点：85—88从现行有限安排长出具体执行与相处，仍不开放灯下；89进入V13A1，当事人可收回讲述，不撤销第24章已核史事、不强推秘密。三条具象旧线：35蓝17:10四折私纸→56有限劳动/旧账；36半月缺口红砖水泥→75真实车筐→79换司机→本批有限责任；31缺名第二页→48滑页两夹→54归还→72口述→83柜内→89—100逐版本退出。另25两人菜/各自早晨→74未来一月→84杯画→54日晚相处。余带的32椅声相似只反证“相似不等同源”，不能造男声、钟源或剪者答案。

相关旧证据已全文实读：25、31、35、36、40、48、54、56、72、74、75。最近六章79—84全文读完。完整路径、实际哈希及阅读用途见reading.jsonl，下表为本次恢复绑定。ledger-recovery-index读取了全部现行active/pending/partial条目的statement、reader_known、custody、当前知情首段和证据章次；未宣称完整深读127项所有旧引文历史。recall每次单独ID，按id严格相等选目标，关联项不冒充目标。巨大历史已原样保留，只对本批消费旧证据作全文回查。

|恢复来源|SHA-256|
|---|---|
${sources.map(f=>`|${f}|${hash(path.join(project,f))}|`).join('\n')}
`;
fs.writeFileSync(path.join(stage,'recovery.md'),body,'utf8');
console.log(JSON.stringify({read_files:sources.length,chapter_full:chapters,revision:269,state_sha256:hash(path.join(project,'.writer/state.json')),now:new Date().toISOString(),elapsed_s:Math.round((Date.now()-Date.parse('2026-10-16T11:20:29.717Z'))/1000)}));
