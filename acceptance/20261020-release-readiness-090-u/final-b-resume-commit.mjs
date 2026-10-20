import path from 'node:path';import {U,W,write,json,hash,run} from './final-b-run.mjs';
const s=json(path.join(U,'final-b-revision-session.json'));const audit=json(path.join(U,'final-b-resume-prepare-audit.json'));const prepared=path.join(W,'.writer/revisions',s.id,'prepared.json');if(audit.failures.length||hash(prepared)!==audit.prepared_sha256)throw Error('Prepared bytes changed; stop');
const input=path.join(U,'final-b-resume-commit-input.json');write(input,{id:s.id,token:s.token});const result=JSON.parse(run('43-main-revision-commit',['revision','commit','--input',input]));write(path.join(U,'final-b-resume-commit-result.json'),result);
run('44-main-check-committed',['check']);run('45-main-status-committed',['status']);run('46-main-revision-list-committed',['revision','list']);
