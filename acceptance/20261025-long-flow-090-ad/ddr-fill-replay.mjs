import {fs,path,base,sha,assert} from './c-utils.mjs';
const n=Number(process.argv[2]);assert([58,59,60].includes(n));const info=JSON.parse(fs.readFileSync(path.join(base,'ddr-revision-private.json'))),p=info.workspace;
const rd=r=>fs.readFileSync(path.join(p,r),'utf8'),js=r=>JSON.parse(rd(r)),sv=(r,v)=>fs.writeFileSync(path.join(p,r),typeof v==='string'?v:JSON.stringify(v,null,2)+'\n',{flag:'wx'});
const x=js(`.writer/drafts/ad-dr-rev-replay${n}-original.json`),c=js(`.writer/drafts/ad-dr-rev-context${n}.json`),t=rd(x.draft),h=sha(Buffer.from(t)),han=(t.replace(/^#.*$/gm,'').match(/\p{Script=Han}/gu)||[]).length;
assert.deepEqual(x.source_hashes,c.source_hashes);for(const[r,v]of Object.entries(x.source_hashes))assert.equal(sha(fs.readFileSync(path.join(p,r))),v,r);
const pages=Math.ceil(t.length/1800);for(let i=1;i<=pages;i++){const a=JSON.parse(fs.readFileSync(path.join(base,'read-pages',`ddr-rev${n}-full-p${i}.json`)));assert.equal(a.sha256,h);assert.equal(a.text,t.slice((i-1)*1800,i*1800));}
for(const e of Object.values(x.changes.ledger??{}))for(const v of e.evidence??[])if(v.unit===n)assert(t.includes(v.quote),v.quote);
const detail={
58:'summary：周四早移自报/父另找院门篇、糕店少份实付、父女短移窗椅、沈独读、父另单面纸记意见、真重念与沈讲顾客、约周五均实在，摘要没有把误署扩成父知老板现场；无需改。characters：父只从沈晚谈听其意见，谭只午听找报/见短消息，女仅晚有限文字；父本日未接8且56临借已还历史仍保留。timeline：七项先后与并行仍对。ledger：袋/书/父读关系/父纸/换座/糕客/明日相约七项均适配，原观察不动。evidence：全部本章引文仍真实且未改动；只有问话人名字变，不含在既有ledger引文内。downstream：59父问两画和两友相约、何听戏等不受老板问话归属改变，60仍分线；保守重登59—60而非略过。',
59:'summary：原3738汉字两段之后实际续到收书/分别/洗头/面店/母何交班与夜读，仍完整且没有偷换工作/相约。characters：女自己交错行/母夸的当面告知、沈未见布、何昨夜只自述慢段一点、母只知女有限回话，全保留；58说话人修正没有把老板现场给父/女/何共享。timeline：16:30先到/16:45来/17:11收、约17:15走、18:30交班与面店并行核对。ledger：相约resolve与两册原纸原主、朋友求夸、何自述、各自当晚六项实际相同。evidence：逐条仍本章真实子串。downstream：60何实际发新定位前女未知，60夜女才告母遗杯；无新约/图照/换书，原始前两段顺序一次仍可证。',
60:'summary：周六母自纸找听/原两空留、实际新分享异唱、午后独录、周有限柜电话/棋局/各买菜/独坐/自晚饭、16点班18:30交钥匙后唱、母女真听不跟唱/晚录保留，仍全部适配。characters：何只听口语及现场起句未听两录音，女夜听母口述才知何分享，母夜听女口述才知遗杯；周不知许线、只电话知柜当日。timeline：九项并行线和录制先按后问顺序均可实做。ledger：母纸/灯/何有限听述/柜电话/周出门/两录音/母女来往七项实在；原柜门和收讫纸位置仅口述不变历史，旧款不重收。evidence：本章各引文保持真子串。downstream：到60止，录音两条不外转/母原纸关灯，不凭此结长期、复航、父伤或父辈史。'
}[n];
const report=`审查/AD-DR-revision-${n}六字段整章重登核对.md`;
const original=n===58?'772badfddd9c7a820c07b604bceaf5f3df402b330d1723a3236d6e0d38fc9c40':n===59?'57a514d2e1ca93b08536802e4c08bae9fcf261cf4c33a10e926895ce05fa6e71':'b34e30cef34d30aee6f2cc7f8429dfec7f3934b0ec04a96c3f2a324980b1f777';
sv(report,`# AD D独立revision ${n}整章/六字段核对

审查者Codex，原生同ID模型知情自检，非独立读者/真人或作者定稿。本修订仅I_AD_DR58_SPEAKER，from58 through60，基线主r292。区内当前${x.draft} SHA256 ${h}，去标题汉字${han}；ddr-rev${n}-full-p1至p${pages}完整覆盖${t.length}字符，已实际分页读且同SHA切片校验。写前context与模板均在本次独立区保存，当前source_hashes逐项相同且与实文件匹配；这是历史重登输入，不冒称59首停的原模板。主59原context/template与两冻结段仍保留。

## 真实改动和纲文

${n===58?'旧稿SHA '+original+'；唯一正文变化为沈禾问老板怎么说→沈成林问老板怎么说。区内旧稿与刚完成的主六章实读同SHA，另实读区内旧p8再改；旧整稿另存ad-dr-rev58-before.md。有效58细纲仍窗边自读/轻袋/真听，原分段是历史，没有拿旧分段回拼。':'正文与修前SHA '+original+'完全相同；当前上游58仅问话人澄清，没有新增事实。仍依本章原有效细纲逐项核实际完整正文，不将自动replay草案等同语义无变化。'}

## 六字段实核

${detail}

对照本次全文、原登记摘要/差量和当前前缀，以上六项确认事实及引文未受单句人名澄清改变，保留自动恢复的真实差量。未全表回写旧知识；14/8/18未购20未动、门40+10=50/抽屉18/柜46+12实58、三宽条已各1.5吃净、课堂48旧段/52旧尾/57新角不改。无设定/计划源变化，不需要stage历史设定；正文承接的新SHA由区内当前context正常重登，旧来源哈希不刷回旧模板。

## 真人语言别扭句

有没有哪句话意思能够看懂，却让你觉得别扭、像为了写得漂亮硬拼出来，或者不像一个人当面会这样说？

### 真人语言硬问题
没有

${n===58?'当面问答与角色知识交叉复核：父听女讲糕店后问老板，女回答才有信息入口，他回看自己先问买没买的急口，称谓与他/她一致；原错已修。':'以当面说话、动宾拆分、具体落地、默读改口核查，无新增确认硬伤；此前可选省略用语/否定旁白密度不升级必改。'}不是按机械check称文学通过，未真人朗读。物件和钱款以当前登记正文及原观察为准。

本报告供本章preview/record重登，完整58—60尾段将在全部重登后再次连读/正式review；不先宣称prepare或提交完成。源码/真实作品/AC/X/前57章不改，不Git提交发布。
`);
x.replay_review={reviewer:'Codex AD D same-ID revision six-field informed review',report,draft_sha256:h,checked_fields:['summary','characters','timeline','ledger','evidence','downstream']};
x.draft_review={reviewer:'Codex AD D same-ID revision complete-chapter informed self-review',report,draft_sha256:h,report_sha256:sha(Buffer.from(rd(report)))};
sv(`.writer/drafts/ad-dr-rev-replay${n}-filled.json`,x);
fs.writeFileSync(path.join(base,`ddr-rev${n}-replay-audit.json`),JSON.stringify({unit:n,draft:x.draft,sha256:h,han,pages,context_source_hashes_verified:true,source_protocol:'区内历史重登，不刷新主59原模板',checked_fields:x.replay_review.checked_fields,actual_changes:n===58?'沈禾→沈成林说话人':'正文零字节变化，事实逐项复核保留',report,report_sha256:x.draft_review.report_sha256},null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({ok:true,unit:n,han,pages,input:path.join(p,`.writer/drafts/ad-dr-rev-replay${n}-filled.json`)}));
