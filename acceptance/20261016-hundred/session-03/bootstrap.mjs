import {createRunner} from '../command-runner.mjs';
import fs from 'node:fs';
const r=createRunner('acceptance/20261016-hundred/session-03');
fs.writeFileSync('acceptance/20261016-hundred/session-03/start.json',JSON.stringify({started_at:new Date().toISOString(),boundary:'Outer launcher tool provides merged execution response; nested command stdout/stderr are captured as raw buffers by shared runner.'},null,2));
for(const [label,cmd,args] of [['status-initial','status',[]],['check-initial','check',[]],['outline-37','outline',['--unit','37']],['help','--help',[]]]){
const x=r.run(process.execPath,['bin/ai-writer.mjs',cmd,'--project','acceptance/20261016-hundred/works/潮汐信号',...args],label);console.log(label,x.exit_code,x.stdout,x.stderr);
}
