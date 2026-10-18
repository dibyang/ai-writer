import path from 'node:path';
import { stage, state, put, cli, input } from './helpers.mjs';
const s=state();
const result=cli('native-two-10-revision-begin',['revision','begin','--input',input('revision-begin',{expected_revision:s.revision,owner:'native-two independent Codex; synthetic-acceptance',from:5,through:6})]);
put(path.join(stage,'session-access.json'),result);
cli('native-two-11-rewind-5',['rewind','--from','5','--expected-revision',String(s.revision),'--revision-token',result.token],result.workspace);
