// Task-scoped GitHub transport. Credentials stay in memory and are never recorded.
import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const base=path.dirname(fileURLToPath(import.meta.url));
const [label,method='GET',endpoint='',input]=process.argv.slice(2);
if(!/^[a-z0-9-]+$/.test(label??''))throw Error('label required');
const dest=path.join(base,`${label}.json`);if(fs.existsSync(dest))throw Error('evidence exists');
const prefix='/repos/dibyang/ai-writer/';
let url=endpoint.startsWith('https:')?new URL(endpoint):new URL(endpoint,'https://api.github.com');
if(!['api.github.com','uploads.github.com'].includes(url.hostname)||!(url.pathname===prefix.slice(0,-1)||url.pathname.startsWith(prefix)))throw Error('repository endpoint required');
const credential=spawnSync('git',['credential','fill'],{input:'protocol=https\nhost=github.com\n\n',encoding:'utf8',windowsHide:true});
if(credential.status!==0)throw Error('Git credential unavailable');
const token=credential.stdout.split(/\r?\n/).find(x=>x.startsWith('password='))?.slice(9);if(!token)throw Error('Git credential unavailable');
let body;const headers={Authorization:`Bearer ${token}`,Accept:'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28'};
if(input){body=fs.readFileSync(input);headers['Content-Type']=url.hostname==='uploads.github.com'?'application/octet-stream':'application/json';}
const response=await fetch(url,{method,headers,body,signal:AbortSignal.timeout(55000)});
const data=await response.json();
fs.writeFileSync(dest,JSON.stringify({at:new Date().toISOString(),method,url:url.href,status:response.status,data},null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({status:response.status,file:dest,id:data.id,state:data.state,draft:data.draft,url:data.html_url,total_count:data.total_count,runs:data.workflow_runs?.map(x=>({id:x.id,sha:x.head_sha,status:x.status,conclusion:x.conclusion,url:x.html_url})),jobs:data.jobs?.map(x=>({id:x.id,name:x.name,status:x.status,conclusion:x.conclusion,steps:x.steps}))}));
if(!response.ok)process.exitCode=1;
