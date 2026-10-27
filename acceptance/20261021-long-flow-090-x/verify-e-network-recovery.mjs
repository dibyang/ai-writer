import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';import assert from 'node:assert/strict';import {fileURLToPath}from'node:url';
const x=path.dirname(fileURLToPath(import.meta.url)),j=f=>JSON.parse(fs.readFileSync(path.join(x,f),'utf8')),sha=v=>crypto.createHash('sha256').update(v).digest('hex');
assert.equal(j('commands/codex-e-network-recovery/result.json').exit_code,0);const stop=j('e-network-stop.json');assert(stop.ok);assert.equal(j('commands/codex-e-resume/result.json').signal,'SIGTERM');
const events=inv=>fs.readFileSync(path.join(x,'commands',inv,'stdout.raw.txt'),'utf8').trim().split(/\r?\n/).map(JSON.parse),id=inv=>events(inv).find(e=>e.type==='thread.started')?.thread_id;
assert.equal(id('codex-e-network-recovery'),id('codex-e-resume'));assert.equal(id('codex-e-resume'),id('codex-e-first'));
for(const [label,ref]of[['erc-entry-status','parent-e-network-stop-main-state.json'],['erc-candidate-entry-status','parent-e-network-stop-candidate-state.json']]){const r=j(`cli-logs/${label}/result.json`),raw=fs.readFileSync(path.join(x,ref));assert.equal(r.exit_code,0);assert.equal(r.before_state_sha256,sha(raw));assert.equal(r.after_state_sha256,sha(raw));}
assert.equal(j('cli-logs/erc-resume/result.json').exit_code,0);const h=j('cli-logs/e-begin/stdout.raw.txt'),before=j('parent-e-network-stop-candidate-state.json'),s=JSON.parse(fs.readFileSync(path.join(h.workspace,'.writer/state.json'),'utf8'));
assert.equal(s.units.length,36);assert.deepEqual(s.units.slice(0,30),before.units);
for(const u of before.units)assert.equal(sha(fs.readFileSync(path.join(h.workspace,u.draft))),u.sha256);
for(const [key,v]of Object.entries(before.source_versions)){assert.deepEqual(s.source_versions[key],v);const f=path.join(h.workspace,v.object_ref);assert.equal(sha(fs.readFileSync(f)),v.sha256);}
const v={ok:true,at:new Date().toISOString(),failed_invocation:'codex-e-resume',failed_exit_code:null,failed_signal:'SIGTERM',recovered_invocation:'codex-e-network-recovery',recovered_exit_code:0,thread_id:id('codex-e-network-recovery'),same_thread:true,original30_complete_units_and_bodies_preserved:true,main_and_candidate_entry_state_bytes_exact:true,official_revision_resume:true,source_versions_preserved:true,interruption:'e-network-stop.json',scope:'actual recovered E process only; full final E checks are separate'};
const sourceFile=path.join(x,'native-session-sources.json'),sources=JSON.parse(fs.readFileSync(sourceFile,'utf8'));sources.find(v=>v.label==='e').recovered_same_thread=true;
fs.writeFileSync(sourceFile,JSON.stringify(sources,null,2)+'\n');
fs.writeFileSync(path.join(x,'e-network-recovery-verification.json'),JSON.stringify(v,null,2)+'\n',{flag:'wx'});console.log(JSON.stringify(v));
