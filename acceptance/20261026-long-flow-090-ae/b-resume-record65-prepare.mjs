import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';import assert from 'node:assert/strict';
const a=path.resolve('acceptance/20261026-long-flow-090-ae'),p=path.join(a,'scenario/东岸末班船-66章独立验证');
const read=r=>fs.readFileSync(path.join(p,r)),sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const orig='.writer/drafts/ae-b-record65-original.json',t=JSON.parse(read(orig)),s=JSON.parse(read('.writer/state.json'));
assert.equal(s.revision,363);assert.equal(t.expected_revision,363);for(const [r,h]of Object.entries(t.source_hashes))assert.equal(sha(read(r)),h,r);
t.draft='正文/0065-画到不想给人看-ae-b-v2.md';const text=read(t.draft).toString('utf8');
const ev=(...quotes)=>quotes.map(quote=>{assert(text.includes(quote),quote);return {unit:65,quote};});
t.summary='第53日周四。两女早晨各自准备、下工先回家取物：女取61余8空白中的2/原杯画不动6白留，剪空盒作垫；沈16点后买10普通纸/笔/橡皮3元与刨刀2元手机付5，带14原袋与画纸分开。16:45旧街长凳真见，先共同看14密页随后各画盆叶/斜枝。女未被问便让沈接盆口，沈不快、女硬话后认说早，17:12未散。沈站换角/让出货，店主挪盆，沈不要求复位保留旧观察；女先停沈续，失共同观看。女拒当日再给看；各启第二张，沈叶尖歪半灰，女招牌只一线即被搬走。17:50提醒真收，各带画回，无互赠拍照；女短帮持书袋即交回沈不是提前归还。归家许试做茄子咸了照样吃并留明日，女只述不快未给全画。沈父吃完又有限持看14密页后真交回，沈拒展示自己画，脚仍凳/杖。女夜新枝试改添叉更毛，第二张另试左手/小弯仍不像，酸即停；电话双方承认硬话仍不统一评价，均选明日不带画，只周五19:30女楼下还14/临变先电话。末14沈房干台原袋，原夹纸女浅抽字朝上不改沈未见字，沈8大白纸床边不动。女两新纸桌内另一层/旧杯画与6白原收；沈两画另袋隔纸第二在上/8白留，两录仍母自持无新知。周四棋约未叙述实际履行或取消，不据缺镜头当未发生。';
const adds={
'许蓉女儿':' 第53日周四实取2新纸剪盒板，下工赴16:45约/17:50收。画枝先替沈接盆后沿伤对方，自说我也没碰你纸后认说早；停笔、拒当天再给看，第二纸招牌一线未成，夜添左手习作/单独拇弯。枝下端夜试改有叉/毛，2新画另层自收、6白留家。母只听有限叙述未近看全新画，自己不承诺明日展示；与沈电话各认硬话，明日不带画，周五19:30原楼下还书不变。只知父饭后又持看14已交回/书好，未亲见沈家；原夹纸浅抽最上字朝上不改。',
'沈禾':' 第53日周四下工后手机5元买10纸/笔橡皮刨刀，带14赴约，与女看密页后画盆叶，建议来早不快并有你别嗯了硬话。站换角、店主挪盆不能控制，保旧观察；用2纸余8，第一灰/浅折、第二歪尖半灰，真收带回另隔纸/不夹书不赠图。仅现场见女有限枝与招牌起线，夜听女枝改叉，不知道其左手习作细节；女原自写纸字仍未见。父白天想看被延，晚吃后真交14让父有限持翻同看后收回，自己新画拒给父。夜与女通话各认硬话，选明日不带画、周五19:30女家楼下还原书；末14原袋干台，8/原白纸床边。',
'沈成林':' 第53日周四白天想看14被延且不肯换8，脚仍需凳/杖。晚吃后手干、杯避开再次真持翻14密页、沈在旁同看，偏密不同沈偏浅；问女新画遭今天不看，自己不强取。看够真交回沈，知明天周五19:30女家楼下还，不得续借；未见女友原夹纸字、未见沈新画，无两女争执全部知识。',
'许蓉':' 第53日周四有自己试茄子新做法、咸了仍吃/留明日；只听女画招牌起一条被搬走、接盆口说早/不快，未在现场，不当和解评判人。门边听女又改坏/今天不想给看，未近拿全新画。明日晚归告女先弄饭，不为还书聚齐；周五19:30楼下约仅口述知。两录仍自己手机未转，无填两空/母衣新修。'
};for(const [k,v]of Object.entries(adds))t.changes.characters[k]=(s.snapshot.characters[k]??'')+v;
t.changes.timeline_append=[
'第53日周四16点后沈手机付5买纸笔橡皮刨刀，女取2新纸剪盒板，16:45旧街长凳会面。先共同看14密页再各画盆叶/枝，女先建议接后沿致不快，17:12停点后沈站换角、店主挪盆、女停沈续。',
'同日17:50提醒后真实收，两人各带2新纸回家无赠/图。女第二纸仅招牌起线，沈第二纸歪尖叶半灰；女短帮持书袋立即交回沈，未履行周五借还。',
'同晚父吃后手干、杯避开再有限持14密页/沈在旁同看后真交回，沈拒拿新画，脚凳/杖仍需；末14沈房干台原袋，8大白纸床边，原夹纸女浅抽最上字朝上不添。',
'同夜女枝图局部试改添叉/毛，第二纸添左手及拇弯仍不像，2新画另层自持6白留。两女电话承认各句不妥但未统一喜好，均明日不带画，周五19:30女家楼下还14、临变先电话。母两录无转，周四棋约实际是否履行在本章无叙述。'
];
t.changes.ledger.T_AE_DRAW_MEET64={status:'resolved',reader_known:'65第53日16:45实际赴约坐画，17:50提醒收东西后散；有不快/拒看/各留画，非一次学会或统一审美。',character_known:{'许蓉女儿':'实际在场，有自己先提接盆口/硬话/收纸与拒看；不知沈回家所有心理。','沈禾':'实际在场，换角让出货/盆被转、自己保旧观察；女部分画见过非完整全看。','许蓉':'只听女有限叙述去了及不快，未在现场。'},evidence:ev('四点四十五，她们真坐到了约好的地方','手机振了一下，是姑娘自己定的五点五十分提醒。')};
t.changes.ledger.P_DR_FLOWER_BOOK={reader_known:'65带14赴旧街与女看过即收原袋；女收东西时短帮拿袋即交回沈。晚父再次有限持翻14并交回，末沈房干台原袋，无新湿痕/夹画，周五19:30约待履行。',character_known:{'沈禾':'亲带/收，晚父看后交回；原女夹纸只知浅抽未见字，明日原约还。','许蓉女儿':'现场短提原袋已交回沈，夜只电话知父再看已还/书好，非已收回借书。','沈成林':'晚真再持翻密页与沈同看后交回，知周五19:30还，不持书过夜。'},previous_holder:'沈禾',custody:{holder:'沈禾',location:'65周四夜沈房内干台，书在普通原袋内',condition:'父晚有限持翻已实际交回；旧磨白角留无新湿/坏页/夹画，周五19:30女家楼下还待履行；原女夹纸仍女浅抽最上字朝上且沈未见字'},evidence:ev('再从姑娘手里接回书袋。','沈禾伸手接，他将书平着交回','原袋里没有别的，书平放进去，袋口理好，留在房内干台。')};
t.changes.ledger.P_W_PICTURE_BOOK={previous_holder:'沈禾',custody:{holder:'沈禾',location:'65周四夜沈房床边原处',condition:'原8册/原大白纸保留不画不撕，和借14及两张新画分开'},evidence:ev('她床边的八元册和原大白纸仍在那头')};
t.changes.ledger.P_AE_DRAW61={reader_known:'65原两张杯画不改不带，原余8白取2后余6留家；新枝/手习作用独立两张，不重写旧画。',previous_holder:'许蓉女儿',custody:{holder:'许蓉女儿',location:'65女房桌内旧画原收处，与今日两新纸分层',condition:'61两杯画原隔纸保护未改；原8空白取2新用，6白仍原收处'},evidence:ev('余下六张平放回去，同原两画分在两边','不压旧杯画，也不塞进浅抽。')};
t.changes.ledger.T_AE_LOAN_RETURN63={reader_known:'65夜再次落实第54日周五19:30女家楼下还14，临变双方先电话；双方都不带新画，不延借、不提前算归还。',character_known:{'沈禾':'亲电话确认原袋原书原地点/时间，不带画，临变先电话。','许蓉女儿':'亲确认同地19:30，不一直等/变先电话，自己吃饭安排另定。'},evidence:ev('“那明天就还书。”','“七点半。”姑娘把时间重复了')};
t.changes.ledger.P_AE_SHEN_DRAW65={type:'object',statement:'65沈新购10普通白纸中用2所作盆叶/单叶铅笔画，独立于8册原大白纸',status:'active',cast:['沈禾'],reader_known:'两画仍不会画，第一灰/浅折，第二歪尖半面灰；余8白保留，未赠/拍/夹书。',character_known:{'沈禾':'亲画/收，拒父展示，两张全貌仅自己看全。','许蓉女儿':'现场见部分过程/第二未看全，听电话缺陷，未得图/原画。','沈成林':'只听画坏又画叶的口述，问看被拒未见全画。'},custody:{holder:'沈禾',location:'65夜沈房另装画袋分层，板靠桌脚内侧',condition:'2新画回家另取旧干包装纸各盖，第二在上；8白另留，不夹14/8册'},evidence:ev('她把橡皮收回，没有将纸团起，仍分成两张盖好，只将第二张放在更上面。')};
t.changes.ledger.P_AE_DAUGHTER_DRAW65={type:'object',statement:'65女从61未用白纸取2所作新枝图、招牌起线及夜左手习作，两纸独立于旧杯画',status:'active',cast:['许蓉女儿'],reader_known:'第一枝夜试改叉/毛；第二先招牌一线后夜另处画左手/单独拇弯仍不像，均自留不展示，6白留旧处。',character_known:{'许蓉女儿':'亲画/改/留，明日不带，手酸停。','沈禾':'有限见枝/招牌一线，夜仅口述知枝叉，未见手习作/照片。','许蓉':'只门边/口述知改坏与不展示，未近拿完整审画。'},custody:{holder:'许蓉女儿',location:'65夜女房桌内另一层',condition:'2新纸各隔好，不压旧杯画不入浅抽，不赠沈/无照片'},evidence:ev('在手的旁边画了一小段刚才没画出的拇指侧边','先将今天两张各隔好，放在房里桌内另一层')};
const rr='审查/AE-B-65-恢复完整实读与纲文回对.md';t.draft_review={reviewer:'AE B同一原生知情创作自检',report:rr,draft_sha256:sha(read(t.draft)),report_sha256:sha(read(rr))};
fs.writeFileSync(path.join(a,'b-resume-record65-input.json'),JSON.stringify(t,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({ok:true,expected_revision:t.expected_revision,original_template_sha256:sha(read(orig)),draft:t.draft,draft_sha256:t.draft_review.draft_sha256,changed_ledger:Object.keys(t.changes.ledger),original_sources_unchanged:true}));
