const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process');
const[label,script,...args]=process.argv.slice(2),dir=path.join(__dirname,'helper-cli');fs.mkdirSync(dir,{recursive:true});
const prefix=path.join(dir,label),cwd=path.resolve(__dirname,'../../..');if(fs.existsSync(prefix+'.result.json'))throw new Error('existing log');
const argv=script==='--failed-reproduction'?['-e',JSON.parse(fs.readFileSync(path.join(__dirname,'helper-failures.json'))).attempts[Number(args[0])].cmd.slice(9,-1)]:[script,...args];
fs.writeFileSync(prefix+'.argv.json',JSON.stringify({cwd,executable:process.execPath,argv,started:new Date().toISOString()},null,2)+'\n');
const r=cp.spawnSync(process.execPath,argv,{cwd,encoding:null,maxBuffer:32*1024*1024});fs.writeFileSync(prefix+'.stdout.txt',r.stdout||'');fs.writeFileSync(prefix+'.stderr.txt',r.stderr||'');fs.writeFileSync(prefix+'.result.json',JSON.stringify({exit_code:r.status,signal:r.signal,error:r.error?String(r.error):null,ended:new Date().toISOString()},null,2)+'\n');process.stdout.write(r.stdout||'');process.stderr.write(r.stderr||'');process.exitCode=r.status===null?1:r.status;
