import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const x=path.dirname(fileURLToPath(import.meta.url));
const p=path.join(x,'scenario/东岸末班船-再扩展验证');
const phase=process.argv[2];
const options={
  occupied:{code:'REVISION_OCCUPIED',args:['plan']},
  'final-template':{code:'ACTION_OUT_OF_SCOPE',args:['record-template','--unit','37','--draft','正文/0037-根负向无授权.md']},
  'final-context':{code:'ACTION_OUT_OF_SCOPE',args:['context','--purpose','draft','--unit','37']}
};
const option=options[phase];assert(option);
const sha=v=>crypto.createHash('sha256').update(v).digest('hex');
const label='parent-guard-'+phase,dir=path.join(x,'commands',label);
fs.mkdirSync(dir);
const save=(name,v)=>fs.writeFileSync(path.join(dir,name),Buffer.isBuffer(v)||typeof v==='string'?v:JSON.stringify(v,null,2)+'\n',{flag:'wx'});
function inventory(){
  const rows=[];
  function walk(d,r=''){
    for(const n of fs.readdirSync(d).sort()){
      const f=path.join(d,n),ref=r?r+'/'+n:n,s=fs.lstatSync(f);assert(!s.isSymbolicLink());
      if(s.isDirectory())walk(f,ref);
      else{assert(s.isFile());const raw=fs.readFileSync(f);rows.push({file:ref,bytes:raw.length,sha256:sha(raw)});}
    }
  }
  walk(p);return rows;
}
const file=path.join(p,'.writer/state.json'),before=fs.readFileSync(file),s=JSON.parse(before);
assert.equal(s.units.length,36);
if(phase!=='occupied'){
  assert.equal(s.governance.stage,'paused');
  assert.deepEqual(s.governance.authorization.allowed_actions,['discuss']);
  assert.equal(s.governance.authorization.draft_range,null);
  assert.equal(s.governance.authorization.revise_range,null);
}
const filesBefore=inventory();save('before-state.json',before);save('files-before.json',filesBefore);
const args=[path.join(p,'.writer/tool/bin/ai-writer.mjs'),...option.args,'--project',p];
if(phase==='occupied'){
  save('input.raw.json',{unit:37,title:'主区占用保护负向验证',goal:'只检查占用门禁',change:'不新建或修改正文',beats:['仅用于负向检查，不提供正文授权']});
  args.push('--input',path.join(dir,'input.raw.json'));
}
save('argv.json',{exe:process.execPath,args});
const started=Date.now();
const r=spawnSync(process.execPath,args,{encoding:null,windowsHide:true,timeout:30000,maxBuffer:4*1024*1024});
const out=r.stdout??Buffer.alloc(0),err=r.stderr??Buffer.alloc(0);
save('stdout.raw.txt',out);save('stderr.raw.txt',err);
const after=fs.readFileSync(file),filesAfter=inventory();save('after-state.json',after);save('files-after.json',filesAfter);
const result={label,exe:process.execPath,args,started_at:new Date(started).toISOString(),elapsed_ms:Date.now()-started,exit_code:r.status,signal:r.signal,error:r.error?.message??null,stdout_bytes:out.length,stderr_bytes:err.length,before_state_sha256:sha(before),after_state_sha256:sha(after)};
save('result.json',result);
assert.equal(r.status,2,err.toString('utf8'));
assert.equal(JSON.parse(err.toString('utf8')).code,option.code);
assert.deepEqual(after,before);assert.deepEqual(filesAfter,filesBefore);
assert(!fs.existsSync(path.join(p,'正文/0037-根负向无授权.md')));
assert(!fs.existsSync(path.join(p,'大纲/单元/0037.json')));
const proof={ok:true,at:new Date().toISOString(),phase,actual_exit_code:r.status,code:option.code,state_sha256:sha(after),all_work_files_unchanged:true,files:filesBefore.length,units:s.units.length};
save('verification.json',proof);
fs.writeFileSync(path.join(x,label+'-verification.json'),JSON.stringify(proof,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify(proof));
