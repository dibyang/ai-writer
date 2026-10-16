const fs=require('fs');
const path=require('path');
const cp=require('child_process');
const crypto=require('crypto');
const root=path.resolve(__dirname,'../../..');
const project=path.join(root,'acceptance/20261016-expanded/works/潮汐信号');
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const mode=process.argv[2];
fs.mkdirSync(path.join(__dirname,'logs'),{recursive:true});
if(mode==='capture'){
 const state=fs.readFileSync(path.join(project,'.writer/state.json'));
 fs.writeFileSync(path.join(__dirname,'before-state.json'),state);
 const s=JSON.parse(state);
 fs.writeFileSync(path.join(__dirname,'before-ledger.json'),JSON.stringify(s.snapshot.ledger,null,2));
 fs.writeFileSync(path.join(__dirname,'before-characters.json'),JSON.stringify(s.snapshot.characters,null,2));
 fs.copyFileSync(path.join(__dirname,'../session-f/record-24.json'),path.join(__dirname,'before-record-24.json'));
 fs.copyFileSync(path.join(__dirname,'../session-f/changes-24.json'),path.join(__dirname,'before-changes-24.json'));
 const manifest={};
 function walk(dir,rel='') { for(const d of fs.readdirSync(dir,{withFileTypes:true})) {const r=rel?rel+'/'+d.name:d.name; if(d.isDirectory())walk(path.join(dir,d.name),r);else {const b=fs.readFileSync(path.join(dir,d.name));manifest[r]=sha(b);}} }
 walk(project);
 const drafts={};
 for(const f of fs.readdirSync(path.join(project,'正文')).sort()) {const b=fs.readFileSync(path.join(project,'正文',f));drafts['正文/'+f]=sha(b); if(f.startsWith('0024'))fs.writeFileSync(path.join(__dirname,'before-24.md'),b);}
 fs.writeFileSync(path.join(__dirname,'before-file-manifest.json'),JSON.stringify(manifest,null,2));
 fs.writeFileSync(path.join(__dirname,'before-draft-hashes.json'),JSON.stringify(drafts,null,2));
 fs.cpSync(path.join(project,'.writer/journal'),path.join(__dirname,'before-journal'),{recursive:true,errorOnExist:true});
 console.log(JSON.stringify({revision:s.revision,keys:Object.keys(s),snapshot_keys:Object.keys(s.snapshot),ledger_count:Object.keys(s.snapshot.ledger).length,unit_keys:Object.keys(s.units[0]||{}),project},null,2));
}else if(mode==='cli'||mode==='helper'){
 const label=process.argv[3],args=process.argv.slice(4);
 const argv=mode==='cli'?['bin/ai-writer.mjs',...args]:args;
 const start=new Date().toISOString();
 const r=cp.spawnSync(process.execPath,argv,{cwd:root,encoding:null,maxBuffer:32*1024*1024});
 fs.writeFileSync(path.join(__dirname,'logs',label+'.stdout'),r.stdout||Buffer.alloc(0));
 fs.writeFileSync(path.join(__dirname,'logs',label+'.stderr'),r.stderr||Buffer.alloc(0));
 const meta={start,end:new Date().toISOString(),executable:process.execPath,argv,cwd:root,exit_code:r.status,signal:r.signal,error:r.error?String(r.error):null,kind:mode};
 fs.writeFileSync(path.join(__dirname,'logs',label+'.meta.json'),JSON.stringify(meta,null,2));
 fs.appendFileSync(path.join(__dirname,'cli-index.jsonl'),JSON.stringify({label,...meta})+'\n');
 process.stdout.write(r.stdout||'');process.stderr.write(r.stderr||'');process.exitCode=r.status===null?1:r.status;
}else if(mode==='read'){
 const from=+process.argv[3],to=+process.argv[4],label=process.argv[5];
 let out='';const hashes={};
 for(const f of fs.readdirSync(path.join(project,'正文')).sort()){const n=+f.slice(0,4);if(n>=from&&n<=to){const b=fs.readFileSync(path.join(project,'正文',f));hashes['正文/'+f]=sha(b);out+='\n===== '+f+' =====\n'+b.toString('utf8')+'\n';}}
 fs.writeFileSync(path.join(__dirname,label+'.read.txt'),out);fs.writeFileSync(path.join(__dirname,label+'.hashes.json'),JSON.stringify(hashes,null,2));
 console.log(JSON.stringify({from,to,files:Object.keys(hashes).length,chars:out.length}));
}else throw Error('unknown mode');
