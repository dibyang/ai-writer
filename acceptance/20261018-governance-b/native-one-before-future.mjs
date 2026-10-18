import fs from 'node:fs';
import {base,project,put,read,hash,cli} from './native-one-helper.mjs';
const state=read(project+'/.writer/state.json');
put(base+'/native-one-snapshots/before-future-state.json',fs.readFileSync(project+'/.writer/state.json'));
put(base+'/native-one-before-future-consumption.json',state.units.map(u=>({unit:u.unit,draft:u.draft,sha256:u.sha256,source_hashes:u.source_hashes,source_bindings:u.source_bindings})));
const refs=new Map();
for(const u of state.units)for(const [r,h]of Object.entries(u.source_hashes)){if(r==='.writer/state.json'||r.startsWith('正文/'))continue;const binding=u.source_bindings?.[r];refs.set(binding?.object_ref||r,{ref:r,sha256:h});}
let text='';
for(const [r,data] of refs){const f=project+'/'+r;if(hash(f)!==data.sha256)throw Error('actual consumed input mismatch '+r);text+=`\n\n<!-- ref=${data.ref}; actual=${r}; SHA256=${data.sha256} -->\n`+fs.readFileSync(f,'utf8');}
put(base+'/native-one-readings/old-consumed-inputs.md',text);
cli('before-future-source-list',['source','list','--unit','6']);
