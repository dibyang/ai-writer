import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';import {spawn} from 'node:child_process';import {fileURLToPath} from 'node:url';
const base=path.dirname(fileURLToPath(import.meta.url));let [label,...args]=process.argv.slice(2),stdinFile;
if(args[0]==='--stdin-file'){stdinFile=path.resolve(args[1]);args=args.slice(2);}const [exe,...argv]=args;
if(!/^[a-z][a-z0-9-]*$/.test(label??'')||!exe)throw Error('label [--stdin-file file] exe args');
const dir=path.join(base,'commands',label);if(fs.existsSync(dir))throw Error('Never overwrite command evidence');fs.mkdirSync(dir,{recursive:true});
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
let input=null;const at=argv.indexOf('--input');if(at>=0){const file=path.resolve(argv[at+1]),raw=fs.readFileSync(file);fs.writeFileSync(path.join(dir,'input.raw.json'),raw,{flag:'wx'});input={file,sha256:sha(raw)};}
if(stdinFile){const raw=fs.readFileSync(stdinFile);fs.writeFileSync(path.join(dir,'stdin.raw.md'),raw,{flag:'wx'});input={file:stdinFile,sha256:sha(raw)};}
const pat=argv.indexOf('--project'),stateFile=pat<0?null:path.resolve(argv[pat+1],'.writer/state.json');
function snap(name){if(!stateFile||!fs.existsSync(stateFile))return null;const raw=fs.readFileSync(stateFile);fs.writeFileSync(path.join(dir,name),raw,{flag:'wx'});return sha(raw);}
const before=snap('before-state.json'),start=Date.now();let stdoutBytes=0,stderrBytes=0;
const out=fs.openSync(path.join(dir,'stdout.raw.txt'),'wx'),err=fs.openSync(path.join(dir,'stderr.raw.txt'),'wx');
if(exe==='npm.cmd'&&argv.some(x=>!/^[-A-Za-z0-9:_]+$/.test(x)))throw Error('Unsafe npm args');
const child=spawn(exe==='npm.cmd'?process.env.ComSpec:exe,exe==='npm.cmd'?['/d','/c','npm.cmd',...argv]:argv,{windowsHide:true,stdio:['pipe','pipe','pipe']});
child.stdout.on('data',b=>{fs.writeSync(out,b);stdoutBytes+=b.length;});child.stderr.on('data',b=>{fs.writeSync(err,b);stderrBytes+=b.length;});
if(stdinFile)child.stdin.end(fs.readFileSync(stdinFile));else child.stdin.end();
const pulse=setInterval(()=>console.log(JSON.stringify({label,running:true,elapsed_ms:Date.now()-start,stdout_bytes:stdoutBytes,stderr_bytes:stderrBytes})),30000);
const timer=setTimeout(()=>child.kill(),1200000);let error=null;child.on('error',e=>{error=e.message;});
child.on('close',(code,signal)=>{clearInterval(pulse);clearTimeout(timer);fs.closeSync(out);fs.closeSync(err);const result={label,exe,args:argv,cwd:process.cwd(),started_at:new Date(start).toISOString(),elapsed_ms:Date.now()-start,exit_code:code,signal,error,stdout_bytes:stdoutBytes,stderr_bytes:stderrBytes,input,before_state_sha256:before,after_state_sha256:snap('after-state.json')};fs.writeFileSync(path.join(dir,'result.json'),JSON.stringify(result,null,2)+'\n',{flag:'wx'});console.log(JSON.stringify(result));process.exitCode=code??1;});
