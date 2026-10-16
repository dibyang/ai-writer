import {createRunner} from '../command-runner.mjs';
const runner=createRunner('acceptance/20261016-hundred/session-03');
const [label,command,...args]=process.argv.slice(2);
const r=runner.run(process.execPath,['bin/ai-writer.mjs',command,'--project','acceptance/20261016-hundred/works/潮汐信号',...args],label);
process.stdout.write(r.stdout);process.stderr.write(r.stderr);process.exitCode=r.exit_code??1;
