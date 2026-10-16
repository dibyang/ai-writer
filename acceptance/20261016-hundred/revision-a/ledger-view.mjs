import path from 'node:path';
import {isDeepStrictEqual as same} from 'node:util';
import {stage,read,save} from './stage.mjs';
const ss=read(path.join(stage,'before/snapshots.json'));
const ids=['T_PUBLIC_USE','T_VOICE_CONSENT','T_KEEPER_SHARE','O_PAGE_PAIR','P_QIU_WORK_PAGES','T_PAGE_PAIR','P_PUBLIC_PAGES','O_HOURS_NOTE','P_HOURS_NOTE','P_RO_WORK_PAGES','P_QIU_LARGE_PAGES','I_PUBLIC_SCOPE_40','T_LAMP','T_PRIVATE','P_CHEN_NOTE'];
let out='';
for(let n=25;n<=42;n++){
out+=`\nUNIT ${n}\n`;
const a=ss[n-1],b=ss[n];
function diff(a,b,p){if(same(a,b))return;if(b&&a&&typeof a==='object'&&typeof b==='object'&&!Array.isArray(b)){for(const [k,v]of Object.entries(b))if(!['evidence','updated_unit','introduced_unit'].includes(k))diff(a[k],v,p+'.'+k);}else out+=`${p} = ${JSON.stringify(b)}\n`;}
diff(a.characters,b.characters,'characters');diff(a.threads,b.threads,'threads');out+='timeline_append = '+JSON.stringify(b.timeline.slice(a.timeline.length))+'\n';
for(const id of ids)if(b.ledger[id]){diff(a.ledger[id],b.ledger[id],id);for(const e of b.ledger[id].evidence??[])if(e.unit===n)out+=`${id}.evidence = ${e.quote}\n`;}
}save(path.join(stage,'before/related-ledger-deltas.txt'),out);
console.log(out.length);
