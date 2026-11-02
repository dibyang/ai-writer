// Enumerate inputs explicitly: Node 20 on Windows does not expand shell globs.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawn} from 'node:child_process';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const [suite,...options]=process.argv.slice(2);
const target={workspace:['tests',/\.test\.mjs$/],engine:['vendor/story-gate-studio/tests',/\.test\.js$/]}[suite];
if(!target)throw Error('Expected workspace or engine test suite');
const [folder,pattern]=target;
const files=fs.readdirSync(path.join(root,folder),{withFileTypes:true}).filter(x=>x.isFile()&&pattern.test(x.name)).map(x=>path.join(root,folder,x.name)).sort();
if(!files.length)throw Error('No test inputs found');
// A second full suite can multiply Git/index scans on large workspaces.
// Keep the lock after an interrupted runner: its child may still be running.
const lockDir=path.join(root,'.tmp');fs.mkdirSync(lockDir,{recursive:true});
const lockPath=path.join(lockDir,'test-runner.lock');
let lockFd;
try { lockFd=fs.openSync(lockPath,'wx'); }
catch(error) {
  if(error.code!=='EEXIST')throw error;
  console.error(`已有测试锁：${lockPath}。不要重复启动；先核对锁中 runner_pid/child_pid 的进程是否仍在运行。中断残留锁仅在确认两者均已结束后移除。`);
  process.exit(1);
}
const lock={runner_pid:process.pid,child_pid:null,suite,started_at:new Date().toISOString()};
function saveLock(){fs.ftruncateSync(lockFd,0);fs.writeSync(lockFd,JSON.stringify(lock,null,2)+'\n',0,'utf8');fs.fsyncSync(lockFd);}
function release(){if(lockFd===undefined)return;fs.closeSync(lockFd);lockFd=undefined;fs.unlinkSync(lockPath);}
saveLock();
const concurrency=options.some(x=>x==='--test-concurrency'||x.startsWith('--test-concurrency='))?[]:['--test-concurrency=2'];
console.log('测试默认最多并行2个文件；同工作区仅允许一批测试。');
let child;
try { child=spawn(process.execPath,['--test',...concurrency,...options,...files],{cwd:root,stdio:'inherit',windowsHide:true}); }
catch(error){release();throw error;}
lock.child_pid=child.pid??null;saveLock();
child.once('error',error=>{console.error(error);release();process.exitCode=1;});
child.once('exit',(code,signal)=>{release();process.exitCode=code??1;});
