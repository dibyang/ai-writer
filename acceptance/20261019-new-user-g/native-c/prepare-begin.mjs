import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
const here=path.dirname(fileURLToPath(import.meta.url)),base=path.dirname(here),project=path.join(base,'作品','雾港 来信');
const hash=x=>crypto.createHash('sha256').update(x).digest('hex');
const bytes=fs.readFileSync(path.join(project,'.writer/state.json')),s=JSON.parse(bytes),dir=path.join(here,'baseline-original');
if(s.revision!==18)throw Error('revision');
fs.mkdirSync(dir,{recursive:true});fs.writeFileSync(path.join(dir,'state.json'),bytes,{flag:'wx'});
const manuscripts=[];
for(const u of s.units){const b=fs.readFileSync(path.join(project,u.draft)),out=path.join(dir,u.draft);fs.mkdirSync(path.dirname(out),{recursive:true});fs.writeFileSync(out,b,{flag:'wx'});manuscripts.push({unit:u.unit,draft:u.draft,sha256:hash(b)});}
const manifest={project,base_revision:s.revision,state_sha256:hash(bytes),units_sha256:hash(JSON.stringify(s.units)),snapshot_sha256:hash(JSON.stringify(s.snapshot)),manuscripts};
const old=JSON.parse(fs.readFileSync(path.join(here,'baseline-initial/state.json')));
manifest.units_equal_initial=JSON.stringify(old.units)===JSON.stringify(s.units);manifest.snapshot_equal_initial=JSON.stringify(old.snapshot)===JSON.stringify(s.snapshot);
if(!manifest.units_equal_initial||!manifest.snapshot_equal_initial) throw Error('Facts unexpectedly changed');
fs.writeFileSync(path.join(dir,'manifest.json'),JSON.stringify(manifest,null,2)+'\n',{flag:'wx'});
fs.writeFileSync(path.join(here,'inputs/begin.json'),JSON.stringify({expected_revision:18,owner:'native-c-g-authorized-agent',from:2,through:6},null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify(manifest));
