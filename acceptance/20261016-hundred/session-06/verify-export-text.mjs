import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createRunner} from '../command-runner.mjs';
const stage='acceptance/20261016-hundred/session-06',project='acceptance/20261016-hundred/works/潮汐信号',r=createRunner(stage),exp=r.json('export-final'),merged=fs.readFileSync(path.join(stage,'export/manuscript.md'),'utf8');
const units=exp.units.map(u=>{const full=fs.readFileSync(path.join(project,u.draft),'utf8').trim();const first=merged.indexOf(full),again=first<0?-1:merged.indexOf(full,first+full.length);assert.ok(first>=0,`Missing full text ${u.unit}`);assert.equal(again,-1,`Duplicate full text ${u.unit}`);return {unit:u.unit,full_text_occurrences:1};});
const result={ok:true,nature:'字节/文本覆盖核对，不是新增全文语义阅读',unit_count:units.length,units};fs.writeFileSync(path.join(stage,'export-text-audit.json'),JSON.stringify(result,null,2)+'\n',{flag:'wx'});console.log(JSON.stringify({ok:true,unit_count:units.length,all_full_chapter_texts_once:true}));
