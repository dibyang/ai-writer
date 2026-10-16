import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';
import {replaySnapshots} from '../rebuild-utils.mjs';
const stage=path.resolve('acceptance/20261016-hundred/revision-b');
const work=path.resolve('acceptance/20261016-hundred/works/潮汐信号');
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const state=JSON.parse(fs.readFileSync(path.join(work,'.writer/state.json'),'utf8'));
if(state.revision!==165||state.units.length!==66)throw Error('Expected live r165 / 66');
const pre=path.join(stage,'before-r165');if(fs.existsSync(pre))throw Error('Freeze exists');
fs.mkdirSync(pre);fs.cpSync(work,path.join(pre,'work'),{recursive:true});
const files=[];function walk(dir,rel=''){for(const e of fs.readdirSync(dir,{withFileTypes:true})){const r=rel?rel+'/'+e.name:e.name,p=path.join(dir,e.name);if(e.isDirectory())walk(p,r);else if(e.isFile()){const b=fs.readFileSync(p);files.push({path:r,bytes:b.length,sha256:sha(b)});}else throw Error('Nonregular '+p);}}
walk(path.join(pre,'work'));fs.writeFileSync(path.join(pre,'sha256.json'),JSON.stringify(files,null,2)+'\n',{flag:'wx'});
const snapshots=replaySnapshots(work,state);fs.mkdirSync(path.join(pre,'snapshots'));
for(let n=0;n<snapshots.length;n++)fs.writeFileSync(path.join(pre,'snapshots',String(n).padStart(3,'0')+'.json'),JSON.stringify(snapshots[n],null,2)+'\n',{flag:'wx'});
fs.writeFileSync(path.join(pre,'snapshots-sha256.json'),JSON.stringify(snapshots.map((_,n)=>({unit:n,sha256:sha(fs.readFileSync(path.join(pre,'snapshots',String(n).padStart(3,'0')+'.json')))})),null,2)+'\n',{flag:'wx'});
fs.writeFileSync(path.join(stage,'baseline.json'),JSON.stringify({revision:state.revision,units:state.units,manifest:files,snapshot_count:snapshots.length},null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({revision:state.revision,units:state.units.length,state_keys:Object.keys(state),files:files.length,bytes:files.reduce((s,f)=>s+f.bytes,0),unit36:state.units.find(x=>x.unit===36),source_files:[...new Set(state.units.flatMap(x=>Object.keys(x.source_hashes??{})))],writer_files:files.filter(x=>x.path.startsWith('.writer/')&&!x.path.includes('backup')&&!x.path.includes('journal')&&!x.path.includes('/tool/')).map(x=>({path:x.path,bytes:x.bytes})),observations:Object.values(state.snapshot.ledger).filter(x=>x.type==='observation').map(x=>({id:x.id,statement:x.statement}))},null,2));
