import fs from 'node:fs';
import {project,stage,runner,hash} from './run-cli.mjs';
const g=runner.run('git',['status','--short','--untracked-files=no','--','bin','lib','tests','.agents','docs'],'git-status-final');console.log('git-status-final',g.exit_code,g.stdout);
for(const [cmd,label,args]of [['status','status-final',[]],['check','check-final',[]],['doctor','doctor-final',[]],['export','export-final',['--out',stage+'/export']]]){
 const r=runner.run(process.execPath,['bin/ai-writer.mjs',cmd,'--project',project,...args],label);console.log(label,r.stdout,r.stderr);if(r.exit_code!==0){process.exitCode=r.exit_code;break;}
}
const s=runner.json('status-final');console.log('EXACT STATUS LABEL',runner.last('status-final').label,'REV',s.revision,'NEXT',s.next_unit);
