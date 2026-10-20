import {save,read,sha,state} from './common.mjs';
const [label,...refs]=process.argv.slice(2);
const files=refs.map(ref=>{const b=read(ref),s=b.toString('utf8');return {ref,sha256:sha(b),bytes:b.length,lines:s.split('\n').length,body_han:[...s.replace(/^#.*$/gm,'').matchAll(/\p{Script=Han}/gu)].length};});
save(label+'.json',{observed_at:new Date().toISOString(),state_sha256:sha(read('.writer/state.json')),revision:state().revision,files,note:'Disk observation only; actual model reading ranges are recorded separately in reports.'});console.log(JSON.stringify(files));
