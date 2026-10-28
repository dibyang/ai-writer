import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
const base=path.dirname(fileURLToPath(import.meta.url)),work=path.join(base,'work');
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const read=p=>JSON.parse(fs.readFileSync(path.join(base,p),'utf8'));
const put=(p,v)=>fs.writeFileSync(path.join(base,p),typeof v==='string'?v:JSON.stringify(v,null,2)+'\n',{flag:'wx'});
const [action,n,label,draftOverride]=process.argv.slice(2),unit=Number(n);
if(action==='freeze'){
 const b=fs.readFileSync(path.join(base,'commands',label,'stdout.raw.txt'));JSON.parse(b);
 put(`work/研究/AL-c-record${unit}-template.json`,b.toString('utf8'));console.log('frozen template',unit,sha(b));
}else if(action==='assemble-input'){
 const t=read(`work/研究/AL-c-record${unit}-template.json`);
 const parts=['01','02','03'].map(p=>{const ref=`分段/AL-c-${String(unit).padStart(4,'0')}/${p}.md`;return{path:ref,sha256:sha(fs.readFileSync(path.join(work,ref)))}});
 put(`work/研究/AL-c-assemble${unit}${label?'-'+label:''}.json`,{unit,expected_revision:t.expected_revision,draft:t.draft,parts,separator:'\n\n'});console.log('assemble input',unit);
}else if(action==='measure'){
 const t=read(`work/研究/AL-c-record${unit}-template.json`); if(draftOverride)t.draft=draftOverride;
 const bytes=fs.readFileSync(path.join(work,t.draft)),text=bytes.toString('utf8'),body=text.replace(/^#.*\r?\n\s*\n/u,'');
 const parts=['01','02','03'].map(p=>fs.readFileSync(path.join(work,`分段/AL-c-${String(unit).padStart(4,'0')}/${p}.md`),'utf8'));
 const assembled=parts.join('\n\n');
 const row={unit,draft:t.draft,sha256:sha(bytes),han:(body.match(/\p{Script=Han}/gu)||[]).length,codepoints:[...body].length,parts_equal:assembled===text||assembled+'\n'===text,parts_han:parts.map((s,i)=>(s.replace(i===0?/^#.*\r?\n\s*\n/u:/^$/u,'').match(/\p{Script=Han}/gu)||[]).length)};
 put(`session-c-length${unit}${label?'-'+label:''}.json`,row);console.log(JSON.stringify(row));
}else if(action==='context-view'){
 const c=read(`commands/${label}/stdout.raw.txt`);
 const rows=Object.entries(c.continuity.author).map(([id,v])=>({id,...v,reader_known:c.continuity.reader[id],character_known:Object.fromEntries(Object.entries(c.continuity.characters).filter(([k,v])=>v[id]).map(([k,v])=>[k,v[id]]))}));
 put(`session-c-context${unit}-view.json`,{revision:c.revision,snapshot:c.snapshot,author:rows,recall:c.continuity.recall,source_hashes:c.source_hashes});console.log('context view',unit);
}else if(action==='context-diff'){
 const a=read('commands/c-010-context117/stdout.raw.txt'),b=read('commands/c-020-context118/stdout.raw.txt');
 const same=[],changed={};
 for(const [id,v] of Object.entries(b.continuity.author)){
  const row={...v,reader_known:b.continuity.reader[id],character_known:Object.fromEntries(Object.entries(b.continuity.characters).filter(([k,w])=>w[id]).map(([k,w])=>[k,w[id]]))};
  const prior={...a.continuity.author[id],reader_known:a.continuity.reader[id],character_known:Object.fromEntries(Object.entries(a.continuity.characters).filter(([k,w])=>w[id]).map(([k,w])=>[k,w[id]]))};
  if(a.continuity.author[id]&&JSON.stringify(row)===JSON.stringify(prior))same.push(id);else changed[id]=row;
 }
 put('session-c-context118-diff.json',{revision:b.revision,plan:b.plan,settings_unchanged:JSON.stringify(a.settings)===JSON.stringify(b.settings),unchanged_entries:same,changed_entries:changed,recall:b.continuity.recall,source_hashes:b.source_hashes,governance:b.governance});console.log('diff generated',same.length,Object.keys(changed));
}else throw Error('unknown evidence action');
