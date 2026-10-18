import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {session,sha} from '../session-support.mjs';
const s=session('revise-a'),r=JSON.parse(fs.readFileSync(path.join(s.stage,'revision-local.json'))),b=session('revise-a-branch',{project:r.workspace,token:r.token});
const initial=JSON.parse(fs.readFileSync(path.join(s.stage,'root-initial-state.bin'))),base=JSON.parse(fs.readFileSync(path.join(s.stage,'root-base-state.bin'))),root=s.state(),branch=b.state(),body=JSON.parse(fs.readFileSync(path.join(s.stage,'root-body-baseline.json')));
assert.equal(root.revision,403);assert.equal(root.units.length,106);assert.equal(branch.units.at(-1).unit,62);assert.equal(branch.revision,420);
assert.equal(sha(fs.readFileSync(path.join(s.project,'.writer/state.json'))),sha(fs.readFileSync(path.join(s.stage,'root-base-state.bin'))));
assert.deepEqual(initial.units,base.units);assert.deepEqual(initial.snapshot,base.snapshot);
for(const u of body)assert.equal(sha(fs.readFileSync(path.join(s.project,u.draft))),u.sha256);
assert.deepEqual(branch.units.filter(u=>u.unit<48),base.units.filter(u=>u.unit<48));
assert.deepEqual(branch.governance,base.governance);assert.deepEqual(branch.governance_binding,base.governance_binding);assert.deepEqual(branch.decisions,base.decisions);
const diffs=JSON.parse(fs.readFileSync(path.join(s.stage,'body-diffs.json'))),bodyChanges=[];
for(const u of body){const actual=sha(fs.readFileSync(path.join(b.project,u.draft)));if(actual!==u.sha256)bodyChanges.push({unit:u.unit,draft:u.draft,sha256:actual});}
assert.deepEqual(bodyChanges.map(x=>x.unit),[48,54,66,71]);
for(const d of diffs)assert.equal(sha(fs.readFileSync(path.join(b.project,d.draft))),d.after_sha256);
const expected=structuredClone(base.snapshot);
for(const u of [...base.units].reverse().filter(u=>u.unit>62)){
 const j=JSON.parse(fs.readFileSync(path.join(s.project,u.journal)));assert.equal(sha(fs.readFileSync(path.join(s.project,u.journal))),u.journal_sha256);
 for(const p of [...j.patch].reverse()){let dest=expected;for(const k of p.at.slice(0,-1))dest=dest[k];const key=p.at.at(-1);if(Object.hasOwn(p,'append')){assert.deepEqual(dest[key].slice(p.length),p.append);dest[key]=dest[key].slice(0,p.length);}else if(p.had)dest[key]=structuredClone(p.before);else delete dest[key];}
}
function differences(a,z,p=''){
 if(JSON.stringify(a)===JSON.stringify(z))return [];
 if(a&&z&&typeof a==='object'&&typeof z==='object'&&Array.isArray(a)===Array.isArray(z))return [...new Set([...Object.keys(a),...Object.keys(z)])].flatMap(k=>differences(a[k],z[k],p+'/'+k));
 return [{path:p,before:a,after:z}];
}
const snapshotDiff=differences(expected,branch.snapshot);s.write('snapshot-at62-diff-v2.json',snapshotDiff);
const observationIds=Object.entries(branch.snapshot.ledger).filter(([,x])=>x.type==='observation').map(([id])=>id);
for(const id of observationIds){assert.equal(branch.snapshot.ledger[id].statement,expected.ledger[id].statement);assert.equal(branch.snapshot.ledger[id].author_truth,expected.ledger[id].author_truth);}
const future=[];for(const u of base.units.filter(x=>x.unit>62)){const j=JSON.parse(fs.readFileSync(path.join(s.project,u.journal)));for(const p of j.patch)if(p.at[0]==='characters'&&p.at[1]==='顾遥'&&typeof p.after==='string'&&p.after.includes('亲见长线轻动盘掉'))future.push({unit:u.unit,journal:u.journal,path:p.at,note:'原journal将重新携入58亲见误词；未来实读时检查并保留本轮澄清。这里只机械定位，未声明该章已读。'});}
s.write('future-gu-history-watch-v2.json',future);
const commands=fs.readdirSync(path.join(s.stage,'../commands')).filter(n=>n.startsWith('f-revise-a-')).sort().map(label=>{const dir=path.join(s.stage,'../commands',label),m=JSON.parse(fs.readFileSync(path.join(dir,'result.json')));return {label,...m};});
assert.ok(commands.every(m=>m.exit_code===0));assert.ok(commands.every(m=>m.runtime_files_stable));
assert.ok(commands.filter(m=>m.args[m.args.indexOf('--project')+1]===s.project).every(m=>m.args[0]===path.join(s.project,'.writer/tool/bin/ai-writer.mjs')));
assert.ok(commands.filter(m=>m.args[m.args.indexOf('--project')+1]===b.project).every(m=>m.args[0]===path.resolve(s.stage,'../../..','bin/ai-writer.mjs')&&m.args.includes(r.token)));
s.write('command-index-v2.json',commands);
s.write('branch-final-state-v2.bin',fs.readFileSync(path.join(b.project,'.writer/state.json')));
const preservation={root_revision_initial:initial.revision,root_revision_authorization_and_base:base.revision,root_revision_final:root.revision,branch_revision:branch.revision,root_state_sha256:sha(fs.readFileSync(path.join(s.project,'.writer/state.json'))),branch_state_sha256:sha(fs.readFileSync(path.join(b.project,'.writer/state.json'))),root_state_byte_equal_after_begin:true,root_units_and_snapshot_equal_before_workflow:true,root_all_106_body_hashes_equal:true,branch_prefix_units_1_47_deep_equal:true,prefix43_47_raw_and_registration_unchanged:true,branch_governance_binding_and_decisions_unchanged:true,branch_tail:62,branch_body_changes:bodyChanges,observation_statement_author_truth_all_equal_to_original_at62:true,observations_checked:observationIds.length,snapshot_diff_paths:snapshotDiff.map(x=>x.path),future_gu_history_watch:future.map(x=>x.unit),product_commands:commands.length,product_failures:0,all_runtime_stable:true,root_all_embedded:true,branch_all_main_actual_token:true};
s.write('preservation-v2.json',preservation);console.log(preservation);
const appendInventory=[];for(const u of base.units.filter(x=>x.unit>=48&&x.unit<=62)){const j=JSON.parse(fs.readFileSync(path.join(s.project,u.journal)));for(const p of j.patch)if(Object.hasOwn(p,'append')&&!p.at.includes('evidence')&&p.at[0]!=='timeline')appendInventory.push({unit:u.unit,path:p.at,append:p.append,length:p.length});}
s.write('original-extra-appends.json',appendInventory);console.log({extra_appends:appendInventory});
