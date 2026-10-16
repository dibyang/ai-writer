import fs from 'node:fs';
import path from 'node:path';
import {isDeepStrictEqual as same} from 'node:util';
import {replaySnapshots} from '../rebuild-utils.mjs';
import {stage,work,read,hash,save,runner} from './stage.mjs';
const frozen=path.join(stage,'before/work'),old=read(path.join(frozen,'.writer/state.json')),state=read(path.join(work,'.writer/state.json'));
const previous=read(path.join(stage,'before/snapshots.json')),actual=replaySnapshots(work,state),desired=read(path.join(stage,'desired-snapshots.json'));
const checks=[],check=(ok,name,detail)=>checks.push({ok:Boolean(ok),name,...(detail===undefined?{}:{detail})});
check(same(state.units.slice(0,24),old.units.slice(0,24)),'第一部24章完整units登记逐字段不变');
check(same(actual[24],previous[24])&&same(state.baseline,old.baseline),'第一部完整追踪快照与baseline不变');
check(state.revision===128&&state.units.length===42,'最终r128/42章');
const beforeManifest=read(path.join(stage,'before/manifest.json'));
for(const f of beforeManifest.files)check(hash(path.join(frozen,f.file))===f.sha256,`before冻结未改:${f.file}`);
for(const f of beforeManifest.files.filter(x=>x.file.startsWith('.writer/tool/')||x.file.startsWith('.agents/')))check(hash(path.join(work,f.file))===f.sha256,`内置工具/技能/来源许可制品不变:${f.file}`);
const bodyRows=[],sources=[],evidence=[],transfers=[];
for(const u of state.units){
 const file=path.join(work,u.draft),text=fs.readFileSync(file,'utf8'),han=(text.replace(/^#.*\r?\n/,'').match(/\p{Script=Han}/gu)??[]).length;
 check(hash(file)===u.sha256,`正文哈希:${u.unit}`);check(u.unit<=24?hash(file)===old.units[u.unit-1].sha256:han>=2400&&han<=3200,`正文保留/长度:${u.unit}`,han);
 bodyRows.push({unit:u.unit,draft:u.draft,sha256:u.sha256,before_sha256:old.units[u.unit-1].sha256,han,changed:u.sha256!==old.units[u.unit-1].sha256});
 check(hash(path.join(work,u.journal))===u.journal_sha256,`journal哈希:${u.unit}`);
 for(const [ref,h]of Object.entries(u.source_hashes)){if(ref==='.writer/state.json')continue;check(hash(path.join(work,ref))===h,`消费来源:${u.unit}:${ref}`);sources.push({unit:u.unit,ref,sha256:h});}
 if(u.unit>=25){
  const input=read(path.join(stage,'repair1/inputs',`${u.unit}.json`)),template=JSON.parse(runner.last(`repair1-template-${u.unit}`).stdout),context=JSON.parse(runner.last(`repair1-context-${u.unit}`).stdout);
  check(input.expected_revision===template.expected_revision&&same(input.source_hashes,template.source_hashes)&&same(input.source_hashes,context.source_hashes),`真实写前revision/source未后补:${u.unit}`);
  check(same(actual[u.unit].characters,desired[u.unit].characters)&&same(actual[u.unit].timeline,desired[u.unit].timeline),`逐章热状态/时间线符合本章期望:${u.unit}`);
  for(const [id,d]of Object.entries(input.changes.ledger)){
   check(d.evidence?.some(e=>e.unit===u.unit),`新增变化有真实本章证据:${u.unit}:${id}`);
   const a=actual[u.unit-1].ledger[id]?.custody,b=actual[u.unit].ledger[id]?.custody;
   if(a&&b&&a.holder!==b.holder){check(d.previous_holder===a.holder,`真实旧保管人:${u.unit}:${id}`);transfers.push({unit:u.unit,id,previous_holder:a.holder,custody:b});}
  }
 }
}
const replacements=read(path.join(stage,'evidence-replacements.json'));
let retained=0,replaced=0;
for(const [id,e]of Object.entries(old.snapshot.ledger)){
 const now=state.snapshot.ledger[id];check(Boolean(now),`ID保留:${id}`);check(e.due_unit===now.due_unit,`原due不变:${id}`);check(same(e.author_truth,now.author_truth),`作者真相边界不变:${id}`);
 if(e.type==='observation'&&!['O_HOURS_NOTE','O_ROOM_LATCH'].includes(id))check(e.statement===now.statement,`其他初始观察不变:${id}`);
 for(const anchor of e.evidence??[]){const m=replacements.find(x=>x.id===id&&x.unit===anchor.unit&&x.old===anchor.quote);const quote=m?.new??anchor.quote;const hit=now.evidence?.find(x=>x.unit===anchor.unit&&x.quote===quote);check(Boolean(hit),`旧证据保留或明确映射:${id}:${anchor.unit}:${anchor.line}`);if(m)replaced++;else retained++;}
}
for(const [id,e]of Object.entries(state.snapshot.ledger))for(const a of e.evidence??[]){const u=state.units[a.unit-1],text=fs.readFileSync(path.join(work,u.draft),'utf8').replace(/^\uFEFF/,''),i=text.indexOf(a.quote);check(a.sha256===u.sha256&&a.draft===u.draft&&i>=0&&text.slice(0,i).split(/\r?\n/).length===a.line,`引文新正文绑定:${id}:${a.unit}:${a.line}`);evidence.push({id,...a});}
let preservedKnowledge=0;
for(const [id,e]of Object.entries(previous[24].ledger))for(const[name,t]of Object.entries(e.character_known??{})){check(state.snapshot.ledger[id]?.character_known?.[name]?.includes(t),`第一部有效知识保留:${id}:${name}`);preservedKnowledge++;}
for(const[name,t]of Object.entries(previous[24].characters))check(state.snapshot.characters[name]?.includes(t),`第一部热状态历史保留:${name}`);
for(const n of [37,38,39])for(const id of ['T_LAMP','O_LAMP_PANEL'])check(!Object.hasOwn(actual[n].ledger[id].character_known,'何映'),`何未提前取得稿内灯事实:${n}:${id}`);
check(actual[31].ledger.P_QIU_WORK_PAGES.custody.location.includes('透明盒')&&actual[31].ledger.P_QIU_WORK_PAGES.custody.holder==='邱阿兰','31旧稿平放透明盒邱持');
check(actual[35].ledger.P_QIU_WORK_PAGES.custody.holder==='沈禾'&&actual[35].ledger.P_QIU_WORK_PAGES.previous_holder==='邱阿兰','35旧稿实还沈');
check(state.snapshot.ledger.T_PUBLIC_USE.due_unit===40&&state.snapshot.ledger.T_PUBLIC_USE.status==='resolved','T_PUBLIC_USE按原due40阶段兑现');
check(state.snapshot.ledger.T_PRIVATE.status==='intentional-open'&&!state.snapshot.ledger.T_PRIVATE.author_truth,'私人原因仍未知无作者答案');
const drift=read(path.join(stage,'source-drift.json'));
check(drift.context.exit_code===2&&drift.exported.exit_code===2&&drift.context.stderr.includes('创作来源已变化')&&!drift.context.stderr.includes('没有章纲')&&!drift.export_directory_exists&&!fs.existsSync(path.join(stage,'blocked-export')),'来源变化真实阻断非缺章纲且无目录');
const status=runner.json('final3-status'),checked=runner.json('final3-check'),doctor=runner.json('final3-doctor'),exported=runner.json('final3-export'),manifest=read(path.join(stage,'export/manifest.json'));
check(!status.stale_units.length&&!status.changed_sources.length&&!status.draft_inventory.unregistered.length,'status无漂移无漏登');
check(checked.ok&&!checked.findings.length&&!checked.rolling_review.pending_windows.length&&checked.rolling_review.stale_without_current_coverage===0,'check零问题全部窗口覆盖');
check(doctor.ok&&!doctor.errors.length&&!doctor.warnings.length,'doctor无错误警告');
check(same(manifest.included_units,Array.from({length:42},(_,i)=>i+1))&&manifest.units.length===42&&!manifest.excluded_drafts.length&&!manifest.warnings.length,'导出恰好1—42无遗漏重复排除警告');
const manuscript=state.units.map(u=>fs.readFileSync(path.join(work,u.draft),'utf8').replace(/^\uFEFF/,'').trim()).join('\n\n---\n\n')+'\n';
check(fs.readFileSync(path.join(stage,'export/manuscript.md'),'utf8')===manuscript&&hash(path.join(stage,'export/manuscript.md'))===manifest.sha256,'导出逐章等同最终正文且哈希相符');
const semantic=[];
function compare(a,b,p){if(same(a,b))return;if(a&&b&&typeof a==='object'&&typeof b==='object'&&!Array.isArray(a)&&!Array.isArray(b)){for(const k of new Set([...Object.keys(a),...Object.keys(b)]))if(!['evidence','updated_unit','introduced_unit'].includes(k))compare(a[k],b[k],p+'.'+k);}else semantic.push({path:p,before:a,after:b});}
compare(old.snapshot,state.snapshot,'snapshot');
save(path.join(stage,'semantic-diff.json'),semantic);save(path.join(stage,'evidence-audit.json'),{retained,replaced,new_count:evidence.length,evidence});save(path.join(stage,'custody-transfers.json'),transfers);save(path.join(stage,'source-bindings.json'),sources);
const result={ok:checks.every(x=>x.ok),scope:'mechanical-audit-separate-from-informed-model-reading',revision:state.revision,units:42,checks:checks.length,failures:checks.filter(x=>!x.ok),body_rows:bodyRows,evidence:{before_retained:retained,before_replaced:replaced,after_total:evidence.length},preserved_first_part_knowledge_fields:preservedKnowledge,transfers,rolling_review:checked.rolling_review,state_sha256:hash(path.join(work,'.writer/state.json')),before_state_sha256:hash(path.join(frozen,'.writer/state.json')),source_sha256:hash(path.join(work,'设定/续部人物与场所.md')),export_sha256:manifest.sha256,manifest_sha256:hash(path.join(stage,'export/manifest.json')),command_labels:['before-status','drift-status','drift-context43','drift-export','rewind-from25-r90','repair1-rewind25-r109','delivery-review25-42','final3-status','final3-check','final3-doctor','final3-export','delivery-git-status']};
save(path.join(stage,'audit.json'),{...result,checks_detail:checks});console.log(JSON.stringify(result));process.exitCode=result.ok?0:1;
