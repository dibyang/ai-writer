import fs from 'node:fs';import path from 'node:path';
import {cli,save,hash,project,stage} from './run-cli.mjs';
const n=process.argv[2];const unit=Number(n);
const before=JSON.parse(fs.readFileSync(`${stage}/record-${n}-before.json`,'utf8'));
const s=JSON.parse(fs.readFileSync(`${project}/.writer/state.json`,'utf8'));
if(s.revision!==before.expected_revision||hash(`${project}/.writer/state.json`)!==before.source_hashes['.writer/state.json'])throw Error('Prewrite state changed; investigate before proceeding');
const intent=JSON.parse(fs.readFileSync(`${stage}/changes-${n}.json`,'utf8'));
const historical='；历史有效信息（以下按原章时点，不作当前状态）：';
for(const [name,v] of Object.entries(intent.changes.characters??{}))intent.changes.characters[name]=v+(s.snapshot.characters[name]?historical+s.snapshot.characters[name]:'');
for(const [id,v] of Object.entries(intent.changes.ledger??{})){
 const old=s.snapshot.ledger[id];
 if(old&&v.character_known)v.cast=[...new Set([...(old.cast??[]),...(v.cast??[]),...Object.keys(v.character_known)])];
 for(const [name,value] of Object.entries(v.character_known??{}))v.character_known[name]=value+(old?.character_known?.[name]?historical+old.character_known[name]:'');
 if(v.custody&&old?.custody)v.previous_holder=old.custody.holder;
}
const input={...before,summary:intent.summary,changes:intent.changes};save(`record-${n}.json`,input);
const p=path.join(project,input.draft);const body=fs.readFileSync(p,'utf8');const han=[...body.replace(/^#.*$/gm,'').matchAll(/\p{Script=Han}/gu)].length;if(han<2400||han>3200)throw Error('Han outside requested interval: '+han);
fs.appendFileSync(`${stage}/reading.jsonl`,JSON.stringify({path:p.replaceAll('\\','/'),sha256:hash(p),range:'full',purpose:`第${n}章写后完整自检；语义由模型实读，脚本仅记录覆盖`,read_at:new Date().toISOString(),method:'FastCtx full final draft'})+'\n');
const r=cli(['record','--input',`${stage}/record-${n}.json`],`record-${n}-cli`);console.log(r.stdout);if(r.stderr)console.error(r.stderr);if(r.exit_code!==0)process.exit(r.exit_code??1);
const c=cli(['check'],`check-${n}-cli`);console.log(c.stdout);if(c.stderr)console.error(c.stderr);process.exitCode=c.exit_code??1;
