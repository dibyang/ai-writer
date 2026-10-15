import { readFileSync, writeFileSync, appendFileSync, readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
const session = 'acceptance/20261016-long/session-a';
const project = 'acceptance/20261016-long/works/雨线档案';
const started_at = new Date().toISOString();
const log = entry => appendFileSync(`${session}/commands.jsonl`, JSON.stringify(entry) + '\n', 'utf8');
const hash = file => createHash('sha256').update(readFileSync(file)).digest('hex');
const readJSON = file => JSON.parse(readFileSync(file, 'utf8'));
let exit_code = 0, stdout = '', stderr = '';
try {
  const git = {};
  for (const argv of [['rev-parse','HEAD'],['status','--short'],['diff','--name-only'],['diff','--cached','--name-only']]) {
    const begin = new Date().toISOString();
    const r = spawnSync('git', argv, {cwd:process.cwd(), encoding:'utf8'});
    log({started_at:begin, ended_at:new Date().toISOString(), cwd:process.cwd(), executable:'git', argv, exit_code:r.status, stdout:r.stdout??'', stderr:r.stderr??''});
    if (r.status !== 0) throw new Error(`git ${argv.join(' ')} failed`);
    git[argv.join(' ')] = r.stdout.trim();
  }
  const manifest = readJSON(`${session}/export/manifest.json`);
  const state = readJSON(`${project}/.writer/state.json`);
  const chapters = manifest.units.map(u => {
    const actual_sha256 = hash(`${project}/${u.draft}`);
    const text = readFileSync(`${project}/${u.draft}`, 'utf8');
    const han_body = [...text.replace(/^# .*\r?\n/,'').matchAll(/\p{Script=Han}/gu)].length;
    return {unit:u.unit,draft:u.draft,han_body,sha256:actual_sha256,matches_manifest:actual_sha256===u.sha256};
  });
  const manuscript = readFileSync(`${session}/export/manuscript.md`, 'utf8');
  const context1 = readJSON(`${session}/context-01.json`);
  const sourceRows = Object.keys(context1.source_hashes).filter(p => p!=='大纲/单元/0001.json' && p!=='.writer/state.json');
  const global_number_hits = sourceRows.filter(p => /七号柜/.test(readFileSync(`${project}/${p}`,'utf8')));
  const audit = {
    generated_at:new Date().toISOString(), nature:'mechanical-evidence-not-literary-acceptance', git,
    schema_version:state.schema_version, revision:state.revision, chapters,
    included_units:manifest.included_units, excluded_drafts:manifest.excluded_drafts, warnings:manifest.warnings,
    exported_chapter_titles:manuscript.split(/\r?\n/).filter(x=>/^# 第/.test(x)),
    export_sha256:hash(`${session}/export/manuscript.md`), export_hash_matches:hash(`${session}/export/manuscript.md`)===manifest.sha256,
    global_number_hits, context1_has_number:/七号柜/.test(JSON.stringify(context1)),
    ledger_ids:Object.keys(state.snapshot.ledger), custody:{P_KEY:state.snapshot.ledger.P_KEY.custody,P_ENVELOPE:state.snapshot.ledger.P_ENVELOPE.custody},
    thread_status:{T_COPY:{status:state.snapshot.ledger.T_COPY.status,due_unit:state.snapshot.ledger.T_COPY.due_unit},T_MISSED:{status:state.snapshot.ledger.T_MISSED.status,author_truth:state.snapshot.ledger.T_MISSED.author_truth??null}},
    rolling_review:readJSON(`${session}/check.json`).rolling_review,
    logged_ai_writer_count:readFileSync(`${session}/commands.jsonl`,'utf8').trim().split('\n').map(JSON.parse).filter(x=>x.argv?.[0]==='bin/ai-writer.mjs').length,
    node_version:process.version
  };
  if (JSON.stringify(manifest.included_units)!=='[1,2,3,4]' || chapters.some(x=>!x.matches_manifest||x.han_body<450||x.han_body>700) || !audit.export_hash_matches || global_number_hits.length || audit.context1_has_number) throw new Error('Delivery audit found a mismatch');
  writeFileSync(`${session}/audit.json`,JSON.stringify(audit,null,2)+'\n','utf8');
  writeFileSync(`${session}/continuity-final.json`,JSON.stringify({nature:'read-only-copy-of-cli-state',revision:state.revision,snapshot:state.snapshot},null,2)+'\n','utf8');
  const files = [];
  function collect(base) { for(const item of readdirSync(base,{withFileTypes:true})) {const p=`${base}/${item.name}`; if(item.isDirectory()) collect(p); else files.push(p);} }
  for (const dir of ['设定','大纲','正文','审查']) collect(`${project}/${dir}`);
  for (const dir of ['journal','reviews']) collect(`${project}/.writer/${dir}`);
  files.push(`${project}/writer.json`,`${project}/.writer/state.json`,`${session}/export/manifest.json`,`${session}/export/manuscript.md`,`${session}/result.md`,`${session}/audit.json`,`${session}/continuity-final.json`);
  writeFileSync(`${session}/version-hashes.json`, JSON.stringify({algorithm:'SHA-256',generated_at:new Date().toISOString(),git_head:git['rev-parse HEAD'],files:Object.fromEntries(files.sort().map(p=>[p,hash(p)]))},null,2)+'\n','utf8');
  stdout=JSON.stringify({chapters, total_han:chapters.reduce((n,x)=>n+x.han_body,0), included_units:audit.included_units, export_hash_matches:audit.export_hash_matches, context1_has_number:audit.context1_has_number, global_number_hits, ledger_ids:audit.ledger_ids, logged_ai_writer_count:audit.logged_ai_writer_count,git},null,2)+'\n';
} catch(error) { exit_code=1; stderr=String(error.stack)+'\n'; }
log({started_at,ended_at:new Date().toISOString(),cwd:process.cwd(),executable:process.execPath,argv:process.argv.slice(1),exit_code,stdout,stderr});
process.stdout.write(stdout);process.stderr.write(stderr);process.exitCode=exit_code;
