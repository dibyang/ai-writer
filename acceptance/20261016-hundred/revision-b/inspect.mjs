import fs from 'node:fs';import path from 'node:path';import {isDeepStrictEqual as same} from 'node:util';
const work=path.resolve('acceptance/20261016-hundred/works/潮汐信号'),stage=path.resolve('acceptance/20261016-hundred/revision-b');
const state=JSON.parse(fs.readFileSync(path.join(work,'.writer/state.json'),'utf8'));
const [mode,a,b]=process.argv.slice(2),start=Number(a??36),end=Number(b??66);
if(mode==='plans')for(let n=start;n<=end;n++){const p=`大纲/单元/${String(n).padStart(4,'0')}.json`;console.log(p+'\n'+fs.readFileSync(path.join(work,p),'utf8'));}
if(mode==='candidates'){
 const rows=new Map();const re=/半月|缺口|缺角|二百|200|11:02|11:13|83|八十三|十一点零二|十一点十三|两分钟|一间取消|撤掉一间|试开|出门不用|这次出门/;
 function walk(v,p,n){if(typeof v==='string'&&re.test(v)){const key=JSON.stringify([p,v]);if(rows.has(key))rows.get(key).units.push(n);else rows.set(key,{path:p,value:v,units:[n]});}else if(v&&typeof v==='object')for(const [k,x]of Object.entries(v))if(!['sha256','source_hashes','fingerprint','journal'].includes(k))walk(x,p+'/'+k,n);}
 for(let n=start;n<=end;n++){const snap=JSON.parse(fs.readFileSync(path.join(stage,'before-r165/snapshots',String(n).padStart(3,'0')+'.json'),'utf8'));walk(snap,'snapshot',n);walk(state.units.find(x=>x.unit===n)?.summary,'summary',n);}
 for(const r of rows.values())console.log(JSON.stringify({...r,units:r.units.length>1?[r.units[0],r.units.at(-1)]:r.units}));
}
if(mode==='fragments'||mode==='cancellation'){
 const rows=new Map(),re=mode==='cancellation'?/撤|取消|保留款/g:/半月|200|二百(?:元|照报|核听|，|\b)|11:02|11:13|83分钟|八十三|十一点零二|十一点十三|多两分钟|一间取消|撤掉一间|取消一间|一间撤|退一间/g;
 function walk(v,p,n){if(typeof v==='string'){let matches=[...v.matchAll(re)];for(const m of matches){const fragment=v.slice(Math.max(0,m.index-65),m.index+m[0].length+90);const key=JSON.stringify([p,fragment]);if(rows.has(key))rows.get(key).units.push(n);else rows.set(key,{path:p,fragment,units:[n]});}}else if(v&&typeof v==='object')for(const[k,x]of Object.entries(v))if(!['source_hashes','sha256','fingerprint','journal'].includes(k))walk(x,p+'/'+k,n);}
 for(let n=start;n<=end;n++){walk(JSON.parse(fs.readFileSync(path.join(stage,'before-r165/snapshots',String(n).padStart(3,'0')+'.json'),'utf8')),'snapshot',n);walk(state.units.find(x=>x.unit===n)?.summary,'summary',n);}
 for(const r of rows.values())console.log(JSON.stringify({...r,units:r.units.length>1?[r.units[0],r.units.at(-1)]:r.units}));
}
if(mode==='deltas')for(let n=start;n<=end;n++){
 const before=JSON.parse(fs.readFileSync(path.join(stage,'before-r165/snapshots',String(n-1).padStart(3,'0')+'.json'),'utf8')),after=JSON.parse(fs.readFileSync(path.join(stage,'before-r165/snapshots',String(n).padStart(3,'0')+'.json'),'utf8'));
 const delta={unit:n,summary:state.units.find(x=>x.unit===n)?.summary,characters:Object.fromEntries(Object.entries(after.characters).filter(([k,v])=>!same(v,before.characters[k]))),timeline:after.timeline.slice(before.timeline.length),ledger:{}};
 for(const [id,v]of Object.entries(after.ledger)){const prev=before.ledger[id]??{},d={};for(const[k,x]of Object.entries(v))if(!same(x,prev[k]))d[k]=k==='evidence'?x.filter(e=>e.unit===n):x;if(Object.keys(d).length)delta.ledger[id]=d;}
 console.log(JSON.stringify(delta,null,2));
}
if(mode==='compact-deltas')for(let n=start;n<=end;n++){
 const before=JSON.parse(fs.readFileSync(path.join(stage,'before-r165/snapshots',String(n-1).padStart(3,'0')+'.json'),'utf8')),after=JSON.parse(fs.readFileSync(path.join(stage,'before-r165/snapshots',String(n).padStart(3,'0')+'.json'),'utf8'));
 function delta(prev,v){if(same(prev,v))return undefined;if(typeof v==='string'&&typeof prev==='string'&&prev.length>60&&v.includes(prev)){return {added:v.replace(prev,'[previous text retained verbatim]')};}if(v&&typeof v==='object'&&!Array.isArray(v)){return Object.fromEntries(Object.entries(v).map(([k,x])=>[k,delta(prev?.[k],x)]).filter(([k,x])=>x!==undefined));}return v;}
 const d=delta(before,after);d.timeline=after.timeline.slice(before.timeline.length);
 for(const[id,x]of Object.entries(d.ledger??{}))if(x.evidence)x.evidence=after.ledger[id].evidence.filter(e=>e.unit===n);
 console.log(JSON.stringify({unit:n,summary:state.units.find(x=>x.unit===n)?.summary,changes:d},null,2));
}
