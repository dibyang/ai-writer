import fs from 'node:fs';
import path from 'node:path';
import {stage,read,save,hash} from './stage.mjs';
const original=read(path.join(stage,'before/snapshots.json')), ss=structuredClone(original),state=read(path.join(stage,'before/work/.writer/state.json'));
const drafts=read(path.join(stage,'drafts-manifest.json')), bodies=Object.fromEntries(drafts.map(d=>[d.unit,fs.readFileSync(d.staged,'utf8')]));
const pairs=[];
function pair(a,b,reason){pairs.push({old:a,new:b,reason});}
function get(n,p){return p.split('.').reduce((v,k)=>v[k],original[n]);}
function head(n,p,text){const s=get(n,p),a=s.split(/；(?=历史|截至|保留|此前)/)[0];pair(a,text,'A3实际知情及动作版本');}
pair('14:00阅览间','14:30阅览间','A1开门');
pair('14:30—14:58','14:45—15:13','A1第16日实际时段');
pair('14:30—15:00','14:45—15:15','A1第16日许可');
pair('14:58','15:13','A1第16日收稿');
pair('14:20—15:00','14:50—15:30','A1第20日许可');
pair('14:20起新自述','14:50起新自述','A1第20日开始');
pair('14:20新自述','14:50新自述','A1第20日开始');
pair('14:20只新录','14:50只新录','A1第20日开始');
pair('下午14:20','下午14:50','A1第20日开始');
pair('14:56','15:26','A1第20日离开');
pair('15前收','15:30前收','A1第20日收齐');
pair('15点前全收','15:30前全收','A1第20日收齐');
pair('20日15点后','20日15:30后','A1第20日之后');
pair('及3点收','及3:30收','A1第19日告周');pair('阅览间3点收','阅览间3:30收','A1第19日告周');
pair('知她次日下午到3点','知她次日下午到3:30','A1关系关联知识');
pair('20日随身电脑，15点后携离阅览间','20日随身电脑，15:30后携离阅览间','A1声音物件位置');
pair('细夹夹起放柜侧','细夹夹合后平放柜上干净透明盒内','A2指定旧两页');
pair('亲拆示风险并夹合留柜侧','亲拆示风险并夹合平放柜上干净透明盒','A2指定旧两页');
pair('缝纫铺柜侧，和客户尺寸纸分开','缝纫铺柜上干净透明盒内平放，和客户尺寸纸分开','A2指定旧两页');
pair('自己夹起留柜侧待看','自己用细夹夹合后平放柜上干净透明盒待看','A2指定旧两页');
head(36,'characters.沈禾','第36章当前：第17日傍晚家中，换鞋仍后跟疼；9点罗看完整工作稿与自页、9:24离，仅获唐一人先看非公开朗读，改去看扇形象留地点原话改口、留旧另打三页封袋仍未送唐，已发消息询问新库空档未约定。午后外路亲见两红砖半月缺口、水泥分开所见及范当次清沟；与28章菜女人互报姓名邹秀琴，听其货损与不挡转车需要，不许工地开放。');
head(36,'characters.罗敬','第36章当前：17日9点家中实际看沈自页和两页工作整稿，保两短首说及完整改口，要求去看扇形象留地点与实看；经沈当面转告才知唐愿看文字不想每事到场，允只给唐一人先看非公开、未录。仅从沈口述获昨次用邱新准页和新自述不旧图音，未听新录、不知陈父女；9:24沈收稿，自己九点半买菜安排不变。');
head(36,'ledger.T_PUBLIC_USE.character_known.沈禾','第36章当前：罗段先看承诺已履行但只唐一人预看，唐未收到，仍不得纳入下一公众场。');
head(36,'ledger.T_VOICE_CONSENT.character_known.沈禾','第36章当前：已履行先给罗看整段，按其意见去看扇形象而留首说改口地点；只准唐一人先看，不准公众朗读，三页仍包未交唐。');
head(36,'ledger.T_VOICE_CONSENT.character_known.罗敬','第36章当前：已亲看自己的整段及沈页，要求两短、首说和完整改口留、去看扇形象，只准唐一人先看；未知陈父女、未听新录，私因不说。');
pair('第17日9点罗家实看工作整段与沈页，允何一人先看不公开；9:24收稿离，回家保旧改稿另打三页封袋未送何。','第17日9点罗家实看工作整段与沈页，允唐一人先看不公开；9:24收稿离，回家保旧改稿另打三页封袋未送唐，发消息问新库工作空档。','A3时间线');
pair('三页何映先看版封袋','三页唐穗先看版封袋','A3物件版');
pair('封好的何映先看文件袋','封好的唐穗先看文件袋','A3袋面');
pair('只准何一人预看、尚未交何','只准唐一人预看、尚未交唐','A3许可');
pair('何还没收，自己携回家','唐还没收，自己携回家','A3未交状态');
pair('给何一人先看，未知沈随后实际重打与何未收','给唐一人先看，未知沈随后实际重打与唐未收','A3罗知情');
head(37,'characters.沈禾','第37章当前：18日9:30—9:57在新库守三页供唐完整预看后收回，唐工作十点来车不去阅览间；走二十余分钟10:22到阅览间，只给何看沈自述单页，罗两页不展示；10:37陈独来还书写自便笺，何口述校样已送又返一页，三页仍沈持、十一点前离，罗未公开。');
head(37,'characters.何映','第37章当前：18日10:22后只读沈自己的单页并归还，罗两页未向她展示、不知其全文原话细节，无罗稿预看/公开/留稿权；在场陈写便笺，自称16日已送样17日又返页今午仍排，四折旧字条自持、笔留何。');
head(37,'ledger.T_PUBLIC_USE.character_known.沈禾','第37章：唐在新库预看全三页后收回；何只看沈自述单页，罗段不得给何看或公开；听陈大字需要，不许下次日期。');
head(37,'ledger.T_PUBLIC_USE.character_known.何映','第37章：只看沈自述单页，罗完整工作段未读；听陈大字需求，知道另排须再问邱，没收三页。');
head(37,'ledger.T_PUBLIC_USE.character_known.陈玉荷','第37章：沈愿试排大字再问邱，无现成稿拿走，无下次日期；未读沈已经收好的罗稿。');
head(37,'ledger.T_VOICE_CONSENT.character_known.沈禾','第37章：唐预看履行，三页收回；何只读沈自述，未获罗全文预看权，罗公开仍未准，陈只重提邱大字用途，无下场时间。');
head(37,'ledger.T_VOICE_CONSENT.character_known.何映','第37章：只读沈自述单页，未读罗完整稿，不知其中原话细节，不具罗稿公开或留稿权，罗私因未告。');
pair('第18日10点沈在阅览间守三页供何独看、借还来人停收，10:37陈独自还书在自便笺背写坐五分钟；何口述校样交后又返一页，三页仍沈收、字条何留，十一点前沈离。','第18日9:30—9:57新库唐在沈在场时读全三页并还沈，十点来车不赴阅览间；沈步行二十余分钟10:22到阅览间，只给何看沈自述页后收回。10:37陈还书在自便笺背写坐五分钟；何口述校样交后返页、字条自留，沈十一点前离，罗稿未给何。','A3真实移动时间线');
pair('37何已预看罗完整稿但未得公开权','37唐已预看罗完整稿但未得公开权，何仅看沈自述页','A3读者知识');
pair('第18日上午阅览间收回原文件袋由沈携离，旧改稿仍沈家抽屉','第18日9:57新库唐完整读后还沈，10:22阅览间只抽沈页给何后收回同袋携离；旧改稿仍沈家抽屉','A3物件路线');
pair('三页供何一人在沈在场时读完，来人即合；何未留稿无公开朗读权，沈自页圈时间衔接，罗段未改','三页供唐一人在沈在场时读完，工作来人先合，9:57还沈；何只看沈自页，未读罗两页；唐何均未留稿无公开朗读权，沈自页圈时间衔接，罗段未改','A3物件条件');
head(37,'ledger.P_RO_WORK_PAGES.character_known.沈禾','第37章：已让唐独看全三页后收回，非交唐保管或公开；随后仅将自己页给何看后收回。');
pair('第37章：独读三页，知原说两短船等、灯片岸端暂停与完整改口，不亲见旧片，不获罗私约，不持纸。','第37章：仅读沈自述页并还沈，罗两页未展示，未获其全文细节、不持纸。','A3何无全文所得');
pair('罗稿仍只何预看','罗稿只在37给唐预看，何尚未读','A3第38章边界');
pair('罗稿仍只是37预看','罗稿37仅唐预看，自己尚未读','A3第39章何知识');
pair('37何预看罗整稿','37唐预看罗整稿、40何经新许可后预看','A3回收过程');
pair('罗稿仍37何预看权','罗稿37唐先看、40另准何一人预看，仍不公开','A3第40章新权限');
pair('沈家桌角何映先看文件袋内，旁大字四页袋','沈家桌角先唐后何预看过的三页原文件袋内，旁大字四页袋','A3最终保管');
pair('37何预看已完不等公开许可','37唐预看、40何另获许可后预看已完，均不等公开许可','A3最终权限');
head(42,'ledger.P_RO_WORK_PAGES.character_known.沈禾','第42章：家中确认先唐后何看过的三页仍封，不随修门借出、不由严顾知全文。');
function walk(v){if(typeof v==='string'){for(const p of pairs)v=v.replaceAll(p.old,p.new);return v;}if(Array.isArray(v))return v.map(walk);if(v&&typeof v==='object')return Object.fromEntries(Object.entries(v).map(([k,x])=>[k,walk(x)]));return v;}
for(let n=25;n<=42;n++)ss[n]=walk(ss[n]);
const keepHistory=(newText,oldText)=>newText+'；此前有效知识按原章时点保留：'+oldText;
const tang37='第37章当前：18日9:30—9:57新库工作间隙，在沈在场时完整读沈一页及罗两页并还沈、不拷；知道完整首说、两短与改口并存，仅从文字/既有沈转述知罗改口，不亲听旧音、不见原签、不知私因。十点来车继续工作，不赴阅览间，不替别人同意公开。';
for(let n=37;n<=42;n++){
 ss[n].characters.唐穗=keepHistory(tang37,ss[36].characters.唐穗);
 for(const id of ['T_PUBLIC_USE','T_VOICE_CONSENT','P_RO_WORK_PAGES']){
 const old=ss[36].ledger[id]?.character_known?.唐穗;
 ss[n].ledger[id].character_known.唐穗=old?keepHistory(tang37,old):tang37;
 if(!ss[n].ledger[id].cast.includes('唐穗'))ss[n].ledger[id].cast.push('唐穗');
 }
 ss[n].ledger.T_LAMP.character_known.唐穗=keepHistory('第37章：首次读罗完整工作稿，首说两短与改口并存，灯片只证岸端暂停、船等属罗混入记忆且哪回不准；只读文字、没听旧带、不见原签、不知私因。',ss[36].ledger.T_LAMP.character_known.唐穗);
 if(n<40)delete ss[n].ledger.T_LAMP.character_known.何映;
 if(n<40)delete ss[n].ledger.O_LAMP_PANEL.character_known.何映;
 ss[n].ledger.O_LAMP_PANEL.character_known.唐穗=keepHistory('第37章：在工作稿中读到对灯片岸端暂停的说明；既有13章亲见片知识保留，未亲听旧带或见原签、不知私因。',ss[36].ledger.O_LAMP_PANEL.character_known.唐穗);
}
for(let n=35;n<=42;n++){
 ss[n].ledger.O_HOURS_NOTE.statement=ss[n].ledger.O_HOURS_NOTE.statement.replace('正面写本日时段','正面写本日14:45—15:15时段');
 ss[n].ledger.P_HOURS_NOTE.statement=ss[n].ledger.P_HOURS_NOTE.statement.replace('正面本日时段','正面本日14:45—15:15时段');
}
const morning='第40章上午：9:35沈告罗唐已预看收回无拷，罗新允只给何一人连沈自页预看、看后还沈不朗读；10:05—10:38阅览间沈在场何完整读三页并归还，无拷，沈十一点前离回家收好三页，下午只带邱四页。';
for(let n=40;n<=42;n++){
 for(const id of ['P_RO_WORK_PAGES','T_LAMP','O_LAMP_PANEL'])if(!ss[n].ledger[id].cast.includes('何映'))ss[n].ledger[id].cast.push('何映');
 for(const who of ['沈禾','何映','罗敬']){
 const msg=who==='罗敬'?'第40章上午：9:35电话获沈告唐已读完并还沈无拷，只新准何一人连沈页预看、看后还沈不朗读；未获何后来读完的现场结果或下午陈家事。':morning;
 ss[n].characters[who]=who==='罗敬'?keepHistory(msg,ss[n].characters[who]):ss[n].characters[who]+'；补入第40章已发生经历：'+msg;
 for(const id of ['T_PUBLIC_USE','T_VOICE_CONSENT','P_RO_WORK_PAGES'])ss[n].ledger[id].character_known[who]=(ss[n].ledger[id].character_known[who]??'')+'；补入第40章已发生知情：'+msg;
 }
 ss[n].ledger.T_LAMP.character_known.何映='第40章：经罗当日上午另准后，在沈在场时首次读完整工作稿，知首说两下船等、两短支持岸端暂停及混入喊话的改口；仅稿述，不亲见灯片原签、不听旧音、不知私因，37—39未读全文。';
 ss[n].ledger.O_LAMP_PANEL.character_known.何映='第40章：上午经罗另准，首次只读沈工作稿对用法片岸端暂停的说明，不看原片照片、不获具体亮灯年月；37—39未读此段。';
}
ss[40].ledger.P_RO_WORK_PAGES.custody.location='第20日10:38何读完三页实还沈，沈十一点前离、回家存原袋，下午未带到阅览间；四页大字另袋';
ss[40].ledger.P_RO_WORK_PAGES.custody.condition='37唐先预看、40何获罗新准后完整预看并还沈，均无拷不等公开；罗段未改，沈旧改稿另存';
ss[41].ledger.P_RO_WORK_PAGES.custody=structuredClone(ss[40].ledger.P_RO_WORK_PAGES.custody);
const ti=ss[40].timeline.length-1;
for(let n=40;n<=42;n++)ss[n].timeline[ti]=ss[n].timeline[ti].replace('沈告何；','沈告何；9:35再问罗新准何预看，10:05—10:38何读全三页并还沈，十一点前离回家收好；').replace('随后沈何试门','15:32回屋后沈何试门');
// Map only anchors that the author revision actually changes. Every other quote is retained.
const quotePairs=[...read(path.join(stage,'prose-edits.json')).filter(p=>p.old.length<250).map(p=>({old:p.old,new:p.new,reason:p.reason})),
 {old:'邱将它夹到柜侧，和客户裤子的尺寸纸隔开',new:'邱将细夹夹好的两页平放进柜上一只干净的透明盒，和客户裤子的尺寸纸隔开',reason:'A2'},
 {old:'何映要知道怎么摆，你先给她一个人看。',new:'唐穗说过肯看文字，你先给她一个人看。',reason:'A3'},
 {old:'沈禾收好三页。',new:'九点五十七，沈禾收好三页',reason:'A3新库实际归还'},
 {old:'看工作稿写的用法片只管岸端暂停放行',new:'两短是对得上的，船等不是灯片能说明的。',reason:'A3唐预看灯片说明'},
 {old:'十四点五十八，沈禾收起新两页，和旧稿继续分装。',new:'十五点十三，沈禾收起新两页，和旧稿继续分装。',reason:'A1'},
 {old:'后天下午，两点二十到三点，你问屋里能不能。',new:'后天下午，两点五十到三点半，你问屋里能不能。',reason:'A1'}];
const mapping=[],missing=[];
for(let n=25;n<=42;n++)for(const [id,e]of Object.entries(ss[n].ledger))for(const [index,anchor] of (e.evidence??[]).entries()){
 if(anchor.unit<25)continue;
 const old=original[n].ledger[id]?.evidence?.[index]?.quote??anchor.quote;
 if(!bodies[anchor.unit].includes(old)){
  let q=old;for(const p of quotePairs)q=q.replaceAll(p.old,p.new);
  if(!bodies[anchor.unit].includes(q))missing.push({snapshot:n,id,unit:anchor.unit,old,attempt:q});else anchor.quote=q;
  if(q!==old&&!mapping.some(x=>x.id===id&&x.unit===anchor.unit&&x.old===old))mapping.push({id,unit:anchor.unit,old,new:q,reason:'作者修订A1/A2/A3导致旧引文退出新版正文',old_sha256:state.units[anchor.unit-1].sha256,new_sha256:drafts.find(x=>x.unit===anchor.unit).sha256});
 }else anchor.quote=old;
}
// Add actual current-chapter anchors for new knowledge and the second permission.
const add=(n,id,q)=>{for(let k=n;k<=42;k++){ss[k].ledger[id].evidence??=[];if(!ss[k].ledger[id].evidence.some(x=>x.unit===n&&x.quote===q))ss[k].ledger[id].evidence.push({unit:n,quote:q});}};
for(const id of ['T_PUBLIC_USE','T_VOICE_CONSENT','P_RO_WORK_PAGES'])add(37,id,'九点五十七，沈禾收好三页');
for(const id of ['T_PUBLIC_USE','T_VOICE_CONSENT','P_RO_WORK_PAGES','T_LAMP'])add(40,id,'十点三十八，她对过页次，将三页全还沈。');
add(40,'O_LAMP_PANEL','何把最初的船等和后面的改口往返读了一次，指着两短');
add(40,'T_VOICE_CONSENT','小何可以一个人先看，连你自己那页。');
add(40,'P_RO_WORK_PAGES','回家把三页放好，另取下午的大字四页。');
save(path.join(stage,'tracking-transformations.json'),pairs);save(path.join(stage,'evidence-replacements.json'),mapping);save(path.join(stage,'desired-snapshots.json'),ss);save(path.join(stage,'missing-evidence.json'),missing);
console.log(JSON.stringify({snapshots:ss.length,replaced_anchors:mapping.length,missing},null,2));
