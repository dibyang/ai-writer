import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
export const stage='D:/work/other/ai-writer/acceptance/20261016-expanded/revision-a';
export const work='D:/work/other/ai-writer/acceptance/20261016-expanded/works/潮汐信号';
export const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
export const write=(p,x)=>{fs.mkdirSync(path.dirname(p),{recursive:true});fs.writeFileSync(p,JSON.stringify(x,null,2)+'\n');};
export const hash=x=>crypto.createHash('sha256').update(x).digest('hex');
export function terms(s){return s.replaceAll('东埠','西埠').replaceAll('六码头','四号泊位').replaceAll('红棉绳','蓝棉绳');}
export function transform(x){if(typeof x==='string')return terms(x);if(Array.isArray(x))return x.map(transform);if(x&&typeof x==='object')return Object.fromEntries(Object.entries(x).map(([k,v])=>[k,transform(v)]));return x;}
if(process.argv[1]?.replaceAll('\\','/').endsWith('/revise.mjs')){
 const state=read(path.join(work,'.writer/state.json'));
 if(state.revision!==14||state.units.length)throw new Error('must formally rewind before editing');
 const before=read(path.join(stage,'before/work/.writer/state.json'));
 const edits=[];
 const replaceOnce=(s,a,b)=>{if(s.split(a).length!==2)throw new Error('expected one match '+a);return s.replace(a,b);};
 for(const r of before.units){
  const oldPath=path.join(work,r.draft),old=fs.readFileSync(oldPath,'utf8');
  let next=terms(old);
  if(r.unit===2)next=replaceOnce(next,'海湾东侧','海湾西侧');
  if(r.unit===6)next=replaceOnce(next,'通知叫西埠线乘客去客运码头，而这儿正给她指着路；她开始相信，今天的客运码头至少接住了旧西埠的一部分，也许地方都不用另找。','通知叫西埠线乘客去客运码头，而这儿正给她指着路。旧名字带着一个“西”，路却朝东，她迟疑片刻，想着候船处也许搬过。她开始相信，今天的客运码头至少接住了旧西埠的一部分，顺着路牌就能问到四号泊位。');
  if(r.unit===8)next=replaceOnce(next,'那和她想找的岸边没有一点相像，可“六”字刚才跳进眼里时，她竟真的高兴了一下。','那和她想找的岸边没有一点相像。她原想沿着编号找到四号，走近才发现，这些号码只管柜台前的一小片地。');
  if(r.unit===9)next=replaceOnce(next,'“你还有二十来分钟，不用跑。”','“三点二十以后才约的，算上走路也来得及，不用跑。”');
  if(r.unit===11)next=replaceOnce(next,'说前天还见她在这里干活','说昨天还见她在这里干活');
  const draft=terms(r.draft),target=path.join(work,draft);
  if(old!==next)fs.writeFileSync(oldPath,next);
  if(draft!==r.draft){if(fs.existsSync(target))throw new Error('rename target exists');fs.renameSync(oldPath,target);}
  edits.push({unit:r.unit,before_draft:r.draft,draft,before_sha256:hash(old),sha256:hash(next),bytes_preserved:old===next});
 }
 const rulePath=path.join(work,'设定/权威规则.md');
 fs.writeFileSync(rulePath,terms(fs.readFileSync(rulePath,'utf8')));
 for(const row of before.units){
  const n=String(row.unit).padStart(4,'0');let p=transform(read(path.join(stage,`before/work/大纲/单元/${n}.json`)));
  if(row.unit===4)p.beats=p.beats.map(s=>s.replace('罗敬取扇前提出','罗敬等电扇继续检查时提出'));
  if(row.unit===6){p.change=p.change.replace('暂时误判','暂时误判');p.beats=p.beats.map(s=>s.replace('可能承接旧西埠位置的猜想','可能接续旧西埠、能问到四号泊位的猜想；旧名带西、现路朝东，不能据此认旧址'));}
  if(row.unit===8){p.goal='完成现客运码头查访，用现场可见来源区分窗口编号、泊位与候船去向，选择下一条证据路径';p.change=p.change.replace('旧四号泊位','西埠四号泊位');}
  if(row.unit===9)p.beats.push('两点四十对单后明确三点二十以后才约，算上步行仍来得及；三点出发，不缩短实际路程');
  if(row.unit===11)p.beats[0]+='；客户说昨天见她帮工，与第二日实际劳动一致';
  if(row.unit===12)p.beats=p.beats.map(s=>s.replace('航务杂存栏转存页号在照片外','航务杂存写见续页，照片可见纸边缺角，找不到接续页号'));
  write(path.join(stage,`plans/${n}.json`),p);
 }
 write(path.join(stage,'manuscript-edits.json'),edits);
 console.log(JSON.stringify(edits,null,2));
}
