import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';
import {base,main,j,sha,state,save,author,cli} from './e1-ops.mjs';
const action=process.argv[2];
if(action==='begin'){
 assert.equal(state().units.length,48);assert.equal(Object.keys(state().impact_pending).length,9);
 const input=save('e1-inputs/revision-begin.json',{expected_revision:state().revision,owner:'Codex AC E same native session; controller execution first stop39 of full35-48',from:35,through:48});
 const out=cli('e1-revision-begin',['revision','begin'],{input});
 save('e1-private/ownership.json',out);console.log('Ownership saved at AC/e1-private/ownership.json; contents withheld.');
}
if(action==='negative'){
 const inputOld=j(path.join(base,'e1-inputs/workflow.json'));inputOld.expected_revision=state().revision;inputOld.operation_id='E1_VALID_MAIN_WORKFLOW_OCCUPIED_NEGATIVE';
 const input=save('e1-inputs/valid-main-workflow-negative.json',inputOld);
 const inventory=()=>{const out={};for(const dir of ['正文','大纲','设定','研究','审查','人物','规则','.writer']){const scan=f=>{if(!fs.existsSync(f))return;for(const d of fs.readdirSync(f,{withFileTypes:true})){if(['collaboration','revisions','transactions','tool'].includes(d.name)&&f.includes('.writer'))continue;const p=path.join(f,d.name);if(d.isDirectory())scan(p);else out[path.relative(main,p)]=sha(fs.readFileSync(p));}};scan(path.join(main,dir));}return out;};
 const before=inventory();const out=cli('e1-main-valid-write-negative',['workflow','set'],{input,expect:2});const after=inventory();assert.equal(out.code||out.error?.code,'REVISION_OCCUPIED');assert.deepEqual(after,before);save('e1-main-occupied-negative-proof.json',{operation:'workflow set, valid previously successful structure with live CAS',expected_code:'REVISION_OCCUPIED',actual:out,state_and_outputs_identical:true,before,after});
}
if(action==='rewind'){
 const own=j(path.join(base,'e1-private/ownership.json'));const root=own.workspace;
 cli('e1-candidate-rewind35',['rewind','--from','35','--expected-revision',String(state(root).revision)],{root,token:true,brief:true});
}
