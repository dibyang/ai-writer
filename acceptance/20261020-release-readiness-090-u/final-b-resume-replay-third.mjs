import path from 'node:path';import {U,json,run} from './final-b-run.mjs';
const s=json(path.join(U,'final-b-revision-session.json'));const log=console.log;console.log=()=>{};let raw;try{raw=JSON.parse(run('36-replay-third-restored',['revision','replay-input','--unit','3','--revision-token',s.token,'--out','.writer/drafts/final-b-resume-replay-3-before.json'],s.workspace));}finally{console.log=log;}
console.log(JSON.stringify({unit:raw.unit,expected_revision:raw.expected_revision,draft:raw.draft,replay:raw._replay,ledger_changes:Object.keys(raw.changes.ledger)},null,2));
