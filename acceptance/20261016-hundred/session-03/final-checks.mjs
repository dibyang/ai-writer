import fs from 'node:fs';
import {createRunner} from '../command-runner.mjs';
const stage='acceptance/20261016-hundred/session-03',project='acceptance/20261016-hundred/works/潮汐信号';const r=createRunner(stage);
function cli(label,cmd,args=[]){const x=r.run(process.execPath,['bin/ai-writer.mjs',cmd,'--project',project,...args],label);console.log(label,x.exit_code,x.stdout,x.stderr);if(x.exit_code!==0)throw Error(label+' failed');return JSON.parse(x.stdout);}
const pre=cli('check-preexport','check');if(pre.rolling_review.pending_windows.length||pre.findings.length)throw Error('Export blocked by check findings');
if(fs.existsSync(stage+'/export'))throw Error('Never overwrite existing export');
cli('export-final','export',['--out',stage+'/export']);
cli('status-final','status');
const g=r.run('git',['status','--short'],'git-status-final');console.log('git-status-final',g.exit_code,g.stdout,g.stderr);
cli('check-final','check');
cli('doctor-final','doctor');
const d=r.run('git',['diff','--name-only','--','lib','bin','tests','package.json','package-lock.json','.agents'],'product-diff-final');console.log('product-diff-final',d.exit_code,d.stdout,d.stderr);
console.log('Exact status-final label selection',r.last('status-final').label,r.json('status-final').revision);
