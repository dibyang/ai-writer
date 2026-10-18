import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
const here=path.dirname(fileURLToPath(import.meta.url)),root=path.dirname(here);
const h=JSON.parse(fs.readFileSync(path.join(root,'native-c/handoff.json')));
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const write=(f,x)=>fs.writeFileSync(path.join(here,f),JSON.stringify(x,null,2)+'\n',{flag:'wx'});
const read=f=>JSON.parse(fs.readFileSync(f));
const [mode,name]=process.argv.slice(2);
if(mode==='snapshot'){
  const m=read(path.join(h.project_path,'.writer/state.json')),b=read(path.join(h.workspace,'.writer/state.json'));
  const texts=fs.readdirSync(path.join(h.project_path,'正文')).filter(x=>x.endsWith('.md')).sort().map(f=>({draft:'正文/'+f,main_sha256:sha(fs.readFileSync(path.join(h.project_path,'正文',f))),branch_sha256:sha(fs.readFileSync(path.join(h.workspace,'正文',f)))}));
  const retained=[];
  for(const dir of ['.agents','docs','设定','人物','大纲']){
    function walk(d){if(!fs.existsSync(d))return;for(const e of fs.readdirSync(d,{withFileTypes:true})){const f=path.join(d,e.name);if(e.isDirectory())walk(f);else retained.push({path:path.relative(h.project_path,f).replaceAll('\\','/'),sha256:sha(fs.readFileSync(f))});}}
    walk(path.join(h.project_path,dir));
  }
  for(const f of ['AGENTS.md','writer.json'])if(fs.existsSync(path.join(h.project_path,f)))retained.push({path:f,sha256:sha(fs.readFileSync(path.join(h.project_path,f)))});
  const base=path.join(h.project_path,'.writer/revisions',h.revision_id,'base.json');
  const result={at:new Date().toISOString(),main_revision:m.revision,branch_revision:b.revision,main_state_sha256:sha(fs.readFileSync(path.join(h.project_path,'.writer/state.json'))),branch_state_sha256:sha(fs.readFileSync(path.join(h.workspace,'.writer/state.json'))),base_manifest_sha256:sha(fs.readFileSync(base)),main_units:m.units,main_snapshot:m.snapshot,branch_units:b.units,branch_snapshot:b.snapshot,texts,retained};
  write(name+'.json',result);
  fs.copyFileSync(path.join(h.project_path,'.writer/state.json'),path.join(here,name+'-main-state.json'),fs.constants.COPYFILE_EXCL);
  fs.copyFileSync(path.join(h.workspace,'.writer/state.json'),path.join(here,name+'-branch-state.json'),fs.constants.COPYFILE_EXCL);
  console.log(JSON.stringify({name,main_revision:m.revision,branch_revision:b.revision,main_state_sha256:result.main_state_sha256,base_manifest_sha256:result.base_manifest_sha256,texts,retained_count:retained.length},null,2));
}else if(mode==='builds'){
  const names=['source-build.json','source-build-final.json','source-build-g3.json','source-build-g4.json'];
  const list=names.map(f=>({file:f,...read(path.join(root,f))}));
  const result=list.map((b,i)=>({file:b.file,version:b.tool_version,observed_content_id:b.observed_content_id,runtime_id:b.runtime_id,scope:b.scope,previous_content_id:b.previous_content_id,changed_from_previous:i?b.files.filter(f=>{const old=list[i-1].files.find(x=>x.file===f.file&&x.group===f.group);return !old||old.sha256!==f.sha256}).map(f=>({group:f.group,file:f.file,sha256:f.sha256})):[],files:b.files.length,missing:b.missing,mismatches:b.mismatches}));
  write('build-stage-comparison.json',result);console.log(JSON.stringify(result,null,2));
}else throw Error('snapshot name | builds');
