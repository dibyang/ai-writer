import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';
const base=path.resolve('acceptance/20261024-long-flow-090-ac'),root=JSON.parse(fs.readFileSync(path.join(base,'project.json'))).project,sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const parts=Array.from({length:7},(_,i)=>'分段/AC-D-0046/'+String(i+1).padStart(2,'0')+'.md');
const entries=parts.map(ref=>{const b=fs.readFileSync(path.join(root,ref));return {ref,bytes:b.length,sha256:sha(b),han:(b.toString('utf8').match(/\p{Script=Han}/gu)||[]).length};});
fs.writeFileSync(path.join(base,'d-inputs/46-first-parts-manifest.json'),JSON.stringify({parts:entries,total_han:entries.reduce((n,x)=>n+x.han,0)},null,2)+'\n',{flag:'wx'});
fs.mkdirSync(path.join(base,'d-inputs/46-before-selfcheck'),{recursive:true});for(const ref of [parts[4],parts[6]])fs.copyFileSync(path.join(root,ref),path.join(base,'d-inputs/46-before-selfcheck',path.basename(ref)),fs.constants.COPYFILE_EXCL);
fs.writeFileSync(path.join(base,'d-inputs/failure-count-inline.json'),JSON.stringify({type:'agent-helper-syntax',exit_code:1,product_called:false,state_changed:false,error:"SyntaxError: Unexpected token '}'",cause:'inline统计命令末尾多一个右花括号',action:'保留失败，改文件脚本；未继续任何登记'},null,2)+'\n',{flag:'wx'});
fs.writeFileSync(path.join(base,'d-inputs/assemble46.json'),JSON.stringify({unit:46,title:'第四十六章 盒里最后一块',parts,output:'正文/0046-盒里最后一块-ac-d-v1.md',separator:'\n\n'},null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({parts:entries,total_han:entries.reduce((n,x)=>n+x.han,0)},null,2));
