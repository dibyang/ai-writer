import fs from 'node:fs';
import path from 'node:path';
import {session} from '../session-support.mjs';
const s=session('draft-f');
const input=JSON.parse(fs.readFileSync(path.join(s.stage,'inputs/f-draft-f-0012-review-97-103.json')));
const c=input.comparison.similar_structures[0];
input.comparison.similar_structures=[{units:c.units,judgment:c.observation,differences:c.difference,preserve:c.preserve,optional_adjustments:[],uncertainty:'知情自检，不等于真人阅读反馈',evidence:c.evidence}];
console.log(JSON.stringify(s.run('review-97-103-corrected',['review'],{input,entry:'embedded'}).value));
