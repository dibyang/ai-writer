import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {session,sha} from '../session-support.mjs';
const s=session('revise-a'),r=JSON.parse(fs.readFileSync(path.join(s.stage,'revision-local.json'))),b=session('revise-a-branch',{project:r.workspace,token:r.token});
const baseline=JSON.parse(fs.readFileSync(path.join(s.stage,'root-base-state.bin')));
const [op,narg]=process.argv.slice(2),n=Number(narg);
function delta(a,z,p=''){
 if(JSON.stringify(a)===JSON.stringify(z))return [];
 if(a&&z&&typeof a==='object'&&typeof z==='object'&&!Array.isArray(a)&&!Array.isArray(z))return [...new Set([...Object.keys(a),...Object.keys(z)])].flatMap(k=>delta(a[k],z[k],p+'/'+k));
 if(Array.isArray(a)&&Array.isArray(z)&&a.every((x,i)=>JSON.stringify(x)===JSON.stringify(z[i])))return [{path:p,append_from:a.length,append:z.slice(a.length)}];
 if(typeof a==='string'&&typeof z==='string'){let lo=0,hi=0;while(lo<a.length&&lo<z.length&&a[lo]===z[lo])lo++;while(hi<a.length-lo&&hi<z.length-lo&&a[a.length-hi-1]===z[z.length-hi-1])hi++;return [{path:p,common_prefix_chars:lo,common_suffix_chars:hi,before_changed:a.slice(lo,a.length-hi),after_changed:z.slice(lo,z.length-hi),prefix_context:a.slice(Math.max(0,lo-50),lo),suffix_context:hi?a.slice(a.length-hi,a.length-hi+50):''}];}
 return [{path:p,before:a,after:z}];
}
if(op==='prepare'){
 assert.equal(b.state().units.at(-1).unit,n-1);
 if(n!==48){const c=b.run('context-'+n,['context','--unit',String(n),'--purpose','revision','--max-chars','120000']);s.write('context-'+n+'.json',c.value);const t=b.run('replay-input-'+n,['revision','replay-input','--unit',String(n)]);s.write('replay-template-'+n+'.json',t.value);}
 const t=JSON.parse(fs.readFileSync(path.join(s.stage,'replay-template-'+n+'.json'))),old=baseline.units.find(u=>u.unit===n),j=JSON.parse(fs.readFileSync(path.join(s.project,old.journal)));
 const exact=j.patch.flatMap(p=>delta(p.before,p.after,p.at.join('/')));
 const immutable={};for(const [id,l] of Object.entries(t.changes.ledger||{}))if(l.type==='observation')immutable[id]={statement:l.statement,author_truth:l.author_truth};
 const c=JSON.parse(fs.readFileSync(path.join(s.stage,'context-'+n+'.json')));
 const display={unit:n,original_journal:old.journal,original_journal_sha256:sha(fs.readFileSync(path.join(s.project,old.journal))),summary:t.summary,original_exact_leaf_changes:exact,immutable_observations:immutable,source_hashes:t.source_hashes,context_keys:Object.keys(c),context_plan:c.plan,omitted_ids:c.continuity?.recall?.omitted_ids};
 s.write('inspect-'+n+'.json',display);console.log({unit:n,bytes:JSON.stringify(display).length,draft:t.draft,display:'revise-a/inspect-'+n+'.json'});
 const lines=['unit '+n,'summary '+t.summary,'timeline '+JSON.stringify(t.changes.timeline_append),'original journal '+old.journal+' SHA '+old.journal_sha256,'原journal逐字段精确差分（相等历史前后缀按字符数定位，未作语义摘要）：',...exact.map(x=>JSON.stringify(x)),'本次replay全部证据 '+JSON.stringify(Object.fromEntries(Object.entries(t.changes.ledger||{}).map(([id,x])=>[id,x.evidence]))),'不可变观察 '+JSON.stringify(immutable),'来源绑定 '+JSON.stringify(t.source_hashes),'context plan '+JSON.stringify(c.plan),'omitted IDs '+JSON.stringify(c.continuity?.recall?.omitted_ids)];
 s.write('inspect-'+n+'.txt',lines.join('\n')+'\n');
}else if(op==='record'){
 assert.equal(b.state().units.at(-1).unit,n-1);
 const t=JSON.parse(fs.readFileSync(path.join(s.stage,'replay-template-'+n+'.json'))),m=JSON.parse(fs.readFileSync(path.join(s.stage,'model-'+n+'.json')));
 assert.equal(m.unit,n);assert.deepEqual(Object.keys(m.checked).sort(),['characters','downstream','evidence','ledger','summary','timeline']);
 const report='审查/F-revise-a-'+n+'重登核查.md';let text='# F修订A 第'+n+'章实读重登核查\n\n知情模型自检；非真人盲读或全尾段文学验收。完整正文展示与原journal精确增量核查后，由模型逐项填写。\n\n';
 for(const [k,v]of Object.entries(m.checked))text+='## '+k+'\n'+v+'\n\n';text+='## 真人语言别扭句\n### 真人语言硬问题\n'+m.language+'\n';
 fs.writeFileSync(path.join(b.project,report),text,{flag:'wx'});s.write('reports/'+n+'.md',text);
 for(const edit of m.input_edits||[]){let target=t;for(const k of edit.path.slice(0,-1))target=target[k];const key=edit.path.at(-1);if(edit.kind==='replace'){assert.equal(target[key].split(edit.before).length-1,1);target[key]=target[key].replace(edit.before,edit.after);}else{assert.equal(target[key],edit.before);target[key]=edit.after;}}
 t.replay_review={reviewer:'actual-Codex-revise-a-informed-self-review',report,draft_sha256:sha(fs.readFileSync(path.join(b.project,t.draft))),checked_fields:['summary','characters','timeline','ledger','evidence','downstream']};
 s.write('record-'+n+'.json',t);const p=b.run('record-preview-'+n,['record-preview'],{input:t});s.write('preview-'+n+'.json',p.value);console.log({unit:n,preview_ok:p.value.ok,missing:p.value.missing,findings:p.value.findings});
 const v=b.run('record-'+n,['record'],{input:t});s.write('record-result-'+n+'.json',v.value);console.log({unit:n,record_ok:v.value.ok,revision:v.value.revision});
}else throw new Error('prepare or record');
