import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {createRunner} from '../command-runner.mjs';
const stage=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(stage,'../../..');
const work=path.resolve(stage,'../works/潮汐信号');
const sha=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const runner=createRunner(stage);
const [op,...args]=process.argv.slice(2);
const state=()=>JSON.parse(fs.readFileSync(path.join(work,'.writer/state.json'),'utf8'));
const walk=d=>fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(d,e.name)):[path.join(d,e.name)]);
if(op==='cli'){
 const [label,...cli]=args;
 const r=runner.run(process.execPath,[path.join(root,'bin/ai-writer.mjs'),...cli],`inner-${label}`);
 process.stdout.write(r.stdout);process.stderr.write(r.stderr);process.exitCode=r.exit_code??1;
}else if(op==='init'){
 const s=state();const b=path.resolve(stage,'../source-baseline-v4.json');
 const report={started_at:new Date().toISOString(),work,state_sha256:sha(path.join(work,'.writer/state.json')),revision:s.revision,units:s.units.length,source_baseline_sha256:sha(b),product_sources:Object.fromEntries(['bin/ai-writer.mjs','lib/longform.mjs', '.writer/tool/lib/longform.mjs'].map(p=>{const f=p.startsWith('.writer')?path.join(work,p):path.join(root,p);return [f,fs.existsSync(f)?sha(f):null]})),inventory:walk(work).map(p=>path.relative(work,p).replaceAll('\\','/'))};
 fs.writeFileSync(path.join(stage,'observed-start.json'),JSON.stringify(report,null,2)+'\n',{flag:'wx'});
 console.log(JSON.stringify(report,null,2));
 if(report.state_sha256!=='c3ab9e7d347d720c41480441ee6996f3ed012998c292aa6d5d5bbd4c390ce6b9'||report.source_baseline_sha256!=='52f6a0f755871c7886dd4d6936133fbe522a22407eea058f36a07966583d7ec9')throw Error('Start binding differs');
}else if(op==='read'){
 let [rel,startText='1',countText='40']=args;
 if(/^\d+$/.test(rel))rel=state().units.find(u=>u.unit===Number(rel))?.draft??rel;
 const file=path.resolve(work,rel);
 if(!file.startsWith(work+path.sep))throw Error('Read must stay in work');
 const lines=fs.readFileSync(file,'utf8').split(/\r?\n/);if(lines.at(-1)==='')lines.pop();
 const start=Number(startText),end=Math.min(lines.length,start+Number(countText)-1);
 console.log(JSON.stringify({path:rel,sha256:sha(file),from:start,to:end,total_lines:lines.length,read_at:new Date().toISOString()}));
 for(let i=start;i<=end;i++)console.log(`${i}\t${lines[i-1]}`);
 console.log(`[${end===lines.length?'Complete':'Partial'} ${start}-${end}/${lines.length}; next=${end+1}]`);
}else if(op==='select'){
 const s=state();const [section,...keys]=args;let result=s;
 for(const key of [section,...keys].filter(Boolean))result=result[key];
 console.log(JSON.stringify(result,null,2));
}else if(op==='overview'){
 const s=state(); console.log(JSON.stringify({keys:Object.keys(s),snapshot_keys:Object.keys(s.snapshot),sizes:Object.fromEntries(Object.entries(s.snapshot).map(([k,v])=>[k,{entries:Object.keys(v).length,chars:JSON.stringify(v).length}])),volumes:fs.readdirSync(path.join(work,'大纲/分卷'))},null,2));
}else if(op==='snapshot'){
 const [field,start='0',count='5']=args;const value=state().snapshot[field];
 const entries=Array.isArray(value)?value:Object.entries(value);
 console.log(JSON.stringify({state_sha256:sha(path.join(work,'.writer/state.json')),field,total:entries.length,from_index:Number(start),entries:entries.slice(Number(start),Number(start)+Number(count))},null,2));
}else if(op==='snapshot-compact'){
 const [field,start='0',count='8000']=args;const text=JSON.stringify(state().snapshot[field]);
 const from=Number(start),to=Math.min(text.length,from+Number(count));
 console.log(JSON.stringify({state_sha256:sha(path.join(work,'.writer/state.json')),field,from_char:from,to_char_exclusive:to,total_chars:text.length}));
 console.log(text.slice(from,to));console.log(`[${to===text.length?'Complete':'Partial'} next_char=${to}]`);
}else if(op==='snapshot-text'){
 const [field,start='0',count='4000']=args;const text=JSON.stringify(state().snapshot[field],null,2);
 const from=Number(start),to=Math.min(text.length,from+Number(count));
 console.log(JSON.stringify({state_sha256:sha(path.join(work,'.writer/state.json')),field,from_char:from,to_char_exclusive:to,total_chars:text.length}));
 console.log(text.slice(from,to));console.log(`[${to===text.length?'Complete':'Partial'} next_char=${to}]`);
}else if(op==='chapter'){
 const n=Number(args[0]);const rel=state().units.find(u=>u.unit===n)?.draft;if(!rel)throw Error('Unknown chapter');
 const lines=fs.readFileSync(path.join(work,rel),'utf8').split(/\r?\n/);if(lines.at(-1)==='')lines.pop();
 for(let start=1;start<=lines.length;start+=40){
  const r=runner.run(process.execPath,[fileURLToPath(import.meta.url),'read',rel,String(start),'40'],`inner-read-${n}-${start}`);
  process.stdout.write(r.stdout);process.stderr.write(r.stderr);if(r.exit_code!==0){process.exitCode=r.exit_code??1;break;}
  const info=JSON.parse(r.stdout.split('\n')[0]);
  fs.appendFileSync(path.join(stage,'reading.jsonl'),JSON.stringify({...info,raw_command:r.files.metadata,raw_stdout:r.files.stdout,raw_stderr:r.files.stderr,argv:r.argv,scope:'returned-to-current-model; script coverage is not semantic proof'})+'\n');
 }
}else if(op==='freeze'){
 const target=path.join(stage,'before','work');if(fs.existsSync(target))throw Error('Freeze already exists');
 fs.mkdirSync(path.dirname(target),{recursive:true});fs.cpSync(work,target,{recursive:true,errorOnExist:true,force:false});
 const manifest=walk(target).map(p=>({path:path.relative(target,p).replaceAll('\\','/'),sha256:sha(p),bytes:fs.statSync(p).size}));
 fs.writeFileSync(path.join(stage,'before-manifest.json'),JSON.stringify({frozen_at:new Date().toISOString(),state_sha256:sha(path.join(work,'.writer/state.json')),files:manifest},null,2)+'\n',{flag:'wx'});
 console.log(JSON.stringify({files:manifest.length,state_sha256:sha(path.join(target,'.writer/state.json')),manifest:path.join(stage,'before-manifest.json')}));
}else if(op==='audit'){
 (await import('./audit.mjs')).default();
}else if(op==='segment-audit'){
 const rows=fs.readFileSync(path.join(stage,'replay-transitions.jsonl'),'utf8').trim().split('\n').map(JSON.parse);
 for(const row of rows)for(const d of row.semantic_changes){
  if(typeof d.before!=='string'||typeof d.after!=='string'||Math.max(d.before.length,d.after.length)<1000)continue;
  const a=d.before.match(/[^。；]*[。；]|[^。；]+$/g)??[],b=d.after.match(/[^。；]*[。；]|[^。；]+$/g)??[];
  const dp=Array.from({length:a.length+1},()=>new Uint16Array(b.length+1));
  for(let i=a.length-1;i>=0;i--)for(let j=b.length-1;j>=0;j--)dp[i][j]=a[i]===b[j]?dp[i+1][j+1]+1:Math.max(dp[i+1][j],dp[i][j+1]);
  const changes=[];let i=0,j=0,old='',fresh='';const flush=()=>{if(old||fresh)changes.push({before:old,after:fresh});old='';fresh='';};
  while(i<a.length||j<b.length){if(i<a.length&&j<b.length&&a[i]===b[j]){flush();i++;j++;}else if(j<b.length&&(i===a.length||dp[i][j+1]>=dp[i+1][j]))fresh+=b[j++];else old+=a[i++];}flush();
  d.exact_segment_changes=changes;delete d.before;delete d.after;
 }
 fs.writeFileSync(path.join(stage,'replay-transitions-segmented.jsonl'),rows.map(r=>JSON.stringify(r)).join('\n')+'\n',{flag:'wx'});
 console.log(JSON.stringify({units:rows.length,characters:rows.map(r=>JSON.stringify(r)).join('\n').length,method:'Exact punctuation-token LCS; only identical retained strings omitted; full reversible deltas preserved separately'}));
}else if(op==='transition'||op==='transition-s'){
 const lines=fs.readFileSync(path.join(stage,op==='transition'?'replay-transitions.jsonl':'replay-transitions-segmented.jsonl'),'utf8').trim().split('\n');
 const [n,start='0',count='8000']=args;const txt=lines[Number(n)-1];if(!txt)throw Error('Unknown transition');
 const from=Number(start),to=Math.min(txt.length,from+Number(count));console.log(JSON.stringify({unit:Number(n),from_char:from,to_char_exclusive:to,total_chars:txt.length}));
 console.log(txt.slice(from,to));console.log(`[${to===txt.length?'Complete':'Partial'} next_char=${to}]`);
}else if(op==='note'){
 const input=JSON.parse(fs.readFileSync(path.resolve(stage,args[0]),'utf8'));
 const records=fs.readFileSync(path.join(stage,'reading.jsonl'),'utf8').trim().split(/\r?\n/).map(JSON.parse);
 const units=state().units.filter(u=>u.unit>=input.from&&u.unit<=input.to);
 const bindings=units.map(u=>{const rows=records.filter(r=>r.path===u.draft&&r.sha256===sha(path.join(work,u.draft))&&r.from<=r.to);return {unit:u.unit,path:u.draft,sha256:sha(path.join(work,u.draft)),read_ranges:rows.map(r=>[r.from,r.to]),read_dates:rows.map(r=>r.read_at),raw_records:rows.map(r=>r.raw_command)};});
 const rel=`审查/final-review-reading-${String(input.from).padStart(4,'0')}-${String(input.to).padStart(4,'0')}-before.md`;
 const content=`# 当前原稿模型实读笔记 ${input.from}—${input.to}\n\n记录日：${new Date().toISOString()}。当前同一原生模型知情复查；非真人盲读、市场测试或发布验收。\n\n${input.note}\n\n## 实际阅读绑定\n\n下列为真实返回记录，脚本行覆盖不代替语义阅读。\n\n\`\`\`json\n${JSON.stringify(bindings,null,2)}\n\`\`\`\n`;
 fs.writeFileSync(path.join(work,rel),content,{flag:'wx'});console.log(JSON.stringify({report:rel,sha256:sha(path.join(work,rel)),bindings:bindings.length}));
}else if(op==='fix'){
 (await import('./fix.mjs')).default(args);
}else if(op==='finalize'){
 (await import('./finalize.mjs')).default(args);
}else throw Error(`Unknown operation ${op}`);
