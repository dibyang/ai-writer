import fs from 'node:fs';import path from 'node:path';import {stage,work,read,write,runner,cli} from './phase.mjs';
const snapshots=read(path.join(stage,'original-snapshots.json'));
const groups=new Map();
function walk(v,p,n){if(typeof v==='string'){for(const m of v.matchAll(/[^。；\n]*(?:八十|(?<!\d)80(?!\d)|第四遍|十点半|10:30|全时窗|全时段|完整一小时)[^。；\n]*/g)){const t=m[0];if(!groups.has(t))groups.set(t,[]);groups.get(t).push({unit:n,path:p});}}else if(v&&typeof v==='object')for(const[k,x]of Object.entries(v))if(k!=='sha256'&&k!=='source_hashes'&&k!=='draft')walk(x,p+'.'+k,n);}
for(let n=0;n<=90;n++)walk(snapshots[n],'snapshot',n);
write(path.join(stage,'snapshot-candidates.json'),[...groups].map(([text,refs])=>({text,first:Math.min(...refs.map(x=>x.unit)),last:Math.max(...refs.map(x=>x.unit)),paths:[...new Set(refs.map(x=>x.path))]})));
for(const c of ['rewind','record-template','record','context','export','review']){const r=cli('help-'+c,[c,'--help']);if(r.exit_code)throw Error(c);}
console.log(JSON.stringify({candidates:groups.size,seat_ids:Object.keys(snapshots[90].ledger).filter(x=>/SEAT/.test(x))}));
