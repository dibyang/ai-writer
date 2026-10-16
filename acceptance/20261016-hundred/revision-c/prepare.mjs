import fs from 'node:fs';import path from 'node:path';import {isDeepStrictEqual as same} from 'node:util';import {stage,work,read,write,hash,manifest} from './phase.mjs';
const oldState=read(path.join(stage,'before/work/.writer/state.json'));const original=read(path.join(stage,'original-snapshots.json'));
const changes=[],proposed=new Map();
function edit(rel,line,from,to){const b=proposed.get(rel)??fs.readFileSync(path.join(stage,'before/work',rel),'utf8');const lines=b.split('\n');if(!lines[line-1]?.includes(from)){const hits=lines.map((x,i)=>x.includes(from)?i:-1).filter(i=>i>=0);if(hits.length!==1)throw Error(`Missing or ambiguous ${rel}:${line}:${from}`);line=hits[0]+1;}const before=lines[line-1];const after=before.split(from).join(to);lines[line-1]=after;proposed.set(rel,lines.join('\n'));changes.push({file:rel,line,before,after,from,to});}
function body(n,l,a,b){edit(oldState.units[n-1].draft,l,a,b);}
for(const[n,l]of [[41,45],[41,47],[42,15],[43,61],[44,7],[48,13],[49,71],[50,9],[50,11],[50,13],[50,51],[50,61]])body(n,l,'八十','九十');body(50,47,'严的八十','严的九十');
body(62,29,'选了第四遍','选了第三遍');body(64,27,'所选第四遍','所选第三遍');body(69,19,'程蔚选第四遍','程蔚选第三遍');
body(76,65,'九点半到十点半','九点半到十点四十五');
body(80,1,'十点半以后','十点四十五以后');body(80,15,'十点半','十点四十五');body(80,39,'十点半，葛看过','十点四十五，葛看过');body(80,71,'九点半到十点半','九点半到十点四十五');
body(86,63,'九点半到十点半','九点半到十点四十五');body(86,67,'九点半至十点半','九点半至十点四十五');
body(88,53,'何起身去读，读到','何起身去读，读清九点半至十点四十五，读到');
const planEdits=[
 [41,35,'顾14点可来、工钱先说','顾14点可来、上门查看调试90由严接受、换材另议，工钱先说'],
 [42,5,'严实付80','严实付90'],[42,32,'严当面付80','严当面付90'],[44,28,'严带80收据','严带90收据'],[50,5,'核已批80返严','核已批90返严'],[50,31,'80返严','90返严'],
 [62,30,'沈提出录一次真实等待让主讲自行选','第三与第四遍都录且留等待，主讲听过两遍后选原第三遍，两遍均保留'],
 [64,33,'17:12交第三日及三日总记录、陆另一机试开梁核齐','17:12交第三日及三日总记录、陆另一机按原第三遍选择试开梁核齐'],
 [67,23,'第四遍号','第三遍号'],[69,29,'36第四遍','36第三遍'],
 [76,30,'9:30—10:30','9:30—10:45'],[80,3,'十点半以后','十点四十五以后'],[80,29,'老人自己选择起身再坐','老人到原约末10:45自己选择起身再坐'],[80,31,'先继续晨间留椅','先继续9:30—10:45晨间留椅'],
 [86,4,'实际走过续留期限的最后一晨','亲见续留期限末晨9:27—10:40一段，不见10:40—10:45末五分钟'],[86,5,'原椅在9:30至10:30由葛亲清留空/老人用坐不消费','原约9:30至10:45，沈亲见本晨9:30清位至10:40离店，老人10:30自主离去不消费'],[86,30,'10:30以后结束本段，葛只续一周并实改店门告示，沈带点心归家准备晚约','葛在老人10:30自主离前续55—61除58店休的9:30—10:45并实改告示，沈10:40带点心归家、不见末五分钟，准备晚约'],
 [88,35,'何亲读55—61/58休告示','何亲读55—61晨9:30—10:45/58休告示']
];
for(const[n,l,a,b]of planEdits)edit(`大纲/单元/${String(n).padStart(4,'0')}.json`,l,a,b);
for(const[rel,text]of proposed){const file=path.join(work,rel),before=fs.readFileSync(file,'utf8');if(before!==text)fs.writeFileSync(file,text);}
write(path.join(stage,'file-edits.json'),changes);
const candidates=read(path.join(stage,'snapshot-candidates.json'));
const rules=[];
for(const c of candidates){
 let after=c.text;let reason;
 const isMoney=((c.first>=41&&c.first<=50)||c.text==='历史有效信息（原章时点）：第42章：自己上门80实收')&&/80|八十/.test(c.text)&&!/(?:约80分钟|四百八十|一百八十)/.test(c.text);
 // Only individually reviewed door-fee sentences are selected; no bare replacement on a character history.
 if(isMoney){after=c.text.replace(/(?<!\d)80(?!\d)/g,'90').replace(/(?<![一四]百)八十/g,'九十');reason='author-door-fee-90';}
 if(/第四遍/.test(c.text)&&!c.paths.some(p=>p==='snapshot.ledger.O_PHOTO_WAIT_62.statement')){after=c.text.replaceAll('第四遍','第三遍');reason='author-original-third-take';}
 if(/9:30[—至]10:30/.test(c.text)){after=c.text.replace(/9:30([—至])10:30/g,(_,sep)=>`9:30${sep}10:45`);reason='author-seat-until-1045';}
 if(c.text==='48日10:18沈到葛铺亲见第三晨后段与过10:30老人自起再坐'){after='48日10:18沈到葛铺亲见第三晨后段与到10:45约末老人自起再坐';reason='author-seat-until-1045';}
 if(c.text==='葛当前口述46沈离后/47至10:30清位，老人当前回顾47约9:50—10:10亲坐'){after=c.text.replace('至10:30清位','至10:45清位');reason='author-seat-until-1045';}
 if(c.text==='前天沈走后，同样留到十点半'){after='前天沈走后，同样留到十点四十五';reason='author-seat-until-1045';}
 if(c.text==='先试明天到四十八日，九点半到十点半，这把我开门时清'){after=c.text.replace('九点半到十点半','九点半到十点四十五');reason='author-seat-until-1045';}
 if(/第86章：只54店内全时窗亲见及新纸/.test(c.text)){after=c.text.replace('只54店内全时窗亲见及新纸','只亲见54店内9:27—10:40与新纸，未见10:40—10:45末五分钟');reason='author-seat-bounded-witness';}
 if(c.text==='86已到54末晨：本章9:30清椅到10:30老人自离实际执行，49/50/52/53及51关门来自葛当前自述，未冒称沈全见所有晨'){after='86已到54末晨：沈亲见9:30清椅、10:30老人自主离与离后空位至10:40，未见原约末10:45前最后五分钟；49/50/52/53及51关门来自葛当前自述，不作所有晨全程亲验。有限期限阶段回收不等永恒保证';reason='author-seat-bounded-witness';}
 if(after!==c.text)rules.push({...c,after,reason});
}
// Apply longest exact sentence first so historical prefixes retain their own identity.
rules.sort((a,b)=>b.text.length-a.text.length);
const fieldChanges=[];
function transform(v,p,n){if(typeof v==='string'){let a=v;for(const r of rules)if(r.paths.includes(p))a=a.split(r.text).join(r.after);if(a!==v)fieldChanges.push({unit:n,path:p,before:v,after:a});return a;}if(Array.isArray(v))return v.map((x,i)=>transform(x,p+'.'+i,n));if(v&&typeof v==='object')return Object.fromEntries(Object.entries(v).map(([k,x])=>[k,transform(x,p+'.'+k,n)]));return v;}
const desired=original.map((s,n)=>transform(s,'snapshot',n));
const pending='当前作者与读者核查范围：第27章当面改词单页最后明确留邱，后续实体去向本批未核，不能并入第31章缺名两页，也不能宣布全部版本都已处理；不据此推定丢失、归还或销毁。罗另留归宿说明，37回还的是沈自页三页组内一张。角色须依亲历或后续实际核问使用该信息，本次回读不新增何映现位置知识。';
for(const id of ['T_PAGE_PAIR','T_VOICE_CONSENT']){const e=desired[90].ledger[id];const before={statement:e.statement,reader_known:e.reader_known};e.statement+=' '+pending;e.reader_known+=' '+pending;fieldChanges.push({unit:90,path:'snapshot.ledger.'+id,before,after:{statement:e.statement,reader_known:e.reader_known},reason:'late-reader-author-audit-scope-only'});}
// Rebind every old anchor to the same draft and original line. Repeated quotes are resolved at that original location, never by first global occurrence.
const evidenceAudit=[];for(let n=0;n<=90;n++)for(const[id,e]of Object.entries(desired[n].ledger??{}))for(let i=0;i<(e.evidence??[]).length;i++){
 const anchor=e.evidence[i],old=original[n].ledger[id].evidence[i];const file=path.join(work,anchor.draft);const b=fs.readFileSync(file);const line=b.toString('utf8').split(/\r?\n/)[anchor.line-1];
 if(!line?.includes(anchor.quote))throw Error(`Anchor mismatch ${n}:${id}:${i}:${anchor.line}:${anchor.quote}`);
 anchor.sha256=hash(b);
 if(n===90)evidenceAudit.push({id,index:i,original:old,current:anchor,classification:old.quote===anchor.quote?'quote-preserved':'intentional-author-replacement',same_original_line:old.line===anchor.line});
}
for(let n=0;n<=90;n++)for(const[id,e]of Object.entries(original[n].ledger??{}))if(e.type==='observation'){
 if(desired[n].ledger[id].statement!==e.statement||!same(desired[n].ledger[id].author_truth,e.author_truth)||Object.hasOwn(desired[n].ledger[id],'author_truth')!==Object.hasOwn(e,'author_truth'))throw Error('Observation mutated '+n+':'+id);
}
for(let n=0;n<=40;n++)if(!same(original[n],desired[n]))throw Error('Prefix changed '+n);
write(path.join(stage,'snapshot-rules.json'),rules);write(path.join(stage,'desired-snapshots.json'),desired);write(path.join(stage,'desired-field-edits.json'),fieldChanges);write(path.join(stage,'evidence-audit.json'),evidenceAudit);
const summaryEdits={41:[['上门查看调试80','上门查看调试90']],42:[['严实转80','严实转90']],44:[['原80据','原90据']],50:[['姚转80','姚转90']],62:[['选第四遍','选第三遍']],69:[['对36第四遍','对36第三遍']],76:[['9:30—10:30','9:30—10:45']],80:[['过10:30后','到10:45约末后'],['留至10:30','留至10:45'],['9:30—10:30','9:30—10:45']],86:[['9:30—10:30留位','9:30—10:45留位'],['10:40沈持自购两糕离','10:40沈持自购两糕离，未见约末前最后五分钟']]};
const summaries=oldState.units.map(u=>{let x=u.summary;for(const[a,b]of summaryEdits[u.unit]??[]){if(!x.includes(a))throw Error('Missing summary phrase '+u.unit+':'+a);x=x.split(a).join(b);}return {unit:u.unit,summary:x};});write(path.join(stage,'desired-summaries.json'),summaries);write(path.join(stage,'summary-edits.json'),summaries.filter(x=>x.summary!==oldState.units[x.unit-1].summary).map(x=>({...x,before:oldState.units[x.unit-1].summary})));
console.log(JSON.stringify({files:[...new Set(changes.map(x=>x.file))],edits:changes.length,rules:rules.length,fields:fieldChanges.length,replaced_quotes:evidenceAudit.filter(x=>x.classification!=='quote-preserved'),observations:Object.values(desired[90].ledger).filter(x=>x.type==='observation').length}));
