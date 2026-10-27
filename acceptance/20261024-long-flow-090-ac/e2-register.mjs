import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {base,main,j,sha,cli} from './e1-ops.mjs';
const root=path.join(main,'.writer/revisions/46029167-c62a-44f9-b591-e053ddc01bbb/workspace');
const n=Number(process.argv[2]);
const mode=process.argv[3];
assert(n>=36&&n<=39);
const inputPath=path.join(root,`.writer/drafts/e2-record-${n}.json`);
if(mode==='prepare'){
 const input=j(path.join(root,`.writer/drafts/e2-replay-${n}.json`));
 assert.equal(input.unit,n);
 const reportRef=`审查/E2-${n}-当前修订实读与六项差量.md`;
 const report=fs.readFileSync(path.join(base,`e2-notes-${n}.md`),'utf8');
 assert(report.includes('Codex模型知情自检'));
 fs.writeFileSync(path.join(root,reportRef),report,{flag:'wx'});
 if(n===36){
  // Only the price-bearing strings in this chapter's reviewed delta; times and all unrelated numbers remain intact.
  const pairs=[['12元花册','14元花册'],['听12元','听14元'],['女买12','女买14'],['亲拆12','亲拆14'],['女拆12','女拆14'],['女12','女14'],['亲述12元','亲述14元'],['价12/','价14/'],['原12元册','原14元册'],['花，十二','花，十四']];
  const update=v=>typeof v==='string'?pairs.reduce((s,[a,b])=>s.split(a).join(b),v):Array.isArray(v)?v.map(update):v&&typeof v==='object'?Object.fromEntries(Object.entries(v).map(([k,x])=>[k,update(x)])):v;
  input.summary=update(input.summary); input.changes=update(input.changes);
  assert(!JSON.stringify(input.changes).includes('买12'));
 }
 const b=fs.readFileSync(path.join(root,input.draft));
 assert.equal(sha(b),input._replay.draft_sha256);
 input.replay_review={reviewer:'Codex AC E same native session informed model self-review',report:reportRef,draft_sha256:sha(b),checked_fields:['summary','characters','timeline','ledger','evidence','downstream']};
 input.draft_review={reviewer:'Codex AC E same native session; informed model self-review, not human or blind review',report:reportRef,report_sha256:sha(Buffer.from(report)),draft_sha256:sha(b)};
 fs.writeFileSync(inputPath,JSON.stringify(input,null,2)+'\n',{flag:'wx'});
 console.log(JSON.stringify({unit:n,input:inputPath,draft_sha256:sha(b),report_sha256:input.draft_review.report_sha256,summary:input.summary,changes:input.changes},null,2));
}else if(mode==='preview'){
 const out=cli(`e2-u${n}-preview`,['record-preview'],{root,input:inputPath,token:true,brief:true});
 assert.equal(out.ok,true);
}else if(mode==='record'){
 cli(`e2-u${n}-record`,['record'],{root,input:inputPath,token:true,brief:true});
}else throw new Error('unknown mode');
