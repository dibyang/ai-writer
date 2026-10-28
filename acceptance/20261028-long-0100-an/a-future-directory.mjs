import fs from 'node:fs';
const root=new URL('./work/',import.meta.url);
const state=JSON.parse(fs.readFileSync(new URL('.writer/state.json',root)));
const save=(p,v)=>fs.writeFileSync(new URL(p,root),JSON.stringify(v,null,2)+'\n',{flag:'wx'});
if(process.argv[2]==='plan')save('研究/AN-a-future-directory-plan.json',{mapping:[],directories:[...state.draft_relocations.directories,{volume_id:'V19',directory:'正文/V19-交到别人手里的东西',from:119,to:122}]});
if(process.argv[2]==='request'){
 const p=JSON.parse(fs.readFileSync(new URL('./commands/a-010-future-directory-plan/stdout.raw.txt',import.meta.url)));
 if(!p.ok)throw Error('plan failed');
 const auth=JSON.parse(fs.readFileSync(new URL('研究/AN-a-workflow-draft.json',root))).author_evidence;
 save('研究/AN-a-future-directory-request.json',{...p.request,author_evidence:auth});
}
