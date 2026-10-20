import path from 'node:path';import {U,W,json,run} from './final-b-run.mjs';
const s=json(path.join(U,'final-b-revision-session.json'));
run('27-record-replay-first',['record','--input','.writer/drafts/final-b-replay-2-valid.json','--revision-token',s.token],s.workspace);
run('28-branch-status-first-stop',['status'],s.workspace);
run('29-main-status-first-stop',['status']);
run('30-main-list-first-stop',['revision','list']);
