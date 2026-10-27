import path from 'node:path';import {base,j,cli,state} from './ef-lib.mjs';
const old=j(path.join(base,'inputs/ef-workflow.json'));old.workflow.stage='revision';old.operation_id='AD_E_N_STALE_WORKFLOW';
cli('ef-negative-stale-revision',['workflow','set'],{input:old,expect:2});
cli('ef-workflow-corrected',['workflow','set'],{input:{...old,expected_revision:state().revision,operation_id:'AD_E_WORKFLOW_48_60_CORRECTED'}});
cli('ef-impact-baseline-1-current',['source','impact'],{input:{version_id:'AD_E_S01_OLD',from:1,mode:'baseline'},show:false});
console.log('Correct workflow and fresh baseline impact saved.');
