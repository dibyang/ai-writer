import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
const A=path.dirname(fileURLToPath(import.meta.url)),P=JSON.parse(fs.readFileSync(path.join(A,'project.json'))).project;
const j=f=>JSON.parse(fs.readFileSync(f)),sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const original=fs.readFileSync(path.join(P,'.writer/drafts/ae-a-record62-original.json'));
assert.equal(sha(original),'683baf1729182b9af47a6f9b4f2fb14ab360aefb433fb69f22edcd30712d9141');
const input=JSON.parse(original),s=j(path.join(P,'.writer/state.json'));
assert.equal(s.revision,355);assert.equal(s.units.length,61);
for(const [ref,hash] of Object.entries(input.source_hashes))assert.equal(sha(fs.readFileSync(path.join(P,ref))),hash,ref);
const draft='正文/0062-改不了的那一份-ae-a-v1.md',bytes=fs.readFileSync(path.join(P,draft)),body=bytes.toString('utf8');
assert.equal(sha(bytes),'b09c6b4ab6693a617b2475af8e49ee4cb066aae8a0084750fc2ed4d85a5c4220');
const ev=quote=>{assert(body.includes(quote),quote);return[{unit:62,quote}];};
input.draft=draft;delete input._instructions;delete input.output;
input.summary='第50日周一。沈接吴新单六盒三纯三混、11:40取、收20，漏记搭配误装四混，三米已卖。10:55发现，11:27吴到场不愿等新批，实际选二纯二混，取消二盒。拆两错盒重配，改原条后真实再收20，四盒40交付，原两盒无待取/退款，未记电话未回拨。二豆一由老板自吃一实弃，老板今日不扣沈钱/不强买；吴不保证再订，新批12:40后无法补原用途。沈迟饭误歇，老板空箱错过同趟取，交清后16:12离店路边坐歇。父准备读旧报吃东西段，沈晚拒全文，双方有真实不快；沈讲订单却急挡父起头被指出，承认口气仍不答应听全。父女吃饭/挪脚凳/有限互认一句不好，不约明晚；父自读，记纸旧字不添拒听记录，末入浅蓝袋，伤脚凳/杖未变。沈自读八册半页原白纸不移，14未借，录音知情不增。';
input.changes={characters:{
'沈禾':s.snapshot.characters['沈禾']+' 第50日周一糕店新单错记，吴到后亲认错，实交四盒实收40/取消二无待取；未扣薪未私掏钱，迟饭误歇16:12才离店路边坐过。晚明确拒父当夜全文，急顶及只讲自己引父不快，认一句不当仍未改拒绝；自读原8册白纸旧位，未借14/无新录音知识。',
'沈成林':s.snapshot.characters['沈成林']+' 第50日周一自准备旧报吃东西段，女返家拒全文，不快并指她只讲自己又挡自己起头；晚互认一处口气仍未念给女听/无明晚约，兴趣可能过去。独低读，原记纸不添拒听账，末两报/纸入浅蓝袋眼镜归盒，脚凳/杖仍旧未换窗椅。只知女晚口述错单四盒/没扣钱等有限事实。',
'谭老板':(s.snapshot.characters['谭老板']||'糕店老板。')+' 第50日周一吴单与沈一同见错，实际重配四盒交客，今日不扣沈/不强买；自吃一豆另一块下午弃，不复售。新批12:40多出，空箱错过同趟收，交接收40无吴待取；对沈柜前喊声仍不快。'
},timeline_append:[
'第50日周一晨：沈接吴六盒三纯三混11:40取，新预付20；记错先装四混，10:55发现，三米已经卖走，顾客未到且无电话。',
'同日11:27起吴实际到场，拒等午后新批，自己选二纯二混、取消二盒；沈重配/改原取条，实际再收20，四盒40交走。二豆留后场，老板一块自吃、另一块下午实弃；不扣沈薪/不强买。',
'同日12:40多新批才出；午饭延后歇坐未成、空箱错过同趟取走。沈交清吴单无待取/余款，16:12离店路边短坐，父电话只问归程。',
'同日晚沈拒父当夜读旧报全文，讲自己订单而急挡父起头引双方不快；吃饭及互认一处坏口气不改拒绝/不约明晚。父独读/原纸不添拒听记录，末收袋仍伤脚凳/杖；沈自读8原白纸旧处。'
],ledger:{
F_AE_ORDER62:{type:'fact',statement:'62吴新糕单六盒最终由顾客亲选改四盒40、二纯二混，取消二无待取；新预付20加实际尾20合40，未付60故无退款，取条原件划旧写新随客带走',status:'resolved',cast:['沈禾','谭老板'],reader_known:'原约三纯三混六份11:40，实际只四盒带走且要另买两份，不因账清而弥补原用途；顾客未保证再订。无电话/无再次联系。',character_known:{'沈禾':'亲接错/认错/重配/改原条/两次收钱及交走四盒，交清无待取。','谭老板':'参与重配、当日交接亲认四盒40无待取。','沈成林':'晚仅听女口述六变四取消/老板不扣等，未现场/未见单。'},evidence:[...ev('取消二盒不取'),...ev('纸上这时才补今日收齐四十几个字。'),...ev('今天店里不再给她另记一笔待取，也不等她补钱。')]},
F_AE_WASTE62:{type:'fact',statement:'62错装重配拆下两豆，一块老板自己午间吃过，另一块下午连托真弃；两错空盒收废纸，未回新盒摞，今日未扣沈钱也不强买',status:'resolved',cast:['沈禾','谭老板'],reader_known:'食品/返工/迟饭/空箱及失去订客信任成本均有限承担，没有全转卖补平/私薪赔付/普遍罚薪规则。',evidence:ev('一块老板自己吃过，一块没能卖，也没人要，真的丢掉了。')},
R_AE_REFUSE_READ62:{type:'relationship',statement:'62沈当晚明确不听父旧报全文，父有失落及不快；晚认口气仍不改拒绝，无约明晚，父兴趣未必能等',status:'intentional-open',cast:['沈禾','沈成林'],reader_known:'两人并非即时和解或谁讲道理获胜，女能讲错单不等父不能想读；父仍能自己读。',character_known:{'沈禾':'知道父想念及自己急挡有伤，仍不答应当夜全文/不把兴趣作为以后必取借条。','沈成林':'知女累及今天不听，承认在外坐过一句有压迫，独读不等新闻后再叫。'},evidence:[...ev('今天还是不想听全文'),...ev('自己也可能已经没了今日这股兴致。')]},
P_AD_FATHER_READING_NOTE58:{custody:{holder:'沈成林',location:'62周一夜两报之间，末回浅蓝袋，袋椅扶手',condition:'原单面旧纸上没找到/店里的人先找钱/后来/念过她也讲了等旧字，今晚不添拒听清单；折口露一点，脚凳与杖仍旧'},reader_known:'父私纸保持记想读，不作女拒听欠账。',evidence:ev('没有拿笔在旁边添今晚不听。')},
P_W_PICTURE_BOOK:{custody:{holder:'沈禾',location:'62周一夜沈房床边',condition:'原8册看半页后合，原白纸仍旧处；不移作新纸，不借得14'},evidence:ev('她把原白纸仍留旧处，书合回床边。')}
}};
const report='审查/AE-A-62-完整实读与纲文回对.md';
input.draft_review={reviewer:'AE A同一原生Codex知情创作自检',report,draft_sha256:sha(bytes),report_sha256:sha(fs.readFileSync(path.join(P,report)))};
fs.writeFileSync(path.join(A,'a-record62-input.json'),JSON.stringify(input,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({ok:true,unit:62,expected_revision:input.expected_revision,source_hashes_preserved:true,original_template_sha256:sha(original),report}));
