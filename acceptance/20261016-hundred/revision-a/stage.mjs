import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {createRunner} from '../command-runner.mjs';
export const root=process.cwd(), stage=path.resolve('acceptance/20261016-hundred/revision-a'), work=path.resolve('acceptance/20261016-hundred/works/潮汐信号');
export const runner=createRunner('acceptance/20261016-hundred/revision-a');
export const read=p=>JSON.parse(fs.readFileSync(p,'utf8').replace(/^\uFEFF/,''));
export const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
export function save(p,v){fs.mkdirSync(path.dirname(p),{recursive:true});fs.writeFileSync(p,typeof v==='string'?v:JSON.stringify(v,null,2)+'\n');}
export function cli(command,args,label){return runner.run(process.execPath,[path.join(work,'.writer/tool/bin/ai-writer.mjs'),command,'--project',work,...args],label);}
export function logRead(ref,purpose,version='before'){const p=path.isAbsolute(ref)?ref:path.join(work,ref);fs.appendFileSync(path.join(stage,'reading.jsonl'),JSON.stringify({at:new Date().toISOString(),path:p,sha256:hash(p),purpose,version,kind:'model-full-text-read'})+'\n');}
if(process.argv[2]==='freeze'){
 const target=path.join(stage,'before','work');if(fs.existsSync(target))throw Error('before already exists');
 const state=read(path.join(work,'.writer/state.json'));if(state.revision!==90||state.units.length!==42)throw Error('Expected r90/42');
 const status=cli('status',[],'before-status');if(status.exit_code!==0)throw Error(status.stderr);
 fs.cpSync(work,target,{recursive:true,errorOnExist:true,force:false});
 const files=[];function walk(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){const f=path.join(dir,e.name);if(e.isDirectory())walk(f);else files.push({file:path.relative(target,f).replaceAll('\\','/'),bytes:fs.statSync(f).size,sha256:hash(f)});}}walk(target);
 save(path.join(stage,'before','manifest.json'),{at:new Date().toISOString(),revision:90,units:42,state_sha256:hash(path.join(target,'.writer/state.json')),files});
 save(path.join(stage,'before','active-authority.json'),{revision:90,units:state.units.map(u=>({unit:u.unit,draft:u.draft,journal:u.journal,source_hashes:u.source_hashes})),baseline_policy:'Replay only these r90 units journals, never old rewind or legacy record inputs.'});
 console.log(JSON.stringify({revision:state.revision,units:state.units.length,files:files.length,bytes:files.reduce((s,x)=>s+x.bytes,0),state_keys:Object.keys(state),unit25:state.units[24],snapshot_keys:Object.keys(state.snapshot),ledger_ids:Object.keys(state.snapshot.ledger)}));
}
