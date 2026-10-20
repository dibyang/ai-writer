import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
const U=path.dirname(fileURLToPath(import.meta.url)),W=path.join(U,'scenario','东岸末班船');
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
for(const label of ['a18-workflow-trial','a21-context-before','a22-template-before']){
  const r=JSON.parse(fs.readFileSync(path.join(U,'commands',label,'result.json'),'utf8'));
  if(r.exit_code!==0)throw Error('Failed prerequisite '+label);
}
const contextRef='.writer/drafts/context-A-before-0001.json',templateRef='.writer/drafts/record-A-before-0001.json';
const context=JSON.parse(fs.readFileSync(path.join(W,contextRef),'utf8')),template=JSON.parse(fs.readFileSync(path.join(W,templateRef),'utf8'));
if(context.revision!==3||template.expected_revision!==3||JSON.stringify(context.source_hashes)!==JSON.stringify(template.source_hashes))throw Error('Prewrite versions differ');
if(fs.existsSync(path.join(W,'分段','0001')))throw Error('Drafting already started');
const sources=[];
for(const [ref,expected] of Object.entries(template.source_hashes)){
  const b=fs.readFileSync(path.join(W,ref)),actual=sha(b);
  if(actual!==expected)throw Error('Source drift '+ref);
  const target=path.join(U,'写前来源-A',ref);fs.mkdirSync(path.dirname(target),{recursive:true});fs.writeFileSync(target,b,{flag:'wx'});
  sources.push({ref,sha256:actual,bytes:b.length});
}
const saved={created_at:new Date().toISOString(),revision:3,state_sha256:sha(fs.readFileSync(path.join(W,'.writer','state.json'))),sources,context:{ref:contextRef,sha256:sha(fs.readFileSync(path.join(W,contextRef)))},template:{ref:templateRef,sha256:sha(fs.readFileSync(path.join(W,templateRef)))},prompt:{ref:'研究/验收prompt-A原文.md',sha256:sha(fs.readFileSync(path.join(W,'研究/验收prompt-A原文.md')))},note:'动笔前逐字节核对并另存，不在写后重取或刷新哈希。'};
fs.writeFileSync(path.join(U,'写前-A.json'),JSON.stringify(saved,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify(saved));
