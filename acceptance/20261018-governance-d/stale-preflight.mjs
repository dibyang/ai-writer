import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {runner,sha} from './cli-support.mjs';
const r=runner(process.argv[2]),root=path.join(r.dest,'work');r.setup(root);fs.appendFileSync(path.join(root,'正文/0001.md'),'\n预置锁外改稿：验证计划是否揭示业务漂移。\n');const before=sha(fs.readFileSync(path.join(root,'.writer/state.json'))),p=r.run(root,['tool','update-plan','--source',process.cwd()]);
if(process.argv[3]==='fixed'){assert.equal(p.can_update,false);assert.ok(p.blockers.some(x=>x.code==='CONTEXT_CHANGED'));r.summary({expected:'fixed',can_update:p.can_update,blockers:p.blockers,state_unchanged:sha(fs.readFileSync(path.join(root,'.writer/state.json')))===before});}
else{assert.equal(p.can_update,true);const e=r.run(root,['tool','update'],{...p.request,author_evidence:r.evidence(root)},2);assert.equal(e.code,'CONTEXT_CHANGED');assert.equal(sha(fs.readFileSync(path.join(root,'.writer/state.json'))),before);r.summary({expected:'reproduced-before-fix',preview_can_update:true,write_rejected:e.code,state_unchanged:true});}
console.log(JSON.stringify({ok:true,mode:process.argv[3]??'reproduce',preview_can_update:p.can_update,blockers:p.blockers}));
