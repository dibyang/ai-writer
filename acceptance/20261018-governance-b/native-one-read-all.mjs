import fs from 'node:fs';
import {base,project,put,read,hash} from './native-one-helper.mjs';
import {drafts} from './native-one-drafting.mjs';
const tag=process.argv[2],p=process.argv[3]||project;
put(base+'/native-one-readings/'+tag+'.md',drafts.slice(1).map(r=>`<!-- ${r} SHA256 ${hash(p+'/'+r)} -->\n`+fs.readFileSync(p+'/'+r,'utf8')).join('\n\n'));
put(base+'/native-one-snapshots/'+tag+'-state.json',fs.readFileSync(p+'/.writer/state.json'));
console.log(JSON.stringify({reading:base+'/native-one-readings/'+tag+'.md',state_sha256:hash(p+'/.writer/state.json')}));
