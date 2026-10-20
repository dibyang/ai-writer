import fs from 'node:fs';import crypto from 'node:crypto';
const w='scenario/东岸末班船-扩展验证',sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const s=JSON.parse(fs.readFileSync(`${w}/.writer/state.json`));
const parts=['分段/0007/01-v1.md','分段/0007/02-v1.md'].map(path=>{const b=fs.readFileSync(`${w}/${path}`);return {path,sha256:sha(b),han:[...b.toString().replace(/^#.*$/gm,'').matchAll(/\p{Script=Han}/gu)].length};});
fs.writeFileSync('bf5-assemble-7.json',JSON.stringify({unit:7,expected_revision:s.revision,draft:'正文/0007-先留出两包-v1.md',parts:parts.map(({path,sha256})=>({path,sha256})),separator:'\n\n'},null,2)+'\n',{flag:'wx'});
const d=JSON.parse(fs.readFileSync('cli-logs/bf5-context-7-budget-1000/stderr.raw.txt'));
const r=JSON.parse(fs.readFileSync('cli-logs/bf5-context-7-budget-1000/result.json'));
fs.writeFileSync('bf5-budget-diagnosis.json',JSON.stringify({code:d.code,actual_cli_exit_code:r.exit_code,state_unchanged:r.before_state_sha256===r.after_state_sha256,context_budget:d.context_budget,action:'按相关性拆读当前1—6及三线索原文；保留核心来源与骨架，显式30000字符取得完整packet。终端显示节略另用FastCtx分页回读完整日志，未截断产品packet。字符计量不是模型token。',full_context_log:'cli-logs/bf5-context-7-full/stdout.raw.txt'},null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({parts,total_han:parts.reduce((n,p)=>n+p.han,0),revision:s.revision},null,2));
