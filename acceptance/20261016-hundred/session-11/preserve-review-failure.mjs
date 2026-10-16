import fs from 'node:fs';import {stage,project,save} from './run-cli.mjs';
fs.copyFileSync(`${stage}/review-87.json`,`${stage}/review-87-failed-input.json`);
fs.copyFileSync(`${project}/审查/82-87-20261016-session11.md`,`${stage}/review-87-failed-report.md`);
save('review-87-failure.json',{kind:'stage-helper-defect-not-product',cause:'Review generation remained inside the for loop after an incorrect brace edit; first iteration supplied only unit82 for claimed82-87, and CLI correctly rejected hashes.',authority_unchanged:true,raw_label:'review-87-cli',preserved_input:'review-87-failed-input.json',preserved_report:'review-87-failed-report.md'});
console.log('Preserved failed input/report; no state or journal writes.');
