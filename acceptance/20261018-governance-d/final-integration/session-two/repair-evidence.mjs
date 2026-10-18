import fs from 'node:fs';
import path from 'node:path';
import {root,dir,work,read,hash,save} from './ops.mjs';
const oldFiles=['report.md','handoff.json','command-index.json','readings.json','before-after.json','closure.json','two-update-rounds.json','artifact-hashes.json'];
const archive=dir+'/audit-attempt-one';fs.mkdirSync(archive,{recursive:true});
const currentState=hash(work+'/.writer/state.json');
fs.writeFileSync(archive+'/finalize-input.mjs',fs.readFileSync(dir+'/finalize.mjs'),{flag:'wx'});
for(const name of oldFiles){const src=path.resolve(dir,name),dst=path.resolve(archive,name);if(!src.startsWith(path.resolve(dir)+path.sep)||!dst.startsWith(path.resolve(dir)+path.sep))throw Error('path boundary');fs.renameSync(src,dst);}
const files=read(dir+'/final-build-verification.json').files;
for(const f of files){const target=dir+'/frozen-final-source-raw-v2/'+f.relative;fs.mkdirSync(path.dirname(target),{recursive:true});const bytes=fs.readFileSync(root+'/'+f.relative);if(hash(root+'/'+f.relative)!==f.sha256)throw Error('source drift');fs.writeFileSync(target,bytes,{flag:'wx'});}
const helper=fs.readFileSync(dir+'/close-governance.mjs','utf8');
fs.writeFileSync(archive+'/close-governance-failed-input.mjs',helper.replace('制造新修复。\']])','制造新修复。\']]])'),{flag:'wx'});
save(dir+'/nonproduct-failures.json',{synthetic_acceptance:true,failures:[{command:'node acceptance/20261018-governance-d/final-integration/session-two/close-governance.mjs',exit_code:1,error:'SyntaxError: Unexpected token ] at close-governance.mjs:8',product_cli_started:false,source_evidence:archive+'/close-governance-failed-input.mjs',evidence_note:'Original input reconstructed exactly from initial apply_patch plus the recorded one-character mechanical correction; error text transcribed from exec tool output, not relabeled as a capture raw stream.'},{command:'node acceptance/20261018-governance-d/final-integration/session-two/finalize.mjs',exit_code:1,error:'final_managed_source_and_installed_same=false because the helper serialized Buffer copies as JSON. Source and installed SHA still matched; only the additional frozen-source artifact was malformed.',preserved_outputs:archive,preserved_bad_frozen_copies:dir+'/frozen-final-source',replacement_raw_copies:dir+'/frozen-final-source-raw-v2',product_state_unchanged:true}],state_sha256_before:currentState,state_sha256_after:hash(work+'/.writer/state.json')});
console.log(JSON.stringify({archived:oldFiles.length,raw_source_files:files.length,state_unchanged:currentState===hash(work+'/.writer/state.json')}));
