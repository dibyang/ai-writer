import {spawnSync} from 'node:child_process';
import {fs,path,base,project,state,save,outer,sha,assert} from './c-utils.mjs';
const s=state();assert.equal(s.revision,292);save('.writer/drafts/ad-dr-revision-begin58-60.json',{expected_revision:292,owner:'Codex AD D same-ID '+process.env.CODEX_THREAD_ID,from:58,through:60});
save('.writer/drafts/ad-dr-main-before-revision-state.json',s);
const r=spawnSync(process.execPath,[path.join(base,'cli.mjs'),'ddr-revision-begin','revision','begin','--input',path.join(project,'.writer/drafts/ad-dr-revision-begin58-60.json'),'--project',project],{encoding:'utf8'});
if(r.status!==0){console.log(r.stdout);console.error(r.stderr);process.exit(r.status??1);}
const v=JSON.parse(r.stdout);outer('ddr-revision-private.json',v);const out={...v};delete out.token;console.log(JSON.stringify(out,null,2));
outer('ddr-revision-main-baseline.json',{revision:292,state_sha256:sha(fs.readFileSync(path.join(project,'.writer/state.json'))),units:s.units.filter(e=>e.unit>=55).map(e=>({unit:e.unit,draft:e.draft,sha256:e.sha256})),same_native_thread:process.env.CODEX_THREAD_ID,token_location:'本地ddr-revision-private.json与cli-logs/ddr-revision-begin/stdout.txt，不在公开交接复制令牌'});
