import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
const stage=import.meta.dirname, project=path.resolve(stage,'../works/潮汐信号');
const sha=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const write=(p,v)=>{fs.mkdirSync(path.dirname(p),{recursive:true});fs.writeFileSync(p,typeof v==='string'?v:JSON.stringify(v,null,2)+'\n','utf8');};
const [mode,...args]=process.argv.slice(2);
if(mode==='baseline'){
 const drafts=fs.readdirSync(path.join(project,'正文')).filter(n=>/^00\d\d-.*\.md$/.test(n)).sort();
 if(drafts.length!==24)throw Error('expected exactly 24 baseline drafts');
 const refs=['writer.json','设定/作品定位.md','设定/文风.md','设定/权威规则.md','设定/角色卡.md','大纲/全书大纲.md',...drafts.map(n=>'正文/'+n)];
 const hashes=Object.fromEntries(refs.map(r=>[r,sha(path.join(project,r))]));
 write(path.join(stage,'baseline-hashes.json'),{at:new Date().toISOString(),revision:67,current_state_sha256:sha(path.join(project,'.writer/state.json')),source_hashes:hashes});
 const readings=refs.map(r=>({path:r,purpose:r.startsWith('正文/')?'恢复第一部已发生事实；逐章全文实读':'恢复当前创作约束；全文实读'}));
 for(let i=1;i<=4;i++)readings.push({path:path.join(stage,`ledger-reading-${i}.md`),purpose:'43项当前账本全字段语义阅读；重复路径哈希引用共同锚表，未删知情或证据文字'});
 readings.push({path:path.join(stage,'ledger-anchor-map.json'),purpose:'完整读取账本共同正文锚点路径与哈希'});
 write(path.join(stage,'reading-baseline-input.json'),readings);
 const table='\n## 全文恢复来源及实际SHA-256\n\n|作品相对路径|SHA-256|\n|---|---|\n'+Object.entries(hashes).map(([r,h])=>`|${r}|${h}|`).join('\n')+'\n';
 fs.appendFileSync(path.join(stage,'recovery.md'),table,'utf8');
 console.log(JSON.stringify({revision:67,baseline_drafts:drafts.length,source_count:refs.length,current_state_sha256:sha(path.join(project,'.writer/state.json'))}));
}
if(mode==='volumes'){
 const rows=[
 ['V5','借出去的声音',25,32,[['V5A1',25,27,'兑现饭约并面对第一次公开使用请求','当事人参与的限范围试读方案'],['V5A2',28,32,'让代存责任与日常工钱进入筹备','付出可见代价的有限开放尝试']]],
 ['V6','门口的人',33,40,[['V6A1',33,36,'首次小规模开放与来客需求碰撞','材料能用到哪里的实际争论'],['V6A2',37,40,'修正公开讲述并承担误读后果','阶段回收T_PUBLIC_USE，保留可撤回材料制度']]],
 ['V7','谁来开门',41,48,[['V7A1',41,44,'开放以后维护负担显现','照护劳动与工作冲突'],['V7A2',45,48,'建立有人退出也能运作的责任分配','试行轮值和费用承担']]],
 ['V8','留下的工时',49,56,[['V8A1',49,52,'共同保管经受人手和资金变化','一次实际失约后的替代安排'],['V8A2',53,56,'检查长期开门条件','阶段回收T_KEEPER_SHARE']]],
 ['V9','远处的订单',57,64,[['V9A1',57,60,'沈的职业机会与地方承诺相撞','重新约定有偿劳动范围'],['V9A2',61,64,'异地协作使关系出现距离','以能兑现的安排面对离开可能']]],
 ['V10','有人付钱',65,72,[['V10A1',65,68,'收入和公共使用利益发生分歧','拒绝把旧材料包装成虚构史事'],['V10A2',69,72,'验算声音劳动的可持续代价','阶段回收T_PAID_WORK']]],
 ['V11','潮线以内',73,80,[['V11A1',73,76,'旧站周边实际使用与人的通行需求相遇','共同路线由居民经验修正'],['V11A2',77,80,'在有限空间中落实可进入的地方','T_ROUTE_COMMON形成有责任人的候选办法']]],
 ['V12','各自的日子',81,88,[['V12A1',81,84,'跨过最初一月后的相处与职业选择','不是等待者替另一人决定'],['V12A2',85,88,'将时间与公共空间承诺落到可维持安排','阶段回收T_RETURN_MONTH及T_ROUTE_COMMON']]],
 ['V13','接着生活',89,100,[['V13A1',89,92,'有人撤回或限制自己的讲述','共同材料接受缺口而继续使用'],['V13A2',93,96,'复核授权和余带实际可证范围','不承诺找出全部人名与目录答案'],['V13A3',97,100,'完成公共使用和私人关系的长期选择','回收T_VOICE_CONSENT；未知有明确边界，第一部事实保持']]]
 ];
 for(const [id,title,start,end,arcs]of rows){const v={id,title,start,end,promises:[arcs.at(-1)[4]],constraints:['第一部1—24章为已发生，不推翻T_SIGNAL/T_TAPE/T_HANDOVER/T_LAMP的已兑现范围','罗敬私人失约不设作者答案；新材料不能逆改旧观察','原物按现行custody调用，工作副本不冒充原件'],reserved:['余带中男声与钟确源、剪者与目录命名用意未证，不强行解释','远期具体场景和配角选择待正文形成'],arcs:arcs.map(([id,start,end,goal,payoff])=>({id,start,end,goal,payoff,forbidden:['计划不得登记为已发生事实','无证提前获得他人知识或复制原物']}))};write(path.join(stage,'volumes',id+'.json'),v);}
 console.log('prepared V5-V13; not registered yet');
}
if(mode==='save-template'){
 const n=Number(args[0]);const names=fs.readdirSync(path.join(stage,'commands')).filter(s=>s.endsWith(`-template${n}.stdout.txt`)&&!s.includes('save-template')).sort();
 const f=path.join(stage,'commands',names.at(-1));const v=JSON.parse(fs.readFileSync(f,'utf8'));if(!v.source_hashes)throw Error('template source hashes missing');
 write(path.join(stage,`unit-${n}-before.json`),v);console.log(JSON.stringify({unit:n,revision:v.expected_revision,source_hash_count:Object.keys(v.source_hashes).length,template_sha256:sha(f)}));
}
if(mode==='build-record'){
 const n=Number(args[0]);const v=JSON.parse(fs.readFileSync(path.join(stage,`unit-${n}-before.json`),'utf8'));
 const entry=JSON.parse(fs.readFileSync(path.join(stage,`unit-${n}-changes.json`),'utf8'));const current=JSON.parse(fs.readFileSync(path.join(project,'.writer/state.json'),'utf8')).snapshot;
 v.summary=entry.summary;v.changes=entry.changes;
 for(const [name,t] of Object.entries(v.changes.characters??{})){if(current.characters[name])v.changes.characters[name]=`第${n}章当前：${t}；历史有效知情与经历（保留原章次，非当前状态）：${current.characters[name]}`;}
 for(const [id,item] of Object.entries(v.changes.ledger??{})){for(const [name,t]of Object.entries(item.character_known??{})){const old=current.ledger[id]?.character_known?.[name];if(old)item.character_known[name]=`第${n}章当前：${t}；历史有效知情（保留原章次与边界）：${old}`;}}
 write(path.join(stage,`unit-${n}-record.json`),v);console.log(JSON.stringify({unit:n,revision:v.revision,sources:Object.keys(v.source_hashes).length,changes:Object.keys(v.changes.ledger??{})}));
}
if(mode==='review-input'){
 const from=Number(args[0]),to=Number(args[1]),report=args[2];
 const files=fs.readdirSync(path.join(project,'正文')).filter(n=>{const u=Number(n.slice(0,4));return u>=from&&u<=to;}).sort();
 if(files.length!==to-from+1)throw Error('review range incomplete');
 const hashes=Object.fromEntries(files.map(n=>['正文/'+n,sha(path.join(project,'正文',n))]));
 const table='\n## 实读绑定\n\n每项均为全文读取，范围为标题至末行；SHA-256仅绑定版本。\n\n|正文路径|SHA-256|\n|---|---|\n'+Object.entries(hashes).map(([r,h])=>`|${r}|${h}|`).join('\n')+'\n';
 fs.appendFileSync(path.join(project,report),table,'utf8');
 write(path.join(stage,`review-${from}-${to}.json`),{from,to,kind:'model-self-review',report,source_hashes:hashes});
 write(path.join(stage,`reading-${from}-${to}.json`),Object.keys(hashes).map(r=>({path:r,purpose:`第${to}章后滚动连读${from}—${to}，逐章全文；模型知情审查`})));console.log(JSON.stringify({from,to,report,hashes}));
}
if(mode==='review-mirror'){
 const from=Number(args[0]),to=Number(args[1]);const input=JSON.parse(fs.readFileSync(path.join(stage,`review-${from}-${to}.json`),'utf8'));
 const canonical=input.report, mirror='审查/'+path.basename(canonical);fs.mkdirSync(path.join(project,'审查'),{recursive:true});
 fs.copyFileSync(path.join(project,canonical),path.join(project,mirror),fs.constants.COPYFILE_EXCL);
 input.report=mirror;write(path.join(stage,`review-${from}-${to}-compatible.json`),input);
 console.log(JSON.stringify({canonical,mirror,canonical_sha256:sha(path.join(project,canonical)),mirror_sha256:sha(path.join(project,mirror))}));
}
if(mode==='preserve30'){
 const dir=path.join(stage,'rewind30-before');fs.mkdirSync(dir,{recursive:true});
 const files=[['正文/0030-桌子这一头.md',path.join(project,'正文/0030-桌子这一头.md')],['state.json',path.join(project,'.writer/state.json')],['unit-30-before.json',path.join(stage,'unit-30-before.json')],['unit-30-record.json',path.join(stage,'unit-30-record.json')],['unit-30-changes.json',path.join(stage,'unit-30-changes.json')],['plan-30.json',path.join(stage,'plan-30.json')]];
 const m=[];for(const [name,src]of files){const dst=path.join(dir,name);fs.mkdirSync(path.dirname(dst),{recursive:true});fs.copyFileSync(src,dst,fs.constants.COPYFILE_EXCL);m.push({source:src,preserved:dst,sha256:sha(src)});}
 write(path.join(dir,'manifest.json'),{reason:'第12日所述第10日擦图误称昨天，最早受影响单元30，无31及后续消费。仅修时间指代，原观察ID知识due与保管全部按原变更逐项重登。',files:m});console.log(JSON.stringify(m));
}
