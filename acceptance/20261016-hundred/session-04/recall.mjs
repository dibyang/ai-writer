import {createRunner} from '../command-runner.mjs';
const r=createRunner('acceptance/20261016-hundred/session-04');
for(const id of process.argv.slice(2)){
 const x=r.run(process.execPath,['bin/ai-writer.mjs','recall','--project','acceptance/20261016-hundred/works/潮汐信号','--query',id],`recall-${id}`);
 if(x.exit_code!==0){console.error(x.stderr);process.exitCode=1;break;}
 console.log(x.stdout);
}
