import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const x=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(x,'../..');
const binary='C:/Users/admin/AppData/Local/OpenAI/Codex/bin/6257d9e8f63c0f2b/codex.exe';
const events=path.join(x,'creation-controller-after-capacity.events.jsonl');
const json=f=>JSON.parse(fs.readFileSync(f,'utf8'));
const emit=v=>{const row={at:new Date().toISOString(),...v};fs.appendFileSync(events,JSON.stringify(row)+'\n');console.log(JSON.stringify(row));};
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
async function waitResult(label){
  const file=path.join(x,'commands',label,'result.json');
  const start=Date.now();
  while(!fs.existsSync(file)){
    assert(Date.now()-start<3*3600_000,`Timed out waiting for ${label}`);
    await sleep(2000);
  }
  const r=json(file);assert.equal(r.exit_code,0,`${label} failed`);return r;
}
async function execute(label,exe,args,stdin){
  const a=[path.join(x,'run-long.mjs'),label];
  if(stdin)a.push('--stdin-file',path.join(x,stdin));
  a.push(exe,...args);
  emit({phase:'start',label});
  const child=spawn(process.execPath,a,{cwd:root,windowsHide:true,stdio:['ignore','pipe','pipe']});
  let output='';
  child.stdout.on('data',b=>{const s=b.toString();output+=s;process.stdout.write(s);});
  child.stderr.on('data',b=>process.stderr.write(b));
  const exit=await new Promise((resolve,reject)=>{child.once('error',reject);child.once('close',(code,signal)=>resolve({code,signal}));});
  assert.equal(exit.code,0,`${label}: ${JSON.stringify(exit)}`);
  const receipt=await waitResult(label);
  emit({phase:'complete',label,elapsed_ms:receipt.elapsed_ms});
  return {receipt,output};
}
async function helper(label,file,args=[]){return execute('root-'+label,process.execPath,[path.join(x,file),...args]);}
function thread(label){
  const rows=fs.readFileSync(path.join(x,'commands',label,'stdout.raw.txt'),'utf8').split(/\r?\n/).filter(Boolean).map(v=>JSON.parse(v));
  const id=rows.find(r=>r.type==='thread.started')?.thread_id;assert(id);return id;
}
function addSession(letter,label){
  const id=thread(label),file=path.join(x,'native-session-sources.json'),sources=json(file);
  const dir='C:/Users/admin/.codex/sessions/2026/10/21';
  const matches=fs.readdirSync(dir).filter(n=>n.endsWith('-'+id+'.jsonl'));assert.equal(matches.length,1);
  assert(Array.isArray(sources));
  if(!sources.some(v=>v.thread_id===id)){
    sources.push({label:letter,thread_id:id,source:path.join(dir,matches[0]).replaceAll('\\','/')});
    fs.writeFileSync(file,JSON.stringify(sources,null,2)+'\n');
  }
}
function clarifyPrompt(file){
  fs.appendFileSync(path.join(x,file),'\n根补充：context 的 --out 须为 .writer/drafts/ 下一个尚不存在的 JSON 文件，例如 .writer/drafts/x-context-本轮前缀-章节.json；.writer/其他目录会被真实产品保护拒绝。其他命令的输出位置以各自实际帮助为准。保留所有失败和旧输入，不改写历史。\n');
}
async function native(label,prompt,resumeId){
  clarifyPrompt(prompt);
  const args=['exec','--json','--sandbox','workspace-write','-C',root];
  if(resumeId)args.push('resume','--json');
  args.push('-o',path.join(x,label+'-last.md'));
  if(resumeId)args.push(resumeId);
  args.push('-');
  await execute(label,binary,args,prompt);
}
try{
  emit({phase:'controller-start',scope:'wait for actual same-ID B capacity recovery, then serial C/D; original failed controller retained'});
  await waitResult('codex-b-resume-capacity-recovery');
  await helper('b-capacity-resume-entry','verify-resume-start.mjs',['b-capacity','codex-b-first','codex-b-resume-capacity-recovery','parent-b-capacity-stop-state.json','brc-entry-status']);
  await helper('b-capacity-resume-read','verify-read-pass.mjs',['brc-window-current','codex-b-resume-capacity-recovery']);
  await helper('b-capacity-resume-creation','verify-creation.mjs',['brc29-30','29','30']);
  await helper('b-complete-checkpoint','checkpoint.mjs',['b-complete']);
  for(const [letter,first] of [['c',31],['d',34]]){
    const firstLabel=`codex-${letter}-first`,resumeLabel=`codex-${letter}-resume`,prefix=letter+'r';
    if(letter==='b'){
      await waitResult(firstLabel);
      emit({phase:'existing-native-complete',label:firstLabel});
    }else{
      await helper(`${letter}-prepare-first`,'prepare-next-wave.mjs',[letter]);
      await native(firstLabel,`prompt-${letter}-first.md`);
      await helper(`${letter}-fresh-entry`,'verify-fresh-start.mjs',[letter,firstLabel,`parent-before-${letter}-state.json`,`${letter}-entry-status`]);
      addSession(letter,firstLabel);
    }
    await helper(`${letter}-first-checkpoint`,'checkpoint.mjs',[letter+'-first']);
    await helper(`${letter}-entry-read`,'verify-read-pass.mjs',[letter+'-entry-current',firstLabel]);
    await helper(`${letter}-creation-${first}`,'verify-creation.mjs',[letter+first,String(first),String(first)]);
    await helper(`${letter}-archive-sources`,'archive-source-stop.mjs',[letter]);
    await helper(`${letter}-prepare-resume`,'prepare-resume.mjs',[letter]);
    await native(resumeLabel,`prompt-${letter}-resume.md`,thread(firstLabel));
    await helper(`${letter}-resume-entry`,'verify-resume-start.mjs',[letter,firstLabel,resumeLabel,`parent-${letter}-first-stop-state.json`,prefix+'-entry-status']);
    await helper(`${letter}-resume-read`,'verify-read-pass.mjs',[prefix+'-window-current',resumeLabel]);
    await helper(`${letter}-resume-creation`,'verify-creation.mjs',[prefix+(first+1)+'-'+(first+2),String(first+1),String(first+2)]);
    await helper(`${letter}-complete-checkpoint`,'checkpoint.mjs',[letter+'-complete']);
  }
  const result={ok:true,at:new Date().toISOString(),scope:'B recovered after actual capacity failure, C/D creation through36 only; E/F and final audit remain',original_failed_controller:'creation-controller.result.json',capacity_failed_invocation:'codex-b-resume'};
  fs.writeFileSync(path.join(x,'creation-controller-after-capacity.result.json'),JSON.stringify(result,null,2)+'\n',{flag:'wx'});emit(result);
}catch(error){
  const result={ok:false,at:new Date().toISOString(),message:error.message,stack:error.stack};
  fs.writeFileSync(path.join(x,'creation-controller-after-capacity.result.json'),JSON.stringify(result,null,2)+'\n',{flag:'wx'});emit(result);process.exitCode=1;
}
