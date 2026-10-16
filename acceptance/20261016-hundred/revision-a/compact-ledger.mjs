import path from 'node:path';
import {isDeepStrictEqual as same} from 'node:util';
import {stage,read,save} from './stage.mjs';
const ss=read(path.join(stage,'before/snapshots.json'));
const ids=['T_PUBLIC_USE','T_VOICE_CONSENT','T_KEEPER_SHARE','O_PAGE_PAIR','P_QIU_WORK_PAGES','T_PAGE_PAIR','P_PUBLIC_PAGES','O_HOURS_NOTE','P_HOURS_NOTE','P_RO_WORK_PAGES','P_QIU_LARGE_PAGES','I_PUBLIC_SCOPE_40','T_LAMP','T_PRIVATE','P_CHEN_NOTE'];
let out='',seen=[];
function render(v){if(typeof v!=='string')return JSON.stringify(v);const raw=v;for(const s of seen)if(s.value.length>80&&v.includes(s.value)){v=v.replaceAll(s.value,`[已完整列于${s.ref}]`);}seen.push({value:raw,ref:ref});seen.sort((a,b)=>b.value.length-a.value.length);return v;}
let ref='';
function diff(a,b,p){if(same(a,b))return;ref=p;
 if(b&&typeof b==='object'){
 if(Array.isArray(b)){for(let i=0;i<b.length;i++)diff(a?.[i],b[i],`${p}[${i}]`);}
 else for(const [k,v]of Object.entries(b))if(!['updated_unit','introduced_unit','sha256','draft','line'].includes(k))diff(a?.[k],v,p+'.'+k);
 }else out+=`${p} = ${render(b)}\n`;
}
out+='BASE AT 24 (related ledger)\n';for(const id of ids)if(ss[24].ledger[id])diff(undefined,ss[24].ledger[id],`24.${id}`);
for(let n=25;n<=42;n++){out+=`\nUNIT ${n}\n`;diff(ss[n-1].characters,ss[n].characters,`${n}.characters`);diff(ss[n-1].timeline,ss[n].timeline,`${n}.timeline`);for(const id of ids)if(ss[n].ledger[id])diff(ss[n-1].ledger[id],ss[n].ledger[id],`${n}.${id}`);}
save(path.join(stage,'before/compact-ledger.txt'),out);console.log(out.length);
