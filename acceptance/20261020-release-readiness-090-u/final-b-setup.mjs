import fs from 'node:fs';import path from 'node:path';import {U,W,write,json,hash,run} from './final-b-run.mjs';
const src=path.join(U,'final-b-prompt.md');write(path.join(W,'研究/final-b-本次任务原文.md'),fs.readFileSync(src,'utf8'));
const s=json(path.join(W,'.writer/state.json'));const wf=structuredClone(s.governance.workflow??s.governance);
// Use the documented workflow shape, retaining the current planning references.
const show=JSON.parse(fs.readFileSync(path.join(U,'final-b-commands/02-workflow/stdout.bin'),'utf8')).workflow;
show.task='新鲜会话恢复后只完成第3章及1—3全文连读；随后按授权启动普通事实小修，只重登最早影响章后停留独立区';
show.authorization={allowed_actions:['discuss','plan','draft'],draft_range:{from:3,to:3},revise_range:null,stop_conditions:['只写第3章，不写第4章','登记第3章并连读1—3后进入正式独立修订；本进程只重登最早影响章','不prepare、不commit、不abort；保留同ID候选供后续恢复']};
write(path.join(W,'.writer/drafts/final-b-workflow-third.json'),{expected_revision:s.revision,operation_id:'final-b-third-and-revision-first-stop',author_evidence:{quote:'本次只写第3章及启动一次正式小修，不写4。',local_source:'研究/final-b-本次任务原文.md',source_sha256:hash(src),locator:'本次用户任务原文第4段首句；原生对话ID未提供',recorded_by:'本次Codex执行代理'},workflow:show});
run('10-workflow-third',['workflow','set','--input','.writer/drafts/final-b-workflow-third.json']);
run('11-context-third',['context','--unit','3','--out','.writer/drafts/final-b-context-3.json']);
run('12-template-third',['record-template','--unit','3','--draft','正文/0003-把手朝外-final-b.md','--out','.writer/drafts/final-b-record-3-before.json']);
const t=json(path.join(W,'.writer/drafts/final-b-record-3-before.json'));const files=[];
for(const [rel,expected] of Object.entries(t.source_hashes)){const f=path.join(W,rel);const actual=hash(f);if(actual!==expected)throw Error('source mismatch '+rel);const out=path.join(U,'final-b-before-3/sources',rel);write(out,fs.readFileSync(f,'utf8'));files.push({path:rel,sha256:actual,bytes:fs.statSync(f).size});}
write(path.join(U,'final-b-before-3/manifest.json'),{state_sha256:hash(path.join(W,'.writer/state.json')),files,units:s.units.map(x=>({unit:x.unit,draft:x.draft,registered_sha256:x.sha256,actual_sha256:hash(path.join(W,x.draft))}))});
