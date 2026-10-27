import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
const A=path.dirname(fileURLToPath(import.meta.url)),P=JSON.parse(fs.readFileSync(path.join(A,'project.json'))).project;
const sha=b=>crypto.createHash('sha256').update(b).digest('hex'),s=JSON.parse(fs.readFileSync(path.join(P,'.writer/state.json')));
const refs=['大纲/单元/0064.json','大纲/单元/0065.json','大纲/单元/0066.json','大纲/AE新增骨架-61-66.md','大纲/分卷/V23.json'];
const consumers=refs.map(ref=>({ref,sha256:sha(fs.readFileSync(path.join(P,ref))),units:s.units.filter(u=>Object.hasOwn(u.source_hashes??{},ref)||Object.hasOwn(u.source_bindings??{},ref)).map(u=>({unit:u.unit,hash:u.source_hashes?.[ref],binding:u.source_bindings?.[ref]}))}));
const dir=path.join(A,'originals/b-before-planning');fs.mkdirSync(dir,{recursive:true});
for(const ref of refs){const to=path.join(dir,ref);fs.mkdirSync(path.dirname(to),{recursive:true});fs.copyFileSync(path.join(P,ref),to,fs.constants.COPYFILE_EXCL);}
const commands=['status','check','doctor','source-list','revision-list','review-issues-list'].map(n=>{const d=path.join(A,'cli-logs/b-entry-'+n),r=JSON.parse(fs.readFileSync(path.join(d,'result.json'))),o=JSON.parse(fs.readFileSync(path.join(d,'stdout.txt')));assert.equal(r.exit_code,0);assert.equal(r.before_state_sha256,r.after_state_sha256);return {name:n,result:r,summary:{ok:o.ok,changed_sources:o.changed_sources,stale_units:o.stale_units,errors:o.errors,warnings:o.warnings,counts:o.counts,pending_edits:o.pending_edits,sessions:o.sessions?.map(x=>({id:x.id,status:x.status}))},stdout_sha256:sha(fs.readFileSync(path.join(d,'stdout.txt'))),stderr_sha256:sha(fs.readFileSync(path.join(d,'stderr.txt')))};});
const result={at:new Date().toISOString(),revision:s.revision,consumers,commands,native_id:JSON.parse(fs.readFileSync(path.join(A,'native-entry-b-first-verification.json'))).thread_id,reading:{order:[61,62,63],pages:[11,16,11],labels:'b-entry-uNN-pNN; actual current text returned before this audit'},decision:'0064/65/66可在确认无消费者后正式plan；已消费骨架保持字节，V23无论有无消费本程均保持。'};
fs.writeFileSync(path.join(A,'b-entry-audit.json'),JSON.stringify(result,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({revision:s.revision,consumers,commands:commands.map(x=>({name:x.name,exit:x.result.exit_code,...x.summary})),native_id:result.native_id}));
