import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {spawn} from 'node:child_process';
import {main} from '../lib/workspace.mjs';
import {inventoryProject} from '../lib/project-backup.mjs';
import {fixture,file,workflow,begin,ROOT} from './protection-fixture.mjs';
const linux=process.platform==='linux'&&process.arch==='x64';
function invoke(root,dir,action,input){return main(['backup',action,'--project',root,'--input',file(dir,crypto.randomUUID()+'.json',input)]);}
function cli(entry,args,input){return new Promise((resolve,reject)=>{const p=spawn(entry,args,{windowsHide:true,stdio:['pipe','pipe','pipe']});let stdout='',stderr='';p.stdout.on('data',x=>stdout+=x);p.stderr.on('data',x=>stderr+=x);p.once('error',reject);p.once('close',status=>resolve({status,stdout,stderr}));p.stdin.end(input);});}
test('不支持的平台保持拒绝，不退回普通复制',{skip:linux},t=>{
 const {root,dir}=fixture(t,0),before=inventoryProject(root);
 const r=invoke(root,dir,'inspect',{out_parent:dir,out_name:'not-created'});
 assert.equal(r.can_backup,false);assert.equal(r.request,null);assert.equal(r.blockers[0].code,'BACKUP_PLATFORM_UNSUPPORTED');assert.deepEqual(inventoryProject(root),before);
});
test('已有锁、活跃修订和原有源保护继续拒绝',t=>{
 const {root,dir}=fixture(t,1),q={out_parent:dir,out_name:'backup'};
 assert.throws(()=>invoke(root,dir,'inspect',{...q,extra:true}),e=>e.code==='BACKUP_REQUEST_INVALID');
 fs.mkdirSync(path.join(root,'.git'));assert.throws(()=>invoke(root,dir,'inspect',q),e=>e.code==='BACKUP_VCS_UNSUPPORTED');fs.rmdirSync(path.join(root,'.git'));
 file(root,'.writer/import.json',{sources:[{unit:2}]});assert.throws(()=>invoke(root,dir,'inspect',q),e=>e.code==='BACKUP_IMPORT_INCOMPLETE');fs.unlinkSync(path.join(root,'.writer/import.json'));
 file(root,'.writer/write.lock','synthetic-existing-lock');const before=inventoryProject(root);
 assert.throws(()=>invoke(root,dir,'inspect',q),e=>e.code==='BACKUP_SOURCE_BUSY');assert.deepEqual(inventoryProject(root),before);
 fs.unlinkSync(path.join(root,'.writer/write.lock'));workflow(root,true);begin(root);
 assert.throws(()=>invoke(root,dir,'inspect',q),e=>e.code==='BACKUP_REVISION_ACTIVE');
});
test('create在读取源或取得锁前拒绝旧请求、空请求和不受信能力声明',t=>{
 const {root,dir}=fixture(t,0),before=inventoryProject(root),out=path.join(dir,'not-created');
 for(const q of [{},{format:'ai-writer-archive-backup-request@1',out_parent:dir,out_name:'not-created',capability:{lock_isolation_verified:true}}, {mode:'create',source:'/not-a-project'}])
  assert.throws(()=>invoke(root,dir,'create',q),e=>e.code==='BACKUP_LOCK_ISOLATION_UNVERIFIED');
 assert.deepEqual(inventoryProject(root),before);assert.equal(fs.existsSync(out),false);
 assert.throws(()=>main(['backup','create','--project',path.join(dir,'missing-source'),'--input',file(dir,'blocked.json',{})]),e=>e.code==='BACKUP_LOCK_ISOLATION_UNVERIFIED');
});
test('同权限常规并发调用均阻断，已有锁和全部源内容保持不变',async t=>{
 const {root,dir}=fixture(t,0);file(root,'.writer/write.lock','synthetic-other-operation-lock');
 const before=inventoryProject(root),input=file(dir,'request.json',{format:'ai-writer-archive-backup-request@1',out_parent:dir,out_name:'concurrent-not-created'});
 const results=await Promise.all([1,2,3].map(()=>cli(process.execPath,[path.join(ROOT,'bin/ai-writer.mjs'),'backup','create','--project',root,'--input',input])));
 for(const r of results){assert.equal(r.status,2);assert.equal(r.stdout,'');assert.equal(JSON.parse(r.stderr).code,'BACKUP_LOCK_ISOLATION_UNVERIFIED');}
 assert.deepEqual(inventoryProject(root),before);assert.equal(fs.existsSync(path.join(dir,'concurrent-not-created')),false);
});
test('Linux预检明确报告锁隔离未确认，不生成可执行请求',{skip:!linux},t=>{
 const {root,dir}=fixture(t,0),before=inventoryProject(root);
 const r=invoke(root,dir,'inspect',{out_parent:process.env.AI_WRITER_BACKUP_TEST_PARENT??dir,out_name:'isolation-not-created'});
 assert.equal(r.can_backup,false);assert.equal(r.request,null);assert.equal(r.blockers[0].code,'BACKUP_LOCK_ISOLATION_UNVERIFIED');assert.deepEqual(inventoryProject(root),before);
});
test('直接调用Python后端也在任何源或输出访问前阻断',{skip:!linux||!fs.existsSync('/usr/bin/python3')},async t=>{
 const {root,dir}=fixture(t,0),before=inventoryProject(root),helper=path.join(ROOT,'lib/backup-posix.py');
 const replies=await Promise.all([1,2].map(()=>cli('/usr/bin/python3',['-I','-B',helper],JSON.stringify({mode:'create',source:path.join(dir,'missing-source'),out_parent:dir,out_name:'provider-not-created',expected_capability:{lock_isolation_verified:true}}))));
 for(const r of replies){assert.equal(r.status,2);assert.equal(JSON.parse(r.stdout).code,'BACKUP_LOCK_ISOLATION_UNVERIFIED');}
 assert.deepEqual(inventoryProject(root),before);assert.equal(fs.existsSync(path.join(dir,'provider-not-created')),false);
});
