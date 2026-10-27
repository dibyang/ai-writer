import {spawnSync} from 'node:child_process';
import {fs,path,base,project,assert,sha} from './c-utils.mjs';
const action=process.argv[2];assert(['prepare','commit'].includes(action));
const info=JSON.parse(fs.readFileSync(path.join(base,'ddr-revision-private.json')));
const input=path.join(project,'.writer/drafts/ad-dr-revision-finish-private.json');
if(action==='prepare')fs.writeFileSync(input,JSON.stringify({id:info.id,token:info.token},null,2)+'\n',{flag:'wx'});
const r=spawnSync(process.execPath,[path.join(base,'cli.mjs'),'ddr-revision-'+action,'revision',action,'--input',input,'--project',project],{encoding:'utf8',maxBuffer:16*1024*1024});
if(r.status===0&&action==='commit'){
 const units=JSON.parse(fs.readFileSync(path.join(project,'.writer/state.json'))).units;
 const checks=units.filter(u=>u.unit>=55&&u.unit<=60).map(u=>({unit:u.unit,draft:u.draft,sha256:sha(fs.readFileSync(path.join(project,u.draft))),branch_sha256:sha(fs.readFileSync(path.join(info.workspace,u.draft)))}));
 for(const c of checks)assert.equal(c.sha256,c.branch_sha256);
 fs.writeFileSync(path.join(base,'ddr-revision-commit-proof.json'),JSON.stringify({same_native_id:'01a1719b-d587-7672-bb36-49be0acfa08d',id:info.id,checks,result:JSON.parse(r.stdout)},null,2)+'\n',{flag:'wx'});
}
let out=r.stdout;try{const o=JSON.parse(out);delete o.token;if(o.session)delete o.session.token;out=JSON.stringify(o,null,2);}catch{}
process.stdout.write(out);if(r.stderr)process.stderr.write(r.stderr);process.exit(r.status??1);
