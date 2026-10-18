import {base,project,put,input,cli} from './native-one-helper.mjs';
import {session} from './native-one-revision-steps.mjs';
cli('revision-commit',['revision','commit','--input',input('revision-commit',{id:session.id,token:session.token})]);
cli('after-revision-check',['check']);
cli('after-revision-status',['status']);
cli('after-revision-list',['revision','list']);
