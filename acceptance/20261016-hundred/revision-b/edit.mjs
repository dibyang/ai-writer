import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';
const stage=path.resolve('acceptance/20261016-hundred/revision-b'),work=path.resolve('acceptance/20261016-hundred/works/潮汐信号');
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');const base=JSON.parse(fs.readFileSync(path.join(stage,'baseline.json'),'utf8'));
const edits=[];function edit(rel,pairs){const p=path.join(work,rel),old=fs.readFileSync(p,'utf8');let v=old;for(const[a,b]of pairs){if(v.split(a).length!==2)throw Error('Expected unique replacement '+rel+' '+a);v=v.replace(a,b);edits.push({file:rel,before:a,after:b,kind:/^(?:大纲)/.test(rel)?'consumed-plan':'manuscript'});}if(v===old)throw Error('No edit');fs.writeFileSync(p,v);}
const draft=n=>base.units.find(x=>x.unit===n).draft;
edit(draft(36),[['临车道那块靠车道的一角缺一个半月口','临车道那块靠围挡的一角缺一个半月口'],['半月缺口朝车道','半月缺口朝围挡']]);
edit(draft(42),[['靠车道那块的半月缺口也朝着车道','靠车道那块的半月缺口也朝着围挡'],['一小时核听，二百元','一小时核听，二百四十元']]);
edit(draft(43),[['二百照报','二百四十照报'],['梁秋转来二百','梁秋转来二百四十']]);
edit(draft(44),[['第一次写这个时间时','第十六日下午，她看见纸背那行蓝字时']]);
edit(draft(47),[['十一点零二，钥匙转到底','十一点零四，钥匙转到底'],['比说好的多两分钟','比说好的多四分钟'],['今天九点五十来，眼下又快到十一点一刻','今天九点五十来，眼下又快到十一点二十'],['十一点十三，超市入口','十一点十六，超市入口'],['门我十一点零二锁的','门我十一点零四锁的'],['陈报十一点零二锁门','陈报十一点零四锁门']]);
edit(draft(48),[['车道侧的半月缺口','临车道那块朝围挡的半月缺口'],['靠车道那块半月缺口仍朝车道','靠车道那块半月缺口仍朝围挡']]);
edit(draft(51),[['原来二百核听之后','原来二百四十核听之后']]);
edit(draft(54),[['靠车道那块的半月缺口仍朝车道','靠车道那块的半月缺口仍朝围挡']]);
edit(draft(57),[['保留款已经垫了，撤掉一间，对方只肯退一部分，不是房子空下来就什么也没花','保留款已经垫了，要撤的是原来并行时额外保留的时段，对方只肯退一部分，不是撤掉那段就什么也没花'],['明天变成多出一整间','明天变成多付一段并行保留的钱'],['刚才说的试开','交盘时的试开']]);
edit(draft(60),[['“最早第二张没名字的那两张','“我下午出远门，先把纸的事说清。最早第二张没名字的那两张']]);
edit(draft(61),[['改成顺排，一间取消，对方答退二百四','改成顺排，两间仍照新确认用，取消的是原来并行时额外保留的时段，对方答退二百四']]);
edit(draft(62),[['沈把糖含进嘴里，才发现上午到现在仍在原处。甜味来得慢','沈回第一间，从桌角取回上午那颗糖，再回第二间收记录。她把糖含进嘴里，甜味来得慢']]);
edit(draft(66),[['靠车道的半月缺口仍朝车道','临车道那块的半月缺口仍朝围挡']]);
edit('大纲/单元/0042.json',[['同两红砖朝车道半月口仍在','同两红砖、临车道那块朝围挡的半月口仍在'],['明日1小时200','明日1小时240']]);
edit('大纲/单元/0043.json',[['全课时长与200核听范围','全课时长与240核听范围'],['梁付200','梁付240']]);
edit('大纲/单元/0047.json',[['检验陈能按时退出且不由沈兜底','检验陈一次退出的实际耗时且不由沈兜底'],['、11点锁屋','、11:04实际锁屋'],['或延过11','或把晚锁当作已约延班'],['11点人出陈亲合门锁试拉','原约11点，实际11:04人出陈亲合门锁试拉'],['11:10前后常用钥实交严手','11:16常用钥实交严手；9:50到归钥共86分钟']]);
edit('大纲/单元/0057.json',[['三人看同楼双房改顺排的实际损失。','三人看同楼双房改顺排的实际损失；要取消的是原并行时额外保留的时段，不是整间停用。']]);
edit('大纲/单元/0060.json',[['邱在场沈电话何，首次告原缺名两页','邱在场沈电话何，先明说下午出远门但不告日期票款；首次告原缺名两页']]);
edit('大纲/单元/0061.json',[['梁来核原保留款票，先偿还陆360','两房仍按新确认顺排；取消原并行额外保留时段。梁来核原保留款票，先偿还陆360']]);
edit('大纲/单元/0062.json',[['午后另一房试声另留底声、主讲按序，17:18','午后另一房试声另留底声、主讲按序；收工沈回第一间桌角取糖，再回第二间收记录，17:18']]);
const out=path.join(stage,'desired');fs.mkdirSync(out);const replacements=[];
function transform(v,p,n){if(typeof v==='string'){
 let x=v;
 const pairs=[['临车道那块靠车道一角半月缺口','临车道那块靠围挡一角半月缺口'],['临车道那块靠车道的一角缺一个半月口','临车道那块靠围挡的一角缺一个半月口'],['半月缺口也朝着车道','半月缺口也朝着围挡'],['半月缺口仍朝车道','半月缺口仍朝围挡'],['半月口朝车道','半月口朝围挡'],['车道侧的半月缺口','临车道那块朝围挡的半月缺口'],['车道侧半月口当日干','临车道砖朝围挡半月口当日干'],['靠车道半月缺口、水过','临车道砖朝围挡半月缺口、水过'],['临车道半月缺口方向不变','临车道那块的半月缺口朝围挡、方向不变'],['一小时核听，二百元','一小时核听，二百四十元'],['保留款已经垫了，撤掉一间，对方只肯退一部分','保留款已经垫了，要撤的是原来并行时额外保留的时段，对方只肯退一部分']];
 for(const[a,b]of pairs)x=x.split(a).join(b);
 x=x.replace(/\b200\b/g,'240').replace(/83分钟/g,'86分钟');
 if(!x.startsWith('第5日11:02'))x=x.replace(/11:02/g,'11:04');
 x=x.replace(/11:13/g,'11:16');
 if(x!==v)replacements.push({unit:n,path:p,before:v,after:x});return x;
 }if(Array.isArray(v))return v.map((x,i)=>transform(x,p+'/'+i,n));if(v&&typeof v==='object')return Object.fromEntries(Object.entries(v).map(([k,x])=>[k,transform(x,p+'/'+k,n)]));return v;}
for(let n=0;n<=66;n++){
 const old=JSON.parse(fs.readFileSync(path.join(stage,'before-r165/snapshots',String(n).padStart(3,'0')+'.json'),'utf8'));
 const desired=n<36?structuredClone(old):transform(old,'snapshot',n);
 if(n>=60){const addition='；第60章电话补充知情：沈在说明纸物前亲告下午出远门；何只明知将远行，未获三天日期、票、2700或定金，也未亲见邱的篮衬。';desired.characters['何映']+=addition;}
 fs.writeFileSync(path.join(out,String(n).padStart(3,'0')+'.json'),JSON.stringify(desired,null,2)+'\n',{flag:'wx'});
}
const summaries=Object.fromEntries(base.units.map(u=>[u.unit,transform(u.summary,'summary',u.unit)]));
summaries[47]+='实际比事前11点晚四分钟，9:50到11:16共86分钟，事前未约延班。';
summaries[57]+='取消所指为原并行额外保留时段，不是整间停用；此时新顺排仍待确认。';
summaries[60]+='沈在电话明说下午出远门，何未获具体日期、票款或定金。';
summaries[61]+='两房仍照新确认顺排，取消仅原并行的额外保留时段。';
summaries[62]+='收工回第一间桌角取糖再回第二间收记录。';
fs.writeFileSync(path.join(stage,'summaries.json'),JSON.stringify(summaries,null,2)+'\n',{flag:'wx'});
fs.writeFileSync(path.join(stage,'edits.json'),JSON.stringify(edits,null,2)+'\n',{flag:'wx'});
fs.writeFileSync(path.join(stage,'snapshot-replacements.json'),JSON.stringify(replacements,null,2)+'\n',{flag:'wx'});
const changed=[...new Set(edits.map(x=>x.file))].map(file=>({file,before_sha256:sha(fs.readFileSync(path.join(stage,'before-r165/work',file))),after_sha256:sha(fs.readFileSync(path.join(work,file)))}));
fs.writeFileSync(path.join(stage,'changed-files.json'),JSON.stringify(changed,null,2)+'\n',{flag:'wx'});
const reading=[17,31,35,...Array.from({length:31},(_,i)=>i+36)].map(unit=>({at:new Date().toISOString(),phase:'before',unit,draft:draft(unit),sha256:sha(fs.readFileSync(path.join(stage,'before-r165/work',draft(unit)))),method:'model-full-read',complete:true,notes:'当前有效r165正文；工具显示Complete，未从其他阶段恢复剧情'}));
fs.appendFileSync(path.join(stage,'reading.jsonl'),reading.map(JSON.stringify).join('\n')+'\n');
console.log(JSON.stringify({changed,edits:edits.length,desired_count:67,replacement_fields:replacements.length},null,2));
