import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';
import {s,h,save,run} from './run.mjs';import {sha,readJSON,BASE} from '../session-support.mjs';
const root=s.state(),branch=readJSON(path.join(h.workspace,'.writer/state.json'));
const observations=x=>Object.entries(x.snapshot.ledger).filter(([id])=>id.startsWith('O_')).map(([id,v])=>({id,statement:v.statement,author_truth:v.author_truth}));
assert.deepEqual(observations(root),observations(branch));assert.equal(observations(root).length,36);
const bindings=readJSON(path.join(BASE,'revise-d/all-59-replay-bindings.json'));
for(const b of bindings){const u=branch.units.find(x=>x.unit===b.unit);assert.equal(u.sha256,b.sha256);assert.equal(u.journal_sha256,b.journal_sha256);assert.deepEqual(u.replay_review,b.replay_review);assert.equal(sha(fs.readFileSync(path.join(h.workspace,b.replay_review.report))),b.replay_review.report_sha256);assert.equal(sha(fs.readFileSync(path.join(h.workspace,b.replay_review.frozen_ref))),b.replay_review.report_sha256);assert.equal(b.replay_review.checked_fields.length,6);}
save('semantic-final.json',{at:new Date().toISOString(),observations:observations(branch),observation_count:36,all_statement_author_truth_unchanged:true,gu_state:branch.snapshot.characters['顾遥'],replay_count:bindings.length,replay_review_bindings_all_valid:true,note:'v1/v2 observation count 0 and null journal.replay_review were auxiliary audit schema errors; this audit uses ledger keys and unit.replay_review; prior outputs retained'});
console.log(JSON.stringify({ok:true,observations:36,replay:bindings.length}));
