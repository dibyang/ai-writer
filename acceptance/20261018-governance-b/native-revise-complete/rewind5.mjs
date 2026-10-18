import path from 'node:path';
import {phase,branch,state,run,put} from './session.mjs';
run('fix-knowledge-rewind5',['rewind','--from','5','--expected-revision',String(state(branch).revision)],branch);
run('fix-knowledge-context5',['context','--unit','5','--purpose','revision'],branch);
run('fix-knowledge-template5',['record-template','--unit','5','--draft','正文/0005-旧印归柜.md'],branch);
