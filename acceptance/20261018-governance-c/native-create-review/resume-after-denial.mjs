import fs from 'node:fs';
import {base,project,state,cli,json,sha} from './helpers.mjs';
// Continuation only; previous script and all evidence are retained unchanged.
cli('native-one-48-context-7-denied-retry',['context','--project',project,'--unit','7'],{expect:2});
cli('native-one-49-template-7-denied',['record-template','--project',project,'--unit','7','--draft','正文/0007-未获授权.md','--out','.writer/drafts/forbidden-template-7.json'],{expect:2});
json(`${base}/pre-review-integrity.json`,{state_sha256:sha(fs.readFileSync(`${project}/.writer/state.json`)),schema:state().schema_version,revision:state().revision,units_sha256:sha(JSON.stringify(state().units)),snapshot_sha256:sha(JSON.stringify(state().snapshot)),body:state().units.map(u=>({unit:u.unit,draft:u.draft,sha256:sha(fs.readFileSync(`${project}/${u.draft}`))}))});
cli('native-one-50-review-template-1-6',['review-template','--project',project,'--from','1','--to','6','--out','.writer/drafts/review-1-6-before-reading.json']);
json(`${base}/denial-helper-note.json`,{original_script:'register-sixth-pause.mjs',original_label:'native-one-47-context-7-denied',product_exit_code:2,helper_expected:1,product_error:'ACTION_OUT_OF_SCOPE',effect:'Helper stopped after captured rejection; no rollback or input overwrite. Continued with fresh labels 48-50.',source:'../commands/native-one-47-context-7-denied/stderr.raw.txt'});
