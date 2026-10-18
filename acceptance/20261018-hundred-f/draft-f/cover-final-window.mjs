import fs from 'node:fs';import path from 'node:path';import {session} from '../session-support.mjs';import {rows,functions,comparison} from './review-data.mjs';
const s=session('draft-f');const report=`# F-F 最终100—106七章窗口连读

实际执行原因：在最终101—106六章全文连读并登记后，check仍提示100—105窗口。101—106报告不能覆盖100。本进程随后又从100开始，按100、101、102、103、104、105、106顺序逐次FastCtx全文读到Complete，七章当前主稿，无未读分页，不把先前六章拼接冒充七章。此次正文均未修改，起点revision401，具体SHA随本次review-template冻结。

100：何一人听59日半面完整一回，沈不再为每句求确认；何可不再看原页，15:09带自己的袋离，纸与音都未带走。明确这一份不排公开，又实际电话补邱。目标是完成当次邀请，不是替未来读者答喜欢；障碍是沈盼回应、何有菜单工作；选择念到末尾、随后留原夹；后果是这次完成且旧退出照旧；关系收益是何能听也能不再看。保留“我今天已经听到末尾”、何回去改四价格，不让她在105突然只当评委。

101：旧记指错与回听欲望，实试索引找回，不添声源。102：真看球且夸错，想被招呼仍留下、周认急；不改81独立球局。103：新收到版本按约核两处、480齐，720未接仍不甘。104：原椅盒占到后清，87被盒占指代已修；老人先走不再回来、葛失临加份自己重放盒、陶11走，沈拒每天。105：新开头实划去，重写本人虚荣/不甘，何自己核菜单且仅获正在看；新窄夹与95旧半面不合。106：周站里口述数箱后不想读，新页推中未交、收夹带回，沈失望仍愿留坐，牵手后各归。

对照100/106：都有私人新页，但100是何真听一回且前次看过，106周当下明确不读也未接纸；不能把未读换成另一位来读来保持人数。对照100/105：何在100亲说要回去把价格放大挪行，105现场操作、核两小合装、带走新旧样而非一句“她很忙”；劳动推进且没有虚报款或全单批准。对照102/106：前者误解后谈清当次球，后者不要求评价也愿意继续今晚，不再演输球道歉。其他101/103工作与生活相似结构、104/105帮助主语差异均已在本次重新连读中确认，无须为差异添阴谋。

## 真人语言别扭句
### 真人语言硬问题
没有

对话复述、动宾拆分、具体落地、逐句内读四项核对了100念纸/何离，101取半包面，102放勺吹汤，104盒占到腾空，105划稿重抄，106灶位/纸收回/碗留桌后端水槽；没有新确认错误。否定叙述与日常小物整理偏密为可选风格观察，不自动必改。

事实与归属：27单页/31两页/95半面/105新页各分开；106周只听自述范围与想被谢，不读全文/原稿，何不看105新页。何不亲见97盒，唐只电话新知，老人不知椅后腾空。周数箱是口述，不是沈见证。103480不重算、720不作欠款；何菜单不作已到账。余带/罗私事/旧款/公屋新时段/长期经费人手/雨季通路无新结论。

结论：本次真实七章连读补100—105范围，保留97—103开写前报告、修前六章报告、保护尾段报告与最终六章报告；历史stale不删。当前无需进一步修改，仍106停笔、paused仅discuss/plan，两范围null。知情模型自检，不是文学定稿/真人盲读/正式验收。
`;
const ref='审查/F-F-100-106最终七章窗口连读.md';fs.writeFileSync(path.join(s.project,ref),report,{flag:'wx'});s.write('final-window-review-100-106.md',report);
const t=s.run('last-review-template-100-106',['review-template','--from','100','--to','106'],{entry:'embedded'}).value;
Object.assign(t,{report:ref,operation_id:'draft-f-final-100-106-r401',chapter_functions:functions([[100,'完成何一人当面听59日半页一回','沈想反复确认且何要回去改菜单','念至末尾、不排公开、纸留原夹','何15:09无纸无音离，补回话邱','何可听也可不再看，不替未来人答','我今天已经听到末尾。'],...rows]),comparison:{...comparison,similar_structures:[...comparison.similar_structures,{units:[100,106],judgment:'都有私人页，100真听与106真不读均由当时人选择。',differences:'100何听至末尾且可不再看，106周未接未读仍愿相处；不补第三人读凑结果。',preserve:'当次意愿、各自疲惫与工作、纸实际归沈。',optional_adjustments:[],uncertainty:'知情自检不代真人反应。',evidence:[{unit:100,quote:'我今天已经听到末尾。'},{unit:106,quote:'我想再坐。没给你看成，也想。'}]}],distinct_gains:['100：当次听完与不排公开，何回去自己劳动',...comparison.distinct_gains],limits:'本次100—106七章当前主稿另行顺序全文连读，不借前次101—106代替100。'}});
const result=s.run('last-review-100-106',['review'],{input:t,entry:'embedded'});s.write('last-review-result.json',result.value);console.log(result.value);
for(const [label,args] of [['doctor',['doctor']],['check',['check']],['status',['status']],['discussion',['context','--purpose','discussion']],['identify',['tool','identify']]]){const r=s.run('last-'+label,args,{entry:'embedded'});s.write('last-'+label+'.json',r.value);console.log({label,ok:r.value.ok,revision:r.value.revision,units:r.value.units,rolling_review:r.value.rolling_review});}
