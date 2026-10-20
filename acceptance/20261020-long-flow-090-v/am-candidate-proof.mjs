import fs from 'node:fs';import crypto from 'node:crypto';import {isDeepStrictEqual as eq} from 'node:util';
const v='D:/work/other/ai-writer/acceptance/20261020-long-flow-090-v',w=v+'/scenario/东岸末班船-扩展验证';
const read=f=>JSON.parse(fs.readFileSync(f,'utf8')),sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const session=read(v+'/cli-logs/am13-begin/stdout.raw.txt'),p=session.workspace,base=read(v+'/cli-logs/am13-begin/before-state.json'),state=read(p+'/.writer/state.json');
const expected=structuredClone(base.snapshot);
expected.timeline=expected.timeline.map(t=>t.replace('停航次晨5:20—6点多','停航首日清晨5:20—6点多').replace('停航次日晚18:30前后','停航首日晚18:30前后'));
const diffs=[];
function diff(a,b,at=''){if(eq(a,b))return;if(a&&b&&typeof a==='object'&&typeof b==='object'){for(const k of new Set([...Object.keys(a),...Object.keys(b)]))diff(a[k],b[k],at+'/'+k);}else diffs.push({path:at,before:a,after:b});}
diff(base.snapshot,state.snapshot,'/snapshot');
const summaries=state.units.map(u=>({unit:u.unit,draft:u.draft,sha256:u.sha256,summary:u.summary}));
const bodies=state.units.map(u=>({unit:u.unit,sha256:u.sha256,actual:sha(fs.readFileSync(p+'/'+u.draft)),old_sha256:base.units.find(b=>b.unit===u.unit).sha256}));
const reports=state.units.filter(u=>u.unit>=4).map(u=>({unit:u.unit,replay_review:u.replay_review,draft_review:u.draft_review}));
const proof={at:new Date().toISOString(),session_id:session.id,owner:session.owner,workspace:p,base_revision:session.base_revision,base_state_sha256:sha(fs.readFileSync(v+'/cli-logs/am13-begin/before-state.json')),main_state_unchanged_since_begin:sha(fs.readFileSync(w+'/.writer/state.json'))===sha(fs.readFileSync(v+'/cli-logs/am13-begin/before-state.json')),candidate_revision:state.revision,candidate_state_sha256:sha(fs.readFileSync(p+'/.writer/state.json')),bodies,snapshot_differences:diffs,expected_snapshot_matches:eq(expected,state.snapshot),characters_identical:eq(base.snapshot.characters,state.snapshot.characters),ledger_identical:eq(base.snapshot.ledger,state.snapshot.ledger),prefix_units_identical:eq(base.units.slice(0,3),state.units.slice(0,3)),observation_three_fields:Object.entries(base.snapshot.ledger).filter(([,x])=>x.type==='observation').map(([id,x])=>({id,unchanged:['type','statement','author_truth'].every(k=>eq(x[k],state.snapshot.ledger[id]?.[k]))})),reports};
proof.ok=proof.main_state_unchanged_since_begin&&state.revision===30&&proof.expected_snapshot_matches&&proof.characters_identical&&proof.ledger_identical&&proof.prefix_units_identical&&bodies.every(b=>b.sha256===b.actual&&b.sha256===b.old_sha256)&&proof.observation_three_fields.every(x=>x.unchanged);
fs.writeFileSync(v+'/am-candidate-proof.json',JSON.stringify(proof,null,2)+'\n',{flag:'wx'});
fs.writeFileSync(v+'/am-candidate-tracking.json',JSON.stringify({revision:state.revision,units:summaries,snapshot:state.snapshot},null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify(proof,null,2));if(!proof.ok)process.exitCode=1;
