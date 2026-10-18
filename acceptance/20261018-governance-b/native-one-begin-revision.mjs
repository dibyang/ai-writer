import {base,project,read,put,input,rev,cli,evidence,hash} from './native-one-helper.mjs';
import {drafts} from './native-one-drafting.mjs';
cli('review-1-6-initial',['review','--input',input('review-1-6-initial',{from:1,to:6,kind:'model-self-review',report:'审查/连读1-6-初稿.md',source_hashes:Object.fromEntries(drafts.slice(1).map(r=>[r,hash(project+'/'+r)]))})]);
const previous=read(base+'/native-one-inputs/workflow-trial-ready.json').workflow;
cli('workflow-revision',['workflow','set','--input',input('workflow-revision',{expected_revision:rev(),operation_id:'native-one-six-revision',author_evidence:evidence('允许修正本六章内发现的语言和连续性问题，并核对最早影响章至第六章的全部后续追踪；在独立修订区完成后提交，不直接改主稿。'),workflow:{...previous,stage:'revision',task:'独立修订第1至6章已发现的语言与物证动作问题，核全部后续追踪；不写新章',authorization:{allowed_actions:['discuss','plan','revise'],draft_range:null,revise_range:{from:1,to:6},stop_conditions:['只修本六章，完成尾段实读重登后prepare/commit','不写第七章']}}})]);
cli('revision-help',['revision','--help']);
const result=cli('revision-begin',['revision','begin','--input',input('revision-begin',{expected_revision:rev(),owner:'native-one-independent-cli',from:1,through:6})]);
put(base+'/native-one-revision-session.json',result);
