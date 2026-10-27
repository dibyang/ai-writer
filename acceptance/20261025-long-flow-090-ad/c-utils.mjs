import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
export const base=path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/,'$1'));
export const project=JSON.parse(fs.readFileSync(path.join(base,'project.json'))).project;
export const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
export const read=r=>fs.readFileSync(path.join(project,r),'utf8');
export const json=r=>JSON.parse(read(r));
export const state=()=>json('.writer/state.json');
export function save(r,v){const f=path.join(project,r);fs.mkdirSync(path.dirname(f),{recursive:true});fs.writeFileSync(f,typeof v==='string'?v:JSON.stringify(v,null,2)+'\n',{flag:'wx'});return f;}
export function outer(r,v){fs.writeFileSync(path.join(base,r),JSON.stringify(v,null,2)+'\n',{flag:'wx'});}
export const log=l=>JSON.parse(fs.readFileSync(path.join(base,'cli-logs',l,'stdout.txt'),'utf8'));
export {fs,path,assert};
