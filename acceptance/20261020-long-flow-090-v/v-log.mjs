import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {spawn} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const base=path.dirname(fileURLToPath(import.meta.url));
const project=path.join(base,'scenario','东岸末班船-扩展验证');
let [label,...args]=process.argv.slice(2);
let stdinPath;
if(args[0]==='--stdin-file'){stdinPath=path.resolve(args[1]);args=args.slice(2);}
const [exe,...argv]=args;
if(!/^[a-z][a-z0-9-]*$/.test(label??'')||!exe)throw Error('label [--stdin-file file] exe args');
const dir=path.join(base,'cli-logs',label);
if(fs.existsSync(dir))throw Error('Never overwrite command evidence: '+label);
fs.mkdirSync(dir,{recursive:true});
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const at=argv.indexOf('--project');
const target=at<0?project:path.resolve(argv[at+1]);
if(target!==project&&!target.startsWith(base+path.sep))throw Error('Project must remain within V');
const stateFile=path.join(target,'.writer','state.json');
const save=(name,data)=>fs.writeFileSync(path.join(dir,name),data,{flag:'wx'});
save('argv.raw.json',JSON.stringify({exe,argv,cwd:process.cwd(),stdin_file:stdinPath??null},null,2)+'\n');
const inputs=[];
for(let i=0;i<argv.length;i++)if(argv[i]==='--input'){
 const file=path.resolve(argv[i+1]),raw=fs.readFileSync(file);
 save(`input-${inputs.length+1}.raw.json`,raw);inputs.push({file,sha256:sha(raw)});
}
let stdin;
if(stdinPath){stdin=fs.readFileSync(stdinPath);save('stdin.raw.md',stdin);inputs.push({file:stdinPath,sha256:sha(stdin)});}
function snap(name){if(!fs.existsSync(stateFile))return null;const raw=fs.readFileSync(stateFile);save(name,raw);return sha(raw);}
const before=snap('before-state.json'),start=Date.now();
let stdoutBytes=0,stderrBytes=0,error=null;
const out=fs.openSync(path.join(dir,'stdout.raw.txt'),'wx'),err=fs.openSync(path.join(dir,'stderr.raw.txt'),'wx');
const child=spawn(exe,argv,{windowsHide:true,stdio:['pipe','pipe','pipe']});
child.stdout.on('data',b=>{fs.writeSync(out,b);stdoutBytes+=b.length;process.stdout.write(b);});
child.stderr.on('data',b=>{fs.writeSync(err,b);stderrBytes+=b.length;process.stderr.write(b);});
child.stdin.end(stdin);
const pulse=setInterval(()=>process.stdout.write(JSON.stringify({label,running:true,elapsed_ms:Date.now()-start,stdout_bytes:stdoutBytes,stderr_bytes:stderrBytes})+'\n'),30000);
child.on('error',e=>{error=e.message;});
child.on('close',(code,signal)=>{
 clearInterval(pulse);fs.closeSync(out);fs.closeSync(err);
 const result={label,exe,argv,cwd:process.cwd(),project:target,started_at:new Date(start).toISOString(),elapsed_ms:Date.now()-start,exit_code:code,signal,error,stdout_bytes:stdoutBytes,stderr_bytes:stderrBytes,inputs,before_state_sha256:before,after_state_sha256:snap('after-state.json')};
 save('result.json',JSON.stringify(result,null,2)+'\n');
 process.stdout.write('\n'+JSON.stringify(result)+'\n');process.exitCode=code??1;
});
