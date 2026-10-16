import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {isDeepStrictEqual as same} from 'node:util';
import {replaySnapshots} from '../rebuild-utils.mjs';
const stage=path.dirname(new URL(import.meta.url).pathname.replace(/^\/(\w:)/,'$1'));
const work=path.resolve(stage,'../works/潮汐信号');
const sha=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
export default function audit(){
 const state=JSON.parse(fs.readFileSync(path.join(work,'.writer/state.json'),'utf8'));
 const snaps=replaySnapshots(work,state);fs.mkdirSync(path.join(stage,'replay-before'),{recursive:true});
 const lines=[],manifest=[];
 function delta(a,b,p,out){
  if(same(a,b))return;
  if(typeof a==='string'&&typeof b==='string'){
   let l=0,r=0;while(l<Math.min(a.length,b.length)&&a[l]===b[l])l++;
   while(r<Math.min(a.length,b.length)-l&&a[a.length-1-r]===b[b.length-1-r])r++;
   out.push({path:p,prefix_chars:l,suffix_chars:r,before:a.slice(l,a.length-r),after:b.slice(l,b.length-r)});return;
  }
  if(a&&b&&typeof a==='object'&&typeof b==='object'){
   for(const k of new Set([...Object.keys(a),...Object.keys(b)]))delta(a[k],b[k],`${p}.${k}`,out);return;
  }
  out.push({path:p,before:a,after:b});
 }
 for(let n=0;n<snaps.length;n++)fs.writeFileSync(path.join(stage,'replay-before',`${String(n).padStart(4,'0')}.json`),JSON.stringify(snaps[n],null,2)+'\n',{flag:'wx'});
 for(const u of state.units){
  const changes=[];delta(snaps[u.unit-1],snaps[u.unit],'snapshot',changes);
  const semantic=changes.filter(d=>!d.path.includes('.evidence.')&&!/\.(introduced_unit|updated_unit)$/.test(d.path));
  // New ledger entries include their whole value; evidence is already read in the complete current ledger.
  for(const d of semantic)if(d.after&&typeof d.after==='object'&&!Array.isArray(d.after)){d.after=structuredClone(d.after);delete d.after.evidence;}
  lines.push(JSON.stringify({unit:u.unit,draft:u.draft,sha256:u.sha256,journal:u.journal,journal_sha256:sha(path.join(work,u.journal)),semantic_changes:semantic}));
  manifest.push({unit:u.unit,draft:u.draft,sha256:u.sha256,journal:u.journal,journal_sha256:sha(path.join(work,u.journal)),source_hashes:u.source_hashes});
 }
 fs.writeFileSync(path.join(stage,'replay-transitions.jsonl'),lines.join('\n')+'\n',{flag:'wx'});
 fs.writeFileSync(path.join(stage,'replay-source-manifest.json'),JSON.stringify({state_sha256:sha(path.join(work,'.writer/state.json')),revision:state.revision,units:manifest},null,2)+'\n',{flag:'wx'});
 console.log(JSON.stringify({replayed_units:state.units.length,ending_matches_authority:true,transitions_chars:lines.join('\n').length,manifest:'replay-source-manifest.json'}));
}
