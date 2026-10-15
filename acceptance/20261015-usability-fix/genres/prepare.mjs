import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
const base = 'acceptance/20261015-usability-fix';
const out = `${base}/genres`;
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const write = (p,s) => { fs.mkdirSync(path.dirname(p),{recursive:true}); fs.writeFileSync(p,s,'utf8'); };
const json = (p,v) => write(p,JSON.stringify(v,null,2)+'\n');
const status=spawnSync('git',['status','--short'],{encoding:'utf8'});
write(`${out}/git-status-start.txt`,status.stdout);
const listing=spawnSync('git',['ls-files','--cached','--others','--exclude-standard','-z'],{encoding:'utf8'});
if(listing.status!==0) throw new Error(listing.stderr);
const allowed=p=>p.startsWith(`${base}/genres/`)||p.startsWith(`${base}/works/借一把椅子/`)||p.startsWith(`${base}/works/字放回格子里/`)||p.startsWith('.tmp/');
const protectedFiles=[...new Set(listing.stdout.split('\0').filter(Boolean))].filter(p=>!allowed(p)&&fs.existsSync(p)&&fs.statSync(p).isFile()).map(p=>({path:p,sha256:hash(p)}));
json(`${out}/protected-before.json`,{created_at:new Date().toISOString(),files:protectedFiles});
const refs=['设定/作品定位.md','设定/文风.md','设定/权威规则.md','大纲/全书大纲.md'];
const common='\n本轮是同一会话中的知情实读与润色，原稿保真登记用于版本追踪，不代表原稿已通过文体审查。只验证单单元；没有续章。\n';
const configs=[{
 title:'借一把椅子',kind:'screenplay',fixture:'screenplay.md',
 positioning:'# 作品定位\n\n单场中文生活短剧文字，面向普通成年观众。社区活动室夜间，两人围绕次日借用两把椅子协商；用办借用手续和挪椅子的行动呈现照顾。暂按舞台或小成本影像均可排演的文字稿处理，不扩写镜头或生成视频。预计排演 1—3 分钟，仅为未排演估计。\n'+common,
 style:'# 文风\n\n朴素、克制，温暖从手续和动作中出来。许安解释借用理由，方姐讲数目、归还和门口通行；保留关心方式的差异，不加统一口头禅。对白可以有必要的辩解和重复；动作须可见、可听、可表演。不以小说心理和抽象总结替代场面。\n',
 rules:'# 权威规则\n\n唯一剧情来源是审查目录的字节级原稿备份；不得新增情节或人物经历。夜晚社区活动室，许安持签到册，方姐在门口持库房钥匙。总计二十五把，二十三把已回库房，桌边两把借出；只推动其中一把到墙边，两把都留室内。明早九点老梁登记，借用单写明早十点归还。方姐不用签到册，另出借用单并收好；钥匙无交接，不能增写锁走椅子。\n\n原稿基线保留全部文字；正式修订才移除不可表演心理及多余提示。\n',
 outline:'# 全书大纲\n\n仅一场，unit=1，不按集混编。\n\n许安请求两把椅子留一晚；方姐以二十五把总数提出责任；许安说明二十三把已入库和老梁九点登记的需要；借用手续把责任说清；方姐收单、挪一把椅子，许安确认借用，方姐用“别堵门”收束。修订不增补次日现场。\n',
 plan:{unit:1,title:'借一把椅子',goal:'许安借两把椅子留一晚，免得明早九点来登记的老梁站着',change:'方姐要求写借用单和归还时间，收单后把一把椅子推到墙边，两把均留下',beats:['内景·社区活动室·夜；许安持签到册、方姐在门口持库房钥匙，桌边两把椅子','方姐要求总数二十五把有交代，许安说明二十三把已回库房，借两把给明早九点来登记的老梁','签到册未被接取；方姐另给借用单，要求写两把和归还时间，许安写明早十点','方姐收借用单并推一把椅子到墙边，最后以别堵门确认借用；预计排演1—3分钟，未实测'],cast:['许安','方姐'],setting_refs:refs,research_refs:[],forbidden:['不改变25=23+2和只挪1把','不改变夜晚、明早九点/十点','不新增心理、经历、对白目的或钥匙交接']}
},{
 title:'字放回格子里',kind:'history',fixture:'history.md',
 positioning:'# 作品定位\n\n面向普通读者的短篇历史散文，单章讨论沈括所记活版中的备印、分类保管和少量印制限制。沿用已有叙述，去掉重复解释和无证据的文明赞叹；保留作者温和讲解的语气。证据仅限作者本次提供的事实卡与引文，不联网。\n'+common,
 style:'# 文风\n\n清楚、平实，有叙述者分寸。不把史料铺成工序奇观，不替毕昇写心声，不增加现场感官。有效对比、舒展解释和证据限定不因扫词命中而删。字印、韵与木格由原稿已知用法说明，不新增制度结论。\n',
 rules:'# 权威规则\n\n研究/history-facts.json 是用户提供事实卡的逐字节副本，保留其 verified 声明、三条 claims、所有引文、checked_at、boundary 和 source_dependency。本轮只核对所给引文与正文一致性，不把该声明解释为本轮重新核验网页或古籍版本。唯一史源是沈括《梦溪笔谈》卷十八·技艺活版条，三条卡片不是独立互证。\n\n保留“之”“也”、二十多枚/二十馀印、三、二本、两处正文引文及全部否定和推断限定。不得推算库存、计时、传播、标准化或成功原因，不新增对白、心理、天气、精确动作或历史现场。解释可删重复，不删证据边界。事实卡中未在原稿展开的胶泥、加热、奇字、较大印量不扩写成新段落。\n',
 outline:'# 全书大纲\n\n单章 unit=1。以常用字备多枚字印及直接引文起笔；转到按韵标记、木格保管；说明功能解释和实际库存、寻找时间、人物心理的证据边界；以少印三、二本未为简易的史料限定收束，不把该条材料升级为文明成功原因。\n',
 plan:{unit:1,title:'字放回格子里',goal:'以已给沈括记载解释备印与分类保管，并保留少量印制的条件限定',change:'读者从常用字备印理解再次取用的工序功能，同时知道材料不能证明库存、耗时或毕昇内心',beats:['转述常用字之、也各备二十多枚并保留整段直接引文','说明按韵、纸条标记和木格贮存，删作者重复解释但不扩展新工序','完整保留不是库存表、不能推算数量、不知道寻找耗时，以及工序解释并非人物心理独白的限定','保留若止印三、二本，未为简易引文，以有边界的条件收束'],cast:[],setting_refs:refs,research_refs:['研究/history-facts.json'],forbidden:['不联网，不扩展给定材料以外历史细节','不改引文、数值或限定','不新增对白、心理、现场或责任结论']}
}];
const copies=[];
for(const c of configs){
 const p=`${base}/works/${c.title}`;
 write(`${p}/设定/作品定位.md`,c.positioning);
 write(`${p}/设定/文风.md`,c.style);
 write(`${p}/设定/权威规则.md`,c.rules);
 write(`${p}/大纲/全书大纲.md`,c.outline);
 json(`${p}/.writer/plan-input-baseline.json`,c.plan);
 const src=`${base}/fixtures/${c.fixture}`;
 const before=`${p}/审查/去味-0001-${hash(src).slice(0,8)}-before.md`;
 fs.copyFileSync(src,before,fs.constants.COPYFILE_EXCL);
 copies.push({kind:c.kind,input:src,input_sha256:hash(src),backup:before,backup_sha256:hash(before),draft:`${p}/正文/0001-${c.title}.md`});
 if(c.kind==='history'){
   fs.copyFileSync(`${base}/fixtures/history-facts.json`,`${p}/研究/history-facts.json`,fs.constants.COPYFILE_EXCL);
   json(`${p}/研究/来源范围.json`,{provided_by:'用户本次验证材料',original:`${base}/fixtures/history-facts.json`,sha256:hash(`${p}/研究/history-facts.json`),read_coverage:'3/3 claims; all sources excerpts, boundaries, dependencies read',verification_scope:'仅核对给定事实卡和引文；未联网或独立核古籍',provided_status:'verified; 保留原声明，不冒充本轮外部核验'});
 }
}
json(`${out}/baseline-manifest.json`,{created_at:new Date().toISOString(),copies});
console.log(JSON.stringify({prepared:copies,protected_files:protectedFiles.length},null,2));
