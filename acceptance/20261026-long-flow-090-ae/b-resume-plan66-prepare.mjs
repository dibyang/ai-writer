import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';import assert from 'node:assert/strict';
const a=path.resolve('acceptance/20261026-long-flow-090-ae'),p=path.join(a,'scenario/东岸末班船-66章独立验证'),s=JSON.parse(fs.readFileSync(path.join(p,'.writer/state.json'))),sha=b=>crypto.createHash('sha256').update(b).digest('hex');
assert.equal(s.revision,365);assert.equal(s.units.at(-1).unit,65);
const refs=['大纲/单元/0066.json','大纲/AE新增骨架-61-66.md','大纲/分卷/V23.json'];
const consumers=refs.map(ref=>({ref,sha256:sha(fs.readFileSync(path.join(p,ref))),units:s.units.filter(u=>Object.hasOwn(u.source_hashes??{},ref)||Object.hasOwn(u.source_bindings??{},ref)).map(u=>u.unit)}));
fs.writeFileSync(path.join(a,'b-resume-66-consumers-after65.json'),JSON.stringify({at:new Date().toISOString(),revision:s.revision,consumers},null,2)+'\n',{flag:'wx'});
assert.equal(consumers[0].units.length,0,'66 already consumed');
for(const ref of refs)fs.writeFileSync(path.join(a,'originals/b-resume-'+(ref.includes('0066')?'plan66':ref.includes('V23')?'volume23':'skeleton61-66')+'-before'),fs.readFileSync(path.join(p,ref)),{flag:'wx'});
const x=JSON.parse(fs.readFileSync(path.join(p,refs[0])));
x.goal='第54日周五，从各自生活与昨夜实际选择接到19:30女家楼下，真实交还63借出的14。至少16000正文汉字，普通完整章；还书只结本次借阅，非终局。以65现稿：14沈房干台原袋、两女均不带新画、女明晚自行先吃/母晚归为起点。';
x.change='沈能按约交回而仍想看那一页；女收回自己的14不须立即再借/展示画，能同朋友短走又各自归家。借来的观看回到各人持有与兴趣，不用统一喜欢/一同进步作和解凭证。';
x.beats=[
'周五白天各自做实际工作/家事：沈看余纸与画但不带，按原约留出饭后路程；父可能还想翻14须实际开口并接受出门还的限制，脚仍需凳/杖，不能自动治好或让父代送。女下工回家自己热昨夜饭/咸茄子并另做有限补充，母已口述晚归，不等母齐饭。新画不出桌内另一层，旧杯画和6白不动。',
'沈出门前真取14与原袋核干净/旧磨白角，8大白纸留家、自己的2画与8白另袋留房；女按时带钥匙下楼，不取浅抽原纸、不带2新画。通行/吃饭可有小代价但不编遗失损坏拖出危机，不把准时变完美人格。',
'19:30原楼下碰面，沈实际将原袋14交出，女双手接稳取出有限查看再收，书/袋真实从沈到女。提及父两次有限看/不同偏好只按已知，不携夹纸回来，不交换新画、不续借承诺；女可以不立即翻沈偏爱的那页。',
'两女愿意沿近街短走一段但各有目标与结束时间，不重演65指导画或全文检讨；可实际买自己所需小物/看物，各付实际价，不借购物消除不快。至少一个提议被拒而仍能说普通话，不强制一起再画/聚齐母父周。',
'分开后女将14带回房与原所有位置，自己决定不重新夹那张原自写纸，原纸仍浅抽最上字朝上，沈依然未见字。母晚归只遇到实际在家的女，若问书按有限事实答、不索新画不转两录、不缝母衣。',
'沈空着原拿书的手回家，8/原大白纸仍床边，自选看8不同页/不再为还书去找照片补14；父仍自己的报/脚凳/杖。女实际自读14可挑非沈指页，没必要今晚再画。小动作结束今晚，不宣布全关系修复，不写67。'
];
x.forbidden.push('65唯一登记v2已写：两女均选周五不带画；女枝夜添叉/毛，第二纸招牌线+左手/拇弯；沈第一灰/浅折、第二歪尖半灰。父65晚真再持看14并交回。不得洗成画都完成/互赠/父从未看。');
x.forbidden.push('周四10点棋约65未叙述履行或取消，66不凭空追补棋结果；新柜无新约报价收费。沈母两录仅知存在数量，不得偷获音频/歌词/录了没内容。');
x.recall_ids=['P_DR_FLOWER_BOOK','P_W_PICTURE_BOOK','T_AE_LOAN_RETURN63','P_AE_SHEN_DRAW65','P_AE_DAUGHTER_DRAW65','P_AE_DRAW61','P_AD_LYRIC_ENVELOPE'];
fs.writeFileSync(path.join(a,'b-resume-plan66-input.json'),JSON.stringify(x,null,2)+'\n',{flag:'wx'});console.log(JSON.stringify({consumers,input:'b-resume-plan66-input.json',consumed_sources_untouched:true},null,2));
