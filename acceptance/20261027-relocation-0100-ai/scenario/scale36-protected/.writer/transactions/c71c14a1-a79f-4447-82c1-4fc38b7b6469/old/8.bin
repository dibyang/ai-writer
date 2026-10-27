import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { isDeepStrictEqual as same } from 'node:util';
import { cleanKeys } from './journal.mjs';
import { initialSources } from './sources.mjs';
import { userError } from './help.mjs';
import { identifyBuild } from './tool-build.mjs';

const ACTIVE = ['open', 'editing', 'prepared', 'interrupted', 'conflicted'];
const UUID = /^[a-f0-9]{8}-[a-f0-9-]{27}$/;
const TREES = ['正文', '设定', '大纲', '研究', '审查', '参考拆解', '.writer/objects', '.writer/journal', '.writer/reviews', '.writer/import-source'];
const SINGLE = ['writer.json', '.writer/state.json', '.writer/import.json', '.writer/import-locations.json'];
export function createRevisions(api) {
  const { project, safe, json, text, hash, atomic, withLock, fresh, string, integer, stateLimit, gate, writeEvidence, journal, runtimeFiles, toolRoot, getToken, reviewStatus } = api;
  const fail = (code, message, extra = {}) => { throw userError(message, { code, ...extra }); };
  const encoded = value => Buffer.from(JSON.stringify(value, null, 2) + '\n');
  const runtime = () => hash(JSON.stringify(runtimeFiles.map(ref => [ref, hash(fs.readFileSync(path.join(toolRoot, ref)))])));
  const loadedBuild = runtime();
  function keys(input, allowed) { cleanKeys(input); if (!input || typeof input !== 'object' || Array.isArray(input) || Object.keys(input).some(k => !allowed.includes(k))) fail('REVISION_INPUT_INVALID', '修订输入含未知字段或不是对象'); }
  function bytes(root, ref) { const file = safe(root, ref); if (!fs.existsSync(file)) return null; const stat = fs.statSync(file); if (!stat.isFile() || stat.size > stateLimit) fail('REVISION_UNSAFE_FILE', `修订文件非普通文件或过大：${ref}`); return fs.readFileSync(file); }
  function digest(root, ref) { const b = bytes(root, ref); return b === null ? null : hash(b); }
  function storeBytes(root, ref, value, exclusive = false) {
    const file = safe(root, ref); fs.mkdirSync(path.dirname(file), { recursive: true });
    const temp = exclusive ? file : `${file}.${crypto.randomUUID()}.tmp`; let fd;
    try {
      fd = fs.openSync(temp, 'wx'); fs.writeFileSync(fd, value); fs.fsyncSync(fd); fs.closeSync(fd); fd = undefined;
      if (!exclusive) {
        if (process.env.AI_WRITER_TEST_FAULT === '1' && process.env.AI_WRITER_TEST_RENAME_TARGET === ref && process.env.AI_WRITER_TEST_RENAME_ERROR === 'ENOSPC') { const error = new Error(`注入 rename ENOSPC：${ref}`); error.code = 'ENOSPC'; throw error; }
        fs.renameSync(temp, file);
      }
    }
    finally { if (fd !== undefined) fs.closeSync(fd); if (!exclusive && fs.existsSync(temp)) fs.unlinkSync(temp); }
  }
  function metadata(root, ref, value, exclusive = false) { storeBytes(root, ref, encoded(value), exclusive); }
  function marker(root) {
    const ref = '.writer/revision-workspace.json'; if (!fs.existsSync(safe(root, ref))) return null;
    const data = json(safe(root, ref)); if (!UUID.test(data.id ?? '') || !path.isAbsolute(data.parent ?? '')) fail('REVISION_CORRUPT', '独立修订区标记损坏');
    const parent = fs.realpathSync(data.parent), expected = safe(parent, `.writer/revisions/${data.id}/workspace`);
    if (fs.realpathSync(root) !== fs.realpathSync(expected)) fail('REVISION_CORRUPT', '修订区位置与会话不符');
    return { ...data, parent };
  }
  function session(root, id) {
    if (!UUID.test(id ?? '')) fail('REVISION_INPUT_INVALID', '会话 ID 无效');
    const ref = `.writer/revisions/${id}/session.json`, s = json(safe(root, ref));
    if (s.id !== id || ![...ACTIVE, 'committed', 'aborted'].includes(s.status) || !/^[a-f0-9]{64}$/.test(s.token_sha256 ?? '')) fail('REVISION_CORRUPT', '修订会话元数据损坏');
    const baseRef = `.writer/revisions/${id}/base.json`; if (digest(root, baseRef) !== s.base_sha256) fail('REVISION_CORRUPT', '修订基线清单损坏');
    return s;
  }
  function sessions(root) {
    const dir = safe(root, '.writer/revisions'); if (!fs.existsSync(dir)) return [];
    return fs.readdirSync(dir).filter(id => UUID.test(id) && fs.existsSync(safe(root, `.writer/revisions/${id}/session.json`))).map(id => session(root, id));
  }
  function saveSession(root, s) { metadata(root, `.writer/revisions/${s.id}/session.json`, s); }
  function owner(s, token) { if (typeof token !== 'string' || hash(token) !== s.token_sha256) fail('REVISION_OWNER_REQUIRED', '需要该修订会话的所有者令牌；不会按 PID 或超时抢占'); }
  function info(root) { const m = marker(root); if (!m) return null; const s = session(m.parent, m.id); return { id: s.id, scope: s.scope, status: s.status, parent: m.parent, owner: s.owner, ...(s.kind === 'continuation' ? { kind:s.kind, append_range:baseline(m.parent,s).continuation.append_range } : {}),...(s.kind==='continuation-revision'?{kind:s.kind,revise_range:{from:baseline(m.parent,s).limited_revision.unit,to:baseline(m.parent,s).limited_revision.unit}}:{}) }; }
  function transactions(root) {
    const dir = safe(root, '.writer/transactions'); if (!fs.existsSync(dir)) return [];
    return fs.readdirSync(dir).filter(id => UUID.test(id) && fs.existsSync(safe(root, `.writer/transactions/${id}/transaction.json`))).map(id => {
      const tx = json(safe(root, `.writer/transactions/${id}/transaction.json`), stateLimit);
      if (tx.id !== id || !['prepared', 'applying', 'conflicted', 'completed', 'rolled-back'].includes(tx.status)) fail('TRANSACTION_CORRUPT', '事务状态损坏，保留现场'); return tx;
    });
  }
  function assertReady(root) {
    const parent = marker(root)?.parent ?? root, pending = transactions(parent).filter(t => !['completed', 'rolled-back'].includes(t.status));
    if (pending.length) {const tool=pending.some(t=>t.kind==='tool-update');fail(tool?'TOOL_UPDATE_PENDING':'TRANSACTION_PENDING', tool?'存在未完成工具更新，普通读写暂停；从外部新入口tool updates查看，再按明确方向tool recover。':'存在未完成修订事务，普通读写暂停；先 revision list，再显式 revision recover。', { transactions: pending.map(t => ({ id: t.id, kind:t.kind??'revision', session_id: t.session_id, status: t.status })) });}
  }
  function guardLoaded(){if(runtime()!==loadedBuild)fail('TOOL_BUILD_CHANGED','本进程加载后工具模块已改变；重新启动新命令，不使用旧进程写入');}
  function guardWrite(root, options = {}) {
    guardLoaded();
    assertReady(root); const m = marker(root);
    if (m) {
      const s = session(m.parent, m.id); owner(s, getToken());
      if (!['open', 'editing'].includes(s.status)) fail('REVISION_NOT_EDITING', '会话不处于可编辑状态；prepared 需先 resume，冲突须保留原候选并新建基线');
      if (s.build_id !== loadedBuild) fail('TOOL_BUILD_CHANGED', '修订会话绑定的工具构建不同；保留候选，不能直接提交');
      if (s.kind === 'continuation') {
        if (!['plan','record','output','adopt','review','workflow'].includes(options.continuationAction)) fail('CONTINUATION_ACTION_BLOCKED','续写候选只开放限章细纲、已有稿采纳、登记、审查与限范围阶段管理；不修改旧章或发布');
        continuationState(root);
      }
      if(s.kind==='continuation-revision'){
        if(!['rewind','record','output','review','workflow','issues','local-proof'].includes(options.continuationAction))fail('LIMITED_REVISION_ACTION_BLOCKED','本修订区只允许限章回退、重登、审查和候选意见闭环，不改设定、旧章或发布');
        limitedRevisionState(root);
      }
      s.status = 'editing'; saveSession(m.parent, s); return;
    }
    const active = sessions(root).filter(s => ACTIVE.includes(s.status));
    if (active.length) fail('REVISION_OCCUPIED', '作品有活跃修订会话；在独立区操作，或由所有者显式结束，不允许旁路写入', { sessions: active.map(s => ({ id: s.id, owner: s.owner, scope: s.scope, status: s.status })) });
  }
  function limitedRevisionState(root){
    const m=marker(root);if(!m)return null;const s=session(m.parent,m.id);if(s.kind!=='continuation-revision')return null;
    const base=baseline(m.parent,s),spec=base.limited_revision,p=project(root),original=json(safe(m.parent,`.writer/revisions/${s.id}/base-state.json`),stateLimit);
    if(!spec||spec.unit!==original.units.length||spec.unit!==7||p.state.project_id!==original.project_id||p.state.units.length<spec.unit-1||p.state.units.length>spec.unit||!same(p.state.units.slice(0,spec.unit-1),original.units.slice(0,spec.unit-1))||!same(p.state.baseline,original.baseline))fail('LIMITED_REVISION_PREFIX_CHANGED','限7修订区的旧六章登记链、基线或范围已变化');
    if(p.state.revision_scope&&!same(p.state.revision_scope,{from:spec.unit,through:spec.unit}))fail('LIMITED_REVISION_SCOPE','只允许回退及重登第七章');
    for(const field of ['source_versions','source_ranges','source_operations','source_events','source_binding','impact_pending','decisions','committed_revisions'])if(!same(p.state[field],original[field]))fail('LIMITED_REVISION_SOURCE_CHANGED',`限章修订不改变来源权威或决策：${field}`);
    for(const [ref,sha]of Object.entries(base.files))if(ref!=='.writer/state.json'&&ref!==spec.draft&&!ref.startsWith('.writer/tool/')&&digest(root,ref)!==sha)fail('LIMITED_REVISION_PREFIX_CHANGED',`旧章或来源文件变化：${ref}`);
    function newBody(ref){const file=safe(root,ref);if(fs.statSync(file).isDirectory())return fs.readdirSync(file).some(name=>newBody(`${ref}/${name}`));return !Object.hasOwn(base.files,ref);}
    if(newBody('正文'))fail('LIMITED_REVISION_SCOPE','限7修订不收纳新正文路径');
    const a=p.state.governance.authorization;if(a.draft_range!==null||a.allowed_actions.includes('draft')||a.revise_range&&!same(a.revise_range,{from:spec.unit,to:spec.unit}))fail('LIMITED_REVISION_SCOPE','不得扩大限7修订授权');
    const row=p.state.units[spec.unit-1];if(row&&(row.draft!==spec.draft||![original.units[spec.unit-1].sha256,spec.replacement_sha256].includes(row.sha256)))fail('LIMITED_REVISION_DRAFT_MISMATCH','当前登记不是原稿或本次授权封存修订稿');
    return {m,s,base,spec,p,original};
  }
  function continuationState(root) {
    const m=marker(root); if(!m)return null; const s=session(m.parent,m.id); if(s.kind!=='continuation')return null;
    const base=baseline(m.parent,s), c=base.continuation, p=project(root), original=json(safe(m.parent,`.writer/revisions/${s.id}/base-state.json`),stateLimit);
    if(!c || c.append_range.from!==original.units.length+1 || c.append_range.to!==c.append_range.from || !same(p.state.units.slice(0,original.units.length),original.units) || p.state.units.length>c.append_range.to || p.state.project_id!==original.project_id || p.state.revision_scope) fail('CONTINUATION_PREFIX_CHANGED','续写候选的旧章登记链或范围已改变，保留现场');
    const appendRef=`大纲/单元/${String(c.append_range.from).padStart(4,'0')}.json`,identity=ref=>process.platform==='win32'?ref.toLowerCase():ref;
    const hasRef=(hashes,ref)=>Object.keys(hashes??{}).some(key=>identity(key)===identity(ref));
    const declared=json(safe(root,c.manifest.ref),stateLimit),mutableAppendPlan=!hasRef(declared.source_hashes,appendRef)&&!original.units.some(row=>hasRef(row.source_hashes,appendRef)||hasRef(row.source_bindings,appendRef));
    for(const [ref,sha] of Object.entries(base.files)) if(ref!=='.writer/state.json' && !ref.startsWith('.writer/tool/') && !(mutableAppendPlan&&identity(ref)===identity(appendRef)) && digest(root,ref)!==sha) fail('CONTINUATION_PREFIX_CHANGED',`续写候选的既有文件或来源已改变：${ref}`);
    const appended=p.state.units.find(row=>row.unit===c.append_range.from);
    if(mutableAppendPlan&&appended){const entries=Object.entries(appended.source_hashes??{}).filter(([ref])=>identity(ref)===identity(appendRef)),consumedRef=appended.source_bindings?.[entries[0]?.[0]]?.object_ref??appendRef;if(entries.length!==1||digest(root,consumedRef)!==entries[0][1])fail('CONTINUATION_PREFIX_CHANGED','已登记的新章计划发生变化；不能继续按写前可变计划处理');}
    const a=p.state.governance.authorization;
    if(a.revise_range!==null || a.allowed_actions.includes('revise') || a.draft_range && !same(a.draft_range,c.append_range)) fail('CONTINUATION_SCOPE_INVALID','续写候选不得扩大单章授权或修订旧章');
    return {m,s,base,c,p,original,appendPlan:{ref:appendRef,mutable:mutableAppendPlan}};
  }
  function inventory(root, extra = []) {
    const result = {};
    function visit(ref) {
      const file = safe(root, ref); if (!fs.existsSync(file)) return;
      if (fs.statSync(file).isDirectory()) { for (const name of fs.readdirSync(file).sort()) visit(`${ref}/${name}`); }
      else result[ref] = digest(root, ref);
    }
    for (const ref of [...TREES, ...SINGLE, ...extra]) visit(ref);
    return Object.fromEntries(Object.entries(result).sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0));
  }
  function dependencies(state) {
    return [...new Set([...state.units.flatMap(u => Object.keys(u.source_hashes ?? {})),
      ...Object.values(state.governance?.planning ?? {}).flatMap(entry => entry.refs ?? [])])].filter(ref => ref !== '.writer/state.json');
  }
  function extras(p) { return dependencies(p.state); }
  function preserveObservations(original, target) {
    for (const [id, entry] of Object.entries(original.snapshot?.ledger ?? {})) {
      if (entry.type !== 'observation') continue;
      const next = target.snapshot?.ledger?.[id];
      const changed = ['type', 'statement', 'author_truth'].filter(key => !same(entry[key], next?.[key]));
      if (changed.length) fail('IMMUTABLE_OBSERVATION_CHANGED', `独立修订不能改写或删除既有观察 ${id}；保留原记录，新增解释或修正条目`, { ledger_id: id, changed_fields: changed });
    }
  }
  function managed(ref) { return ref === '.writer/state.json' || TREES.some(prefix => ref.startsWith(`${prefix}/`)); }
  function externalDependency(ref) { return !['.writer', '.git', '.agents', '.codex', '.aws'].includes(ref.split('/')[0].toLowerCase()); }
  function toolFiles(root) { return [...runtimeFiles.map(ref => `.writer/tool/${ref}`), '.writer/tool/build-manifest.json'].filter(ref => fs.existsSync(safe(root, ref))); }
  function baseline(root, s) { const base = json(safe(root, `.writer/revisions/${s.id}/base.json`), stateLimit); if (base.project_id !== s.project_id || base.build_id !== s.build_id || !same(base.scope, s.scope)) fail('REVISION_CORRUPT', '基线身份或声明范围不符'); return base; }
  function parentUnchanged(root, s, base) {
    const p = project(root), now = inventory(root, base.extra), build = runtime();
    if (p.state.revision !== base.revision || p.state.project_id !== base.project_id || build !== base.build_id || !same(now, base.files)) {
      const changes = [...new Set([...Object.keys(base.files), ...Object.keys(now)])].filter(file => base.files[file] !== now[file]).map(file => ({ file, expected_sha256: base.files[file] ?? null, actual_sha256: now[file] ?? null }));
      const ref = `.writer/revisions/${s.id}/conflict-${crypto.randomUUID()}.json`;
      metadata(root, ref, { base_revision: base.revision, current_revision: p.state.revision, base_build_id: base.build_id, current_build_id: build, changes }, true);
      s.status = 'conflicted'; s.conflict = { ref, sha256: digest(root, ref) }; saveSession(root, s);
      fail('BASELINE_CONFLICT', '主作品业务或相关文件/工具已变化；双方稿件保留，实读新基线后另建会话，不自动合并', { conflicts: changes.slice(0, 50), recovery: { session_id: s.id, base_revision: base.revision, current_revision: p.state.revision, conflict_ref: ref, omitted_changes: Math.max(0, changes.length - 50) } });
    }
    return p;
  }
  function preview(root) { const p = project(root); return { ok: true, schema_version: p.state.schema_version, target_schema: 4, already_enabled: p.state.schema_version >= 4, revision: p.state.revision,
    note: 'schema 4 阻止旧 0.4 工具忽略版本/会话保护；仅显式 enable 会升级状态，保留事实和备份，不更新随附工具' }; }
  function enable(root, input) {
    keys(input, ['expected_revision', 'author_evidence']);
    return withLock(root, () => {
      const p = project(root); if (p.state.schema_version >= 4) return { ok: true, unchanged: true, revision: p.state.revision };
      if (p.state.schema_version !== 3) fail('GOVERNANCE_REQUIRED', '先通过 governance preview/migrate 启用阶段和作者决策，再启用本批保护');
      integer(input.expected_revision, 'expected_revision', 0); if (input.expected_revision !== p.state.revision) fail('REVISION_CHANGED', '业务修订号已变化'); fresh(p); gate(p, 'plan');
      const evidence = writeEvidence(p, input.author_evidence), backup = `.writer/pre-protection-${p.state.revision}-${crypto.randomUUID()}.json`;
      storeBytes(root, backup, fs.readFileSync(safe(root, '.writer/state.json')), true);
      const ref = `.writer/objects/${crypto.randomUUID()}.json`; atomic(safe(root, ref), { kind: 'protection-enable', payload: { from_schema: 3, to_schema: 4 }, evidence });
      p.state.governance_events.push({ ref, sha256: digest(root, ref) }); Object.assign(p.state, initialSources(), { schema_version: 4, revision: p.state.revision + 1 });
      journal.verify(root, p.state); atomic(safe(root, '.writer/state.json'), p.state, stateLimit);
      return { ok: true, schema_version: 4, revision: p.state.revision, backup, facts_unchanged: true };
    });
  }
  function begin(root, input) {
    keys(input, ['expected_revision', 'owner', 'from', 'through', 'parallel_candidate', 'adopt_existing_changes', 'author_evidence']);
    return withLock(root, () => {
      if (marker(root)) fail('REVISION_INPUT_INVALID', '不能在独立区内再嵌套修订区');
      if(sessions(root).some(s=>s.kind==='continuation-revision'))fail('CONTINUATION_PUBLICATION_BLOCKED','限章候选协调目录不能另建普通修订绕过未发布边界');
      const p = project(root); if (p.state.schema_version < 4) fail('PROTECTION_REQUIRED', '先显式启用 schema 4 保护');
      integer(input.expected_revision, 'expected_revision', 0); if (p.state.revision !== input.expected_revision) fail('REVISION_CHANGED', '业务修订号已变化');
      integer(input.from, 'from'); const through = input.through ?? p.state.units.length;
      if (through !== p.state.units.length || input.from > through) fail('REVISION_SCOPE_INVALID', '首版保守核查从最早影响章至当前末章；through 必须等于当前末章');
      gate(p, 'revise', input.from, through); string(input.owner, 'owner', 300);
      if (input.adopt_existing_changes !== undefined && typeof input.adopt_existing_changes !== 'boolean') fail('REVISION_INPUT_INVALID', 'adopt_existing_changes 必须是布尔值');
      const existing = api.inspectIntegrity(p); let adoptionProof = null;
      if (input.adopt_existing_changes === true) {
        journal.verify(root, p.state);
        const earliest = Math.min(...existing.stale_units, ...existing.changed_sources.map(x => x.unit));
        if (input.from > earliest) fail('REVISION_SCOPE_INVALID', '声明范围未覆盖已发生修改的最早消费者');
        adoptionProof = input.author_evidence; keys(adoptionProof, ['quote', 'local_source', 'source_sha256', 'locator', 'recorded_by']);
        string(adoptionProof.quote, 'quote'); string(adoptionProof.locator, 'locator'); string(adoptionProof.recorded_by, 'recorded_by');
        const file = safe(root, adoptionProof.local_source);
        if (digest(root, adoptionProof.local_source) !== adoptionProof.source_sha256 || !text(file).includes(adoptionProof.quote)) fail('AUTHOR_EVIDENCE_MISMATCH', '收纳已有修改的授权与本地来源不符');
      } else fresh(p, { allowImpact: true });
      if (input.parallel_candidate !== undefined && typeof input.parallel_candidate !== 'boolean') fail('REVISION_INPUT_INVALID', 'parallel_candidate 必须是布尔值');
      const active = sessions(root).filter(s => ACTIVE.includes(s.status)); if (active.length && input.parallel_candidate !== true) fail('REVISION_OCCUPIED', '已有活跃会话；仅显式 parallel_candidate 可另建候选，不抢占', { sessions: active.map(s => ({ id: s.id, owner: s.owner, scope: s.scope })) });
      const impactFrom = Math.min(...Object.values(p.state.impact_pending).map(x => x.from)); if (Number.isFinite(impactFrom) && input.from > impactFrom) fail('REVISION_SCOPE_INVALID', '范围未覆盖最早待处理影响');
      const id = crypto.randomUUID(), token = crypto.randomBytes(32).toString('hex'), directory = `.writer/revisions/${id}`, extra = [...extras(p), ...toolFiles(root)];
      const base = { project_id: p.state.project_id, revision: p.state.revision, build_id: loadedBuild, scope: { from: input.from, through }, extra, existing_changes: existing, files: inventory(root, extra) };
      const workspaceRef = `${directory}/workspace`; fs.mkdirSync(safe(root, workspaceRef), { recursive: true });
      // Explicit managed trees and actual input dependencies only; never copy other branches, transactions or the embedded runtime.
      for (const ref of Object.keys(base.files).filter(ref => !ref.startsWith('.writer/tool/'))) storeBytes(root, `${workspaceRef}/${ref}`, bytes(root, ref), true);
      metadata(root, `${workspaceRef}/.writer/revision-workspace.json`, { id, parent: fs.realpathSync(root), project_id: p.state.project_id }, true);
      metadata(root, `${directory}/base.json`, base, true); storeBytes(root, `${directory}/base-state.json`, bytes(root, '.writer/state.json'), true);
      if (adoptionProof) {
        storeBytes(root, `${directory}/adoption-author.txt`, bytes(root, adoptionProof.local_source), true);
        metadata(root, `${directory}/adoption.json`, { evidence: adoptionProof, existing_changes: existing, note: '当前字节与原追踪分别保留；不宣称找回或追认旧输入' }, true);
      }
      const s = { id, owner: input.owner, token_sha256: hash(token), project_id: p.state.project_id, build_id: loadedBuild, scope: base.scope, status: 'open', base_sha256: digest(root, `${directory}/base.json`), created_at: new Date().toISOString() };
      if (!same(inventory(root, extra), base.files)) fail('BASELINE_CONFLICT', '复制期间主文件变化，候选保留为未登记孤儿，不继续');
      saveSession(root, s); return { ok: true, id, token, owner: s.owner, scope: s.scope, workspace: safe(root, workspaceRef), base_revision: base.revision, existing_changes: existing,
        note: '令牌用于防误操作，不能对同用户文件访问提供强隔离；在独立区实读、修改、rewind 和顺序重登，再 prepare/commit' };
    }, { coordination: true });
  }
  function continueCandidate(root,input) {
    keys(input,['expected_revision','expected_state_sha256','expected_session_sha256','token','target','owner','unit','author_evidence','draft','draft_sha256','manifest','acknowledged_parent_additions']);
    const m=marker(root); if(!m)fail('REVISION_REQUIRED','续写派生入口必须指向原独立候选');
    return withLock(m.parent,()=>withLock(root,()=>{
      const s=session(m.parent,m.id); owner(s,input.token); if(['continuation','continuation-revision'].includes(s.kind) || !['open','editing'].includes(s.status))fail('REVISION_NOT_EDITING','只从未准备提交的普通修订候选派生');
      const p=project(root); fresh(p); integer(input.unit,'unit');
      if(p.state.schema_version<6 || p.state.revision_scope || input.unit!==p.state.units.length+1 || s.scope.through!==p.state.units.length)fail('CONTINUATION_SCOPE_INVALID','原候选须已完整重登到固定末章；首批仅追加下一章');
      if(input.expected_revision!==p.state.revision || digest(root,'.writer/state.json')!==input.expected_state_sha256 || digest(m.parent,`.writer/revisions/${s.id}/session.json`)!==input.expected_session_sha256)fail('REVISION_CHANGED','原候选状态或会话已变化');
      const oldBuild=identifyBuild(m.parent), oldRuntime=hash(JSON.stringify(runtimeFiles.map(ref=>[ref,digest(m.parent,`.writer/tool/${ref}`)]))), oldBase=baseline(m.parent,s);
      const main=project(m.parent),parentInventory=inventory(m.parent,oldBase.extra);
      if(!oldBuild.ok || oldRuntime!==s.build_id || oldBase.revision!==main.state.revision || Object.entries(oldBase.files).some(([ref,sha])=>parentInventory[ref]!==sha))fail('BASELINE_CONFLICT','原会话构建、主稿状态或旧基线文件已变化；不刷新、不迁移原会话');
      const acknowledged=input.acknowledged_parent_additions??[];
      if(!Array.isArray(acknowledged)||acknowledged.length>16)fail('PARENT_ADDITIONS_INVALID','须逐项列明最多16个未消费规划新增；不支持目录或通配符');
      const added=Object.keys(parentInventory).filter(ref=>!Object.hasOwn(oldBase.files,ref)),seen=new Set();
      const pathIdentity=ref=>process.platform==='win32'?ref.toLowerCase():ref;
      function references(value,ref){return typeof value==='string'&&pathIdentity(value)===pathIdentity(ref) || Boolean(value&&typeof value==='object'&&Object.entries(value).some(([key,child])=>pathIdentity(key)===pathIdentity(ref)||references(child,ref)));}
      for(const item of acknowledged){
        keys(item,['ref','sha256','manifest_ref']);
        if(!/^大纲\/[^/]+\.md$/.test(item.ref??'')||seen.has(item.ref)||!added.includes(item.ref)||!/^[a-f0-9]{64}$/.test(item.sha256??'')||parentInventory[item.ref]!==item.sha256||typeof item.manifest_ref!=='string')fail('PARENT_ADDITIONS_INVALID','只允许精确列明大纲目录下新增Markdown的原路径、实际哈希和写前清单对应路径');
        if(references(main.state,item.ref)||references(p.state,item.ref))fail('PARENT_ADDITION_CONSUMED',`规划新增已有状态消费者，不能作为未消费新增承认：${item.ref}`);
        seen.add(item.ref);
      }
      if(added.length!==seen.size||added.some(ref=>!seen.has(ref)))fail('BASELINE_CONFLICT','主稿存在未逐项承认的新增；旧基线仍保留，不忽略库存差异',{unacknowledged_additions:added.filter(ref=>!seen.has(ref))});
      const evidence=input.author_evidence; keys(evidence,['quote','local_source','source_sha256','locator','recorded_by']);
      for(const key of ['quote','local_source','locator','recorded_by'])string(evidence[key],key);
      if(!externalDependency(evidence.local_source) || digest(root,evidence.local_source)!==evidence.source_sha256 || !text(safe(root,evidence.local_source)).includes(evidence.quote))fail('AUTHOR_EVIDENCE_MISMATCH','续写派生需要当前公开来源中的明确作者原话及哈希');
      const manifest=input.manifest; keys(manifest,['root','ref','sha256','audit_only_refs']);
      if(!['parent','candidate'].includes(manifest.root) || !Array.isArray(manifest.audit_only_refs) || new Set(manifest.audit_only_refs).size!==manifest.audit_only_refs.length)fail('CONTINUATION_INPUT_INVALID','manifest.root及显式审计附件列表无效');
      const manifestRoot=manifest.root==='parent'?m.parent:root, manifestBytes=bytes(manifestRoot,manifest.ref);
      if(!/^\.writer\/drafts\//.test(manifest.ref) || !manifestBytes || hash(manifestBytes)!==manifest.sha256)fail('SOURCE_MANIFEST_MISMATCH','动笔前原始清单路径或哈希不符');
      const declared=json(safe(manifestRoot,manifest.ref),stateLimit); cleanKeys(declared);
      if(declared.revision!==p.state.revision || !declared.source_hashes || typeof declared.source_hashes!=='object' || Array.isArray(declared.source_hashes))fail('SOURCE_MANIFEST_MISMATCH','清单修订号或来源表无效；不追认、改写旧清单');
      if(declared.source_hashes['writer.json']!==digest(root,'writer.json') || declared.source_hashes[p.state.units.at(-1).draft]!==p.state.units.at(-1).sha256)fail('SOURCE_MANIFEST_MISMATCH','动笔前清单须包含作品配置与承接末章的实际字节；空清单不能作为采纳依据');
      const audit=new Set(manifest.audit_only_refs), declaredRefs=Object.keys(declared.source_hashes);
      for(const ref of audit)if(!/^\.writer\/drafts\//.test(ref) || !declaredRefs.includes(ref))fail('PRIVATE_SOURCE_REJECTED','审计附件仅允许清单已有的.writer/drafts准备材料');
      for(const [ref,sha] of Object.entries(declared.source_hashes)) {
        if(!externalDependency(ref) && !audit.has(ref))fail('PRIVATE_SOURCE_REJECTED',`私有路径不得成为创作来源：${ref}`);
        if(!/^[a-f0-9]{64}$/.test(sha) || digest(root,ref)!==sha)fail('SOURCE_MANIFEST_MISMATCH',`动笔前来源当前字节已变化：${ref}`);
      }
      for(const item of acknowledged)if(!Object.hasOwn(declared.source_hashes,item.manifest_ref)||declared.source_hashes[item.manifest_ref]!==item.sha256)fail('PARENT_ADDITION_EVIDENCE_MISMATCH',`主稿规划新增须与原始写前清单中的材料逐字节对应：${item.ref}；审计附件不因此成为公开创作来源`);
      if(!/^\.writer\/drafts\//.test(input.draft) || digest(root,input.draft)!==input.draft_sha256)fail('DRAFT_ADOPTION_MISMATCH','封存稿路径或哈希不符');
      string(input.owner,'owner',300); string(input.target,'target'); let target=path.resolve(input.target), ancestor=path.dirname(target);const suffix=[path.basename(target)];
      while(!fs.existsSync(ancestor)){suffix.unshift(path.basename(ancestor));ancestor=path.dirname(ancestor);} target=path.join(fs.realpathSync(ancestor),...suffix);
      if(fs.existsSync(target))fail('CONTINUATION_TARGET_EXISTS','目标已存在，不覆盖；先查看上轮结果或保留失败现场');
      // Never create a child under either live worktree: their inventories must remain byte-identical.
      for(const source of [fs.realpathSync(root),fs.realpathSync(m.parent)]) {const rel=path.relative(source,target);if(!rel || !rel.startsWith('..')&&!path.isAbsolute(rel))fail('CONTINUATION_TARGET_INVALID','派生协调目录须在原作品之外的全新路径');}
      const extra=[...extras(p),...declaredRefs,evidence.local_source,input.draft], before=inventory(root,extra), stateBytes=bytes(root,'.writer/state.json'), draftBytes=bytes(root,input.draft), id=crypto.randomUUID(), token=crypto.randomBytes(32).toString('hex');
      api.initProject(target,p.config.kind,p.config.title,{longForm:Boolean(p.state.long_form)});
      const initialized=json(safe(target,'.writer/state.json'),stateLimit);
      // init supplies the new runtime/resources, not a replacement story scaffold.
      // Remove only known files in this newly-created target that the source did not have.
      for(const ref of Object.keys(inventory(target)))if(!Object.hasOwn(before,ref))fs.unlinkSync(safe(target,ref));
      // Replace only this new unpublished copy's business files. No replay/reset of the consumption chain.
      for(const [ref,sha] of Object.entries(before)) { if(ref.startsWith('.writer/tool/'))continue; const b=bytes(root,ref); if(hash(b)!==sha)fail('BASELINE_CONFLICT','复制期间来源变化，保留目标现场'); storeBytes(target,ref,b); }
      const newState=structuredClone(p.state); newState.tool_control=initialized.tool_control;
      atomic(safe(target,'.writer/state.json'),newState,stateLimit);
      const originRef=`.writer/objects/${crypto.randomUUID()}.json`; storeBytes(target,originRef,stateBytes,true);
      const manifestRef=`.writer/objects/${crypto.randomUUID()}.json`; storeBytes(target,manifestRef,manifestBytes,true);
      const draftRef=`.writer/objects/${crypto.randomUUID()}.txt`; storeBytes(target,draftRef,draftBytes,true);
      const parentAuditRef=`.writer/objects/${crypto.randomUUID()}.json`,acknowledgedAudit=[];
      for(const item of acknowledged){const frozen_ref=`.writer/objects/${crypto.randomUUID()}.txt`,b=bytes(m.parent,item.ref);if(!b||hash(b)!==item.sha256)fail('BASELINE_CONFLICT','主稿新增在复制期间变化，保留目标现场');storeBytes(target,frozen_ref,b,true);acknowledgedAudit.push({...item,frozen_ref});}
      metadata(target,parentAuditRef,{kind:'continuation-parent-inventory-acknowledgment',original_session_id:s.id,original_base_sha256:s.base_sha256,original_files_sha256:hash(encoded(oldBase.files)),accepted_inventory:parentInventory,acknowledged_additions:acknowledgedAudit,note:'只承认原写前清单已有材料对应的未消费规划新增；未刷新旧基线，未把审计附件升级为公开来源'},true);
      api.setWorkflow(target,{expected_revision:newState.revision,operation_id:`continue-${id}`,author_evidence:evidence,workflow:{...structuredClone(newState.governance),stage:'trial',task:`仅采纳已有第${input.unit}章候选，不切换主稿`,authorization:{allowed_actions:['discuss','plan','draft'],draft_range:{from:input.unit,to:input.unit},revise_range:null,stop_conditions:[`第${input.unit+1}章须另行授权；本候选不可发布或修订旧章`]}}});
      const c={append_range:{from:input.unit,to:input.unit},origin:{root:fs.realpathSync(root),parent:m.parent,id:m.id,revision:p.state.revision,state_sha256:hash(stateBytes),session_sha256:input.expected_session_sha256,tool_content_id:oldBuild.observed_content_id,state_ref:originRef},draft:{ref:draftRef,sha256:input.draft_sha256,original_ref:input.draft},manifest:{ref:manifestRef,sha256:manifest.sha256,original:manifest,audit_only_refs:[...audit]},note:'完整保留旧消费链；当前工具仅绑定新副本，原工具与会话未升级；声明的动笔前清单不是官方写前模板或时间认证'};
      c.parent_inventory_acknowledgment={ref:parentAuditRef,sha256:digest(target,parentAuditRef),acknowledged_additions:acknowledgedAudit};
      const directory=`.writer/revisions/${id}`, workspaceRef=`${directory}/workspace`, files=inventory(target,extra);
      const base={project_id:p.state.project_id,revision:project(target).state.revision,build_id:loadedBuild,scope:{from:1,through:input.unit},extra,files,continuation:c};
      for(const ref of Object.keys(files).filter(ref=>!ref.startsWith('.writer/tool/')))storeBytes(target,`${workspaceRef}/${ref}`,bytes(target,ref),true);
      metadata(target,`${workspaceRef}/.writer/revision-workspace.json`,{id,parent:fs.realpathSync(target),project_id:p.state.project_id},true);
      metadata(target,`${directory}/base.json`,base,true); storeBytes(target,`${directory}/base-state.json`,stateBytes,true);
      if(!same(before,inventory(root,extra)) || !same(inventory(m.parent,oldBase.extra),parentInventory) || digest(m.parent,`.writer/revisions/${s.id}/session.json`)!==input.expected_session_sha256 || digest(manifestRoot,manifest.ref)!==manifest.sha256)fail('BASELINE_CONFLICT','派生期间原来源变化，目标未登记为活跃候选，保留现场');
      const next={id,kind:'continuation',owner:input.owner,token_sha256:hash(token),project_id:p.state.project_id,build_id:loadedBuild,scope:base.scope,status:'open',base_sha256:digest(target,`${directory}/base.json`),created_at:new Date().toISOString()}; saveSession(target,next);
      return {ok:true,id,token,parent:target,workspace:safe(target,workspaceRef),append_range:c.append_range,revision:base.revision,origin:c.origin,note:c.note,next:'在新候选建立公开来源细纲后 revision adopt；原稿及原候选保持不变'};
    },{coordination:true}),{coordination:true});
  }
  function getOwned(root, input) { const s = session(root, input.id); owner(s, input.token); return s; }
  function repairContinuation(root,input){
    keys(input,['token','expected_revision','expected_state_sha256','expected_session_sha256','expected_base_sha256','expected_plan_sha256','target','owner','reason']);
    const m=marker(root);if(!m)fail('CONTINUATION_REQUIRED','接管入口仅用于尚未登记新章的现有续写候选');
    return withLock(m.parent,()=>withLock(root,()=>{
      const s=session(m.parent,m.id);owner(s,input.token);if(s.kind!=='continuation'||!['open','editing'].includes(s.status))fail('CONTINUATION_REPAIR_SCOPE','仅接管可编辑续写候选，不处理终态或普通修订');
      const current=continuationState(root),{p,base,c,original,appendPlan}=current;fresh(p);
      const sessionRef=`.writer/revisions/${s.id}/session.json`,baseRef=`.writer/revisions/${s.id}/base.json`,originalRef=`.writer/revisions/${s.id}/base-state.json`,stateBytes=bytes(root,'.writer/state.json');
      if(!/^[a-f0-9]{64}$/.test(input.expected_plan_sha256??'')||input.expected_revision!==p.state.revision||hash(stateBytes)!==input.expected_state_sha256||digest(m.parent,sessionRef)!==input.expected_session_sha256||s.base_sha256!==input.expected_base_sha256||digest(root,appendPlan.ref)!==input.expected_plan_sha256)fail('REVISION_CHANGED','接管的state/session/base/plan核对值已变化');
      if(!appendPlan.mutable||p.state.units.length!==original.units.length||hash(stateBytes)!==base.files['.writer/state.json'])fail('CONTINUATION_REPAIR_SCOPE','只接管状态未变、尚未登记新章且未消费下一章计划的候选');
      const oldBuild=identifyBuild(m.parent),oldRuntime=hash(JSON.stringify(runtimeFiles.map(ref=>[ref,digest(m.parent,`.writer/tool/${ref}`)]))),parentFiles=inventory(m.parent,base.extra),sourceFiles=inventory(root,base.extra);
      if(!oldBuild.ok||oldRuntime!==s.build_id||project(m.parent).state.revision!==base.revision||!same(parentFiles,base.files)||digest(m.parent,originalRef)!==c.origin.state_sha256)fail('BASELINE_CONFLICT','原协调目录、原始状态或绑定构建变化；不刷新基线');
      if(Object.keys(sourceFiles).some(ref=>!Object.hasOwn(base.files,ref)&&ref!==appendPlan.ref))fail('CONTINUATION_REPAIR_SCOPE','接管只处理下一章计划及内部context草案，不收纳其他新增业务文件');
      const packet=api.continuationPacket(p,c.append_range.from),declared=json(safe(root,c.manifest.ref),stateLimit);
      for(const ref of [...packet.plan.setting_refs,...packet.plan.research_refs])if(!Object.hasOwn(declared.source_hashes,ref)||c.manifest.audit_only_refs.includes(ref))fail('ADOPTION_SOURCE_NOT_DECLARED','接管计划只能使用原清单已有公开来源');
      string(input.owner,'owner',300);string(input.reason,'reason',2000);string(input.target,'target');let target=path.resolve(input.target),ancestor=path.dirname(target);const suffix=[path.basename(target)];
      while(!fs.existsSync(ancestor)){suffix.unshift(path.basename(ancestor));ancestor=path.dirname(ancestor);}target=path.join(fs.realpathSync(ancestor),...suffix);
      if(fs.existsSync(target))fail('CONTINUATION_TARGET_EXISTS','目标已存在，不覆盖原派生或失败现场');
      for(const source of [root,m.parent,c.origin.root,c.origin.parent]){const rel=path.relative(fs.realpathSync(source),target);if(!rel||!rel.startsWith('..')&&!path.isAbsolute(rel))fail('CONTINUATION_TARGET_INVALID','接管目标须在原作品、原候选及现有派生之外');}
      const id=crypto.randomUUID(),token=crypto.randomBytes(32).toString('hex'),directory=`.writer/revisions/${id}`,workspaceRef=`${directory}/workspace`;
      api.initProject(target,p.config.kind,p.config.title,{longForm:Boolean(p.state.long_form)});const initialized=json(safe(target,'.writer/state.json'),stateLimit);
      for(const ref of Object.keys(inventory(target)))if(!Object.hasOwn(sourceFiles,ref))fs.unlinkSync(safe(target,ref));
      for(const [ref,sha] of Object.entries(sourceFiles)){if(ref.startsWith('.writer/tool/'))continue;const b=bytes(root,ref);if(!b||hash(b)!==sha)fail('BASELINE_CONFLICT','接管复制期间来源变化，保留现场');storeBytes(target,ref,b);}
      const copiedState=structuredClone(p.state);copiedState.tool_control=initialized.tool_control;atomic(safe(target,'.writer/state.json'),copiedState,stateLimit);
      const frozenBase=`.writer/objects/${crypto.randomUUID()}.json`,frozenState=`.writer/objects/${crypto.randomUUID()}.json`;storeBytes(target,frozenBase,bytes(m.parent,baseRef),true);storeBytes(target,frozenState,stateBytes,true);
      let frozenOldPlan=null;if(Object.hasOwn(base.files,appendPlan.ref)){frozenOldPlan=`.writer/objects/${crypto.randomUUID()}.json`;storeBytes(target,frozenOldPlan,bytes(m.parent,appendPlan.ref),true);}
      const handoffRef=`.writer/objects/${crypto.randomUUID()}.json`,handoff={kind:'continuation-plan-only-handoff',reason:input.reason,source_workspace:fs.realpathSync(root),source_parent:m.parent,source_session_id:s.id,source_state_sha256:hash(stateBytes),source_session_sha256:input.expected_session_sha256,source_base_sha256:s.base_sha256,source_tool_content_id:oldBuild.observed_content_id,source_base_ref:frozenBase,source_state_ref:frozenState,plan:{ref:appendPlan.ref,old_sha256:base.files[appendPlan.ref]??null,current_sha256:input.expected_plan_sha256,frozen_old_ref:frozenOldPlan},current_context:{revision:packet.revision,source_hashes:packet.source_hashes,source_bindings:packet.source_bindings??{}},accepted_source_inventory:sourceFiles,note:'复制现有计划与完整消费链到新绑定构建；原派生、原工具、旧基线不变，不追认动笔前来源，不扩大范围'};
      metadata(target,handoffRef,handoff,true);const nextC=structuredClone(c);nextC.handoff={ref:handoffRef,sha256:digest(target,handoffRef)};
      const files=inventory(target,base.extra),nextBase={project_id:p.state.project_id,revision:copiedState.revision,build_id:loadedBuild,scope:base.scope,extra:base.extra,files,continuation:nextC};
      for(const ref of Object.keys(files).filter(ref=>!ref.startsWith('.writer/tool/')))storeBytes(target,`${workspaceRef}/${ref}`,bytes(target,ref),true);
      metadata(target,`${workspaceRef}/.writer/revision-workspace.json`,{id,parent:fs.realpathSync(target),project_id:p.state.project_id},true);metadata(target,`${directory}/base.json`,nextBase,true);storeBytes(target,`${directory}/base-state.json`,bytes(m.parent,originalRef),true);
      if(!same(sourceFiles,inventory(root,base.extra))||!same(parentFiles,inventory(m.parent,base.extra))||digest(m.parent,sessionRef)!==input.expected_session_sha256||digest(m.parent,baseRef)!==input.expected_base_sha256)fail('BASELINE_CONFLICT','接管结束CAS失败；未注册新候选，双方现场保留');
      saveSession(target,{id,kind:'continuation',owner:input.owner,token_sha256:hash(token),project_id:p.state.project_id,build_id:loadedBuild,scope:base.scope,status:'open',base_sha256:digest(target,`${directory}/base.json`),created_at:new Date().toISOString()});
      return {ok:true,id,token,parent:target,workspace:safe(target,workspaceRef),append_range:c.append_range,revision:copiedState.revision,handoff:nextC.handoff,old_candidate_preserved:true,next:'使用新候选context/adopt，不重写原派生；第八章及发布仍拒绝'};
    },{coordination:true}),{coordination:true});
  }
  function reviseContinuation(root,input){
    keys(input,['token','expected_revision','expected_state_sha256','expected_session_sha256','expected_base_sha256','replacement_sha256','target','owner','reason','evidence_root','author_evidence']);
    const m=marker(root);if(!m)fail('CONTINUATION_REQUIRED','限7修订入口必须指向已登记七章的续写候选');
    return withLock(m.parent,()=>withLock(root,()=>{
      const s=session(m.parent,m.id);owner(s,input.token);if(s.kind!=='continuation'||!['open','editing'].includes(s.status))fail('LIMITED_REVISION_SCOPE','仅从可编辑的已登记续写候选建立限7修订');
      const {p,base,c}=continuationState(root);fresh(p);const unit=7,row=p.state.units[unit-1],stateBytes=bytes(root,'.writer/state.json'),sessionRef=`.writer/revisions/${s.id}/session.json`,baseRef=`.writer/revisions/${s.id}/base.json`;
      if(c.append_range.from!==unit||c.append_range.to!==unit||p.state.units.length!==unit||p.state.revision_scope)fail('LIMITED_REVISION_SCOPE','本入口仅限已完整登记第七章且无回退中的续写候选');
      if(input.expected_revision!==p.state.revision||input.expected_state_sha256!==hash(stateBytes)||input.expected_session_sha256!==digest(m.parent,sessionRef)||input.expected_base_sha256!==s.base_sha256)fail('REVISION_CHANGED','源state/session/base已变化，保持原候选');
      if(!/^[a-f0-9]{64}$/.test(input.replacement_sha256??'')||input.replacement_sha256===row.sha256)fail('LIMITED_REVISION_INPUT','须绑定本次已获授权、与旧稿不同的封存修订稿SHA256');
      const oldBuild=identifyBuild(m.parent),oldRuntime=hash(JSON.stringify(runtimeFiles.map(ref=>[ref,digest(m.parent,`.writer/tool/${ref}`)]))),parentFiles=inventory(m.parent,base.extra);
      if(!oldBuild.ok||oldRuntime!==s.build_id||project(m.parent).state.revision!==base.revision||!same(parentFiles,base.files))fail('BASELINE_CONFLICT','源协调目录或绑定工具已变化；不刷新旧基线');
      const proof=input.author_evidence;keys(proof,['quote','local_source','source_sha256','locator','recorded_by']);for(const k of ['quote','local_source','locator','recorded_by'])string(proof[k],k);
      if(input.evidence_root!==undefined&&!path.isAbsolute(input.evidence_root))fail('LIMITED_REVISION_INPUT','evidence_root须为明确的绝对来源目录');
      const evidenceRoot=fs.realpathSync(input.evidence_root??root),proofBytes=bytes(evidenceRoot,proof.local_source);if(!proofBytes||hash(proofBytes)!==proof.source_sha256||!text(safe(evidenceRoot,proof.local_source)).includes(proof.quote))fail('AUTHOR_EVIDENCE_MISMATCH','本次限7修订的新作者授权原话或哈希不符');
      string(input.owner,'owner',300);string(input.reason,'reason',2000);string(input.target,'target');let target=path.resolve(input.target),ancestor=path.dirname(target);const suffix=[path.basename(target)];while(!fs.existsSync(ancestor)){suffix.unshift(path.basename(ancestor));ancestor=path.dirname(ancestor);}target=path.join(fs.realpathSync(ancestor),...suffix);if(fs.existsSync(target))fail('CONTINUATION_TARGET_EXISTS','目标已存在，保留原目录和失败现场');
      const protectedRoots=[root,m.parent,c.origin.root,c.origin.parent];if(c.handoff){const h=json(safe(root,c.handoff.ref),stateLimit);protectedRoots.push(h.source_workspace,h.source_parent);}
      for(const source of protectedRoots){const rel=path.relative(fs.realpathSync(source),target);if(!rel||!rel.startsWith('..')&&!path.isAbsolute(rel))fail('CONTINUATION_TARGET_INVALID','限章修订目标须在全部源作品及派生目录之外');}
      const extra=[...new Set([...base.extra,...extras(p)])],filesBefore=inventory(root,extra),id=crypto.randomUUID(),token=crypto.randomBytes(32).toString('hex'),staging=path.join(path.dirname(target),`.ai-writer-limited-${id}`);
      // Build privately; a failed copy/CAS never exposes a usable target project.
      api.initProject(staging,p.config.kind,p.config.title,{longForm:Boolean(p.state.long_form)});const initialized=json(safe(staging,'.writer/state.json'),stateLimit);for(const ref of Object.keys(inventory(staging)))if(!Object.hasOwn(filesBefore,ref))fs.unlinkSync(safe(staging,ref));
      for(const [ref,sha]of Object.entries(filesBefore)){if(ref.startsWith('.writer/tool/'))continue;const b=bytes(root,ref);if(!b||hash(b)!==sha)fail('BASELINE_CONFLICT','复制期间源文件变化，保留暂存现场',{staging});storeBytes(staging,ref,b);}
      const copied=structuredClone(p.state);copied.tool_control=initialized.tool_control;atomic(safe(staging,'.writer/state.json'),copied,stateLimit);
      const copiedProof=`研究/作者授权-第七章小修-${id}.md`;storeBytes(staging,copiedProof,proofBytes,true);
      const sourceState=`.writer/objects/${crypto.randomUUID()}.json`,sourceBase=`.writer/objects/${crypto.randomUUID()}.json`;storeBytes(staging,sourceState,stateBytes,true);storeBytes(staging,sourceBase,bytes(m.parent,baseRef),true);
      api.setWorkflow(staging,{expected_revision:copied.revision,operation_id:`limited-${id}`,author_evidence:{...proof,local_source:copiedProof},workflow:{...structuredClone(copied.governance),stage:'revision',task:input.reason,authorization:{allowed_actions:['discuss','revise'],draft_range:null,revise_range:{from:unit,to:unit},stop_conditions:['只重登本次封存第七章小修稿；旧六章只读，不写第八章，不发布主稿']}}});
      const spec={unit,draft:row.draft,replacement_sha256:input.replacement_sha256,scope:'unpublished-candidate-only',author_evidence:{...proof,source_root:evidenceRoot,copied_ref:copiedProof},source:{workspace:fs.realpathSync(root),parent:m.parent,id:s.id,revision:p.state.revision,state_sha256:hash(stateBytes),session_sha256:input.expected_session_sha256,base_sha256:s.base_sha256,tool_content_id:oldBuild.observed_content_id,state_ref:sourceState,base_ref:sourceBase}};
      const directory=`.writer/revisions/${id}`,workspaceRef=`${directory}/workspace`,nextState=bytes(staging,'.writer/state.json'),files=inventory(staging,extra),nextBase={project_id:p.state.project_id,revision:project(staging).state.revision,build_id:loadedBuild,scope:{from:1,through:unit},extra,files,limited_revision:spec};
      for(const ref of Object.keys(files).filter(ref=>!ref.startsWith('.writer/tool/')))storeBytes(staging,`${workspaceRef}/${ref}`,bytes(staging,ref),true);
      metadata(staging,`${workspaceRef}/.writer/revision-workspace.json`,{id,parent:target,project_id:p.state.project_id},true);metadata(staging,`${directory}/base.json`,nextBase,true);storeBytes(staging,`${directory}/base-state.json`,nextState,true);
      if(!same(filesBefore,inventory(root,extra))||!same(parentFiles,inventory(m.parent,base.extra))||digest(m.parent,sessionRef)!==input.expected_session_sha256||digest(m.parent,baseRef)!==input.expected_base_sha256||digest(evidenceRoot,proof.local_source)!==proof.source_sha256)fail('BASELINE_CONFLICT','结束CAS失败，未注册新修订会话；保留双方',{staging});
      saveSession(staging,{id,kind:'continuation-revision',owner:input.owner,token_sha256:hash(token),project_id:p.state.project_id,build_id:loadedBuild,scope:nextBase.scope,status:'open',base_sha256:digest(staging,`${directory}/base.json`),local_proofs:[],created_at:new Date().toISOString()});api.promoteDirectory(staging,target);
      return {ok:true,id,token,parent:target,workspace:safe(target,workspaceRef),revision:nextBase.revision,revise_range:{from:unit,to:unit},replacement_sha256:spec.replacement_sha256,authorization_ref:copiedProof,scope:spec.scope,next:'先采用真实意见，再rewind7/context固定来源；仅代入封存修订稿，replay-input实读重登，review后local-proof绑定候选意见闭环；不发布'};
    },{coordination:true}),{coordination:true});
  }
  function localRevisionProof(root,id){
    const current=limitedRevisionState(root);if(!current)fail('LOCAL_REVISION_REQUIRED','候选修订凭据仅在限7修订区读取');const {m,s,p,spec}=current;
    const binding=(s.local_proofs??[]).find(b=>b.id===id);if(!binding||digest(root,binding.ref)!==binding.sha256)fail('LOCAL_REVISION_UNKNOWN','候选修订凭据缺失或哈希不符');
    const proof=json(safe(root,binding.ref),stateLimit);if(proof.kind!=='candidate-local-revision'||proof.session_id!==s.id||proof.project_id!==p.state.project_id||proof.unit!==spec.unit||proof.after_unit.sha256!==spec.replacement_sha256)fail('LOCAL_REVISION_UNKNOWN','候选修订凭据身份或范围不符');
    for(const b of [proof.before_body,proof.after_body,proof.frozen_report])if(!/^\.writer\/objects\/[a-f0-9-]+\.revision-(before|after|report)$/.test(b?.ref??'')||digest(root,b.ref)!==b.sha256)fail('LOCAL_REVISION_UNKNOWN','候选修订正文或实读报告归档缺失、损坏');
    if(!same(p.state.units[spec.unit-1],proof.after_unit)||digest(root,spec.draft)!==proof.after_unit.sha256)fail('LOCAL_REVISION_STALE','当前登记或正文已不同于候选修订凭据，须重新实读核查');
    return {...proof,binding:{ref:binding.ref,sha256:binding.sha256},scope:{from:spec.unit,through:spec.unit},publication:false};
  }
  function createLocalProof(root,input){
    keys(input,['expected_revision','expected_state_sha256','operation_id','review_ref']);const m=marker(root);if(!m)fail('LOCAL_REVISION_REQUIRED','先进入限7修订区');
    return withLock(m.parent,()=>withLock(root,()=>{
      const current=limitedRevisionState(root);if(!current)fail('LOCAL_REVISION_REQUIRED','此凭据不适用于普通修订或主稿');const {p,s,spec,original}=current;fresh(p);string(input.operation_id,'operation_id',100);
      const old=(s.local_proofs??[]).find(b=>b.operation_id===input.operation_id),fingerprint=hash(encoded(input));if(old){if(old.input_sha256!==fingerprint)fail('OPERATION_CONFLICT','候选凭据操作ID被不同输入复用');const saved=localRevisionProof(root,old.id);return {ok:true,unchanged:true,id:old.id,binding:saved.binding,publication:false};}
      if(p.state.revision!==input.expected_revision||digest(root,'.writer/state.json')!==input.expected_state_sha256)fail('REVISION_CHANGED','创建凭据前状态已变化');
      const after=p.state.units[spec.unit-1],before=original.units[spec.unit-1];if(p.state.units.length!==spec.unit||p.state.revision_scope||after?.sha256!==spec.replacement_sha256||after.sha256===before.sha256||after.replay_review?.base?.session_id!==s.id)fail('LOCAL_REVISION_NOT_READY','须先按封存SHA完成本章正式重登及replay复核');preserveObservations(original,p.state);
      const report=reviewStatus(p,true).current_records.find(r=>r.ref===input.review_ref&&r.from<=spec.unit&&r.to>=spec.unit);if(!report)fail('REVIEW_CURRENT_READING_REQUIRED','须有绑定当前新稿的有效实读报告，不能借用旧稿报告');
      const oldBody=bytes(m.parent,spec.draft),newBody=bytes(root,spec.draft),reportBody=bytes(root,report.report);if(!oldBody||hash(oldBody)!==before.sha256||!newBody||hash(newBody)!==after.sha256||!reportBody||hash(reportBody)!==report.report_sha256)fail('BASELINE_CONFLICT','凭据创建前旧稿、新稿或实读报告已改变');
      function freezeBody(b,suffix){const ref=`.writer/objects/${crypto.randomUUID()}.revision-${suffix}`;storeBytes(root,ref,b,true);return {ref,sha256:hash(b)};}
      const stateSha=digest(root,'.writer/state.json'),id=crypto.randomUUID(),ref=`.writer/objects/${crypto.randomUUID()}.json`,proof={kind:'candidate-local-revision',id,session_id:s.id,project_id:p.state.project_id,unit:spec.unit,before_unit:before,after_unit:after,before_body:freezeBody(oldBody,'before'),after_body:freezeBody(newBody,'after'),frozen_report:freezeBody(reportBody,'report'),review:{ref:report.ref,sha256:digest(root,report.ref)},state_sha256:stateSha,base_sha256:s.base_sha256,scope_label:'unpublished-candidate-only',publication:false};metadata(root,ref,proof,true);
      if(digest(root,'.writer/state.json')!==stateSha||digest(root,spec.draft)!==after.sha256)fail('BASELINE_CONFLICT','凭据创建期间正文或状态变化，保留未登记对象');
      s.local_proofs=[...(s.local_proofs??[]),{id,ref,sha256:digest(root,ref),operation_id:input.operation_id,input_sha256:fingerprint}];saveSession(m.parent,s);return {ok:true,id,binding:{ref,sha256:digest(root,ref)},scope:spec.scope,publication:false,note:'仅证明当前候选实际修订，不是主稿提交、文学通过或作者定稿'};
    },{continuationAction:'local-proof'}),{coordination:true});
  }
  function resume(root, input) {
    keys(input, ['id', 'token']); return withLock(root, () => { assertReady(root); const s = getOwned(root, input);
      if (!['open', 'editing', 'prepared', 'interrupted'].includes(s.status)) fail('REVISION_NOT_EDITING', '冲突或终态不能原地重置基线，原候选保留');
      s.status = 'editing'; delete s.prepared_sha256; saveSession(root, s); const base = baseline(root, s);
      return { ok: true, id: s.id, status: s.status, workspace: safe(root, `.writer/revisions/${s.id}/workspace`), base_revision: base.revision, scope: s.scope, note: '仅恢复原分支，不刷新基线或授权；提交仍须 CAS' };
    }, { coordination: true });
  }
  function abort(root, input) {
    keys(input, ['id', 'token', 'reason']); return withLock(root, () => { assertReady(root); const s = getOwned(root, input); string(input.reason, 'reason');
      if (s.status === 'committed') fail('REVISION_COMMITTED', '已提交只能新建逆向修订，不能回填旧 state');
      s.status = 'aborted'; s.reason = input.reason; saveSession(root, s); return { ok: true, id: s.id, status: s.status, candidate_preserved: true };
    }, { coordination: true });
  }
  function transfer(root, input) {
    keys(input, ['id', 'expected_session_sha256', 'owner', 'author_evidence', 'reason']);
    return withLock(root, () => { assertReady(root); const s = session(root, input.id); if (!ACTIVE.includes(s.status)) fail('REVISION_NOT_EDITING', '终态不能移交');
      if (digest(root, `.writer/revisions/${s.id}/session.json`) !== input.expected_session_sha256) fail('REVISION_CHANGED', '会话元数据已变化');
      string(input.owner, 'owner', 300); string(input.reason, 'reason');
      const proof = input.author_evidence; keys(proof, ['quote', 'local_source', 'source_sha256', 'locator', 'recorded_by']);
      string(proof.quote, 'quote'); string(proof.locator, 'locator'); string(proof.recorded_by, 'recorded_by');
      const proofFile = safe(root, proof.local_source); if (digest(root, proof.local_source) !== proof.source_sha256 || !text(proofFile).includes(proof.quote)) fail('AUTHOR_EVIDENCE_MISMATCH', '移交原话或哈希与本地来源不符');
      const frozenRef = `.writer/revisions/${s.id}/transfer-proof-${crypto.randomUUID()}.txt`; storeBytes(root, frozenRef, fs.readFileSync(proofFile), true);
      const evidence = { ...proof, frozen_ref: frozenRef }, token = crypto.randomBytes(32).toString('hex');
      const ref = `.writer/revisions/${s.id}/transfer-${crypto.randomUUID()}.json`; metadata(root, ref, { previous_owner: s.owner, owner: input.owner, reason: input.reason, evidence }, true);
      s.owner = input.owner; s.token_sha256 = hash(token); s.transfer = ref; if (s.status === 'prepared') { s.status = 'editing'; delete s.prepared_sha256; } saveSession(root, s);
      return { ok: true, id: s.id, token, owner: s.owner, candidate_preserved: true, base_unchanged: true };
    }, { coordination: true });
  }
  function prepare(root, input) {
    keys(input, ['id', 'token']); return withLock(root, () => {
      assertReady(root); const s = getOwned(root, input); if(['continuation','continuation-revision'].includes(s.kind))fail('CONTINUATION_PUBLICATION_BLOCKED','此批候选仅供采纳或限章修订，不支持发布或切换主稿'); if (!['open', 'editing'].includes(s.status)) fail('REVISION_NOT_EDITING', 'prepare 需要可编辑会话；已准备者可 commit 或先 resume');
      const base = baseline(root, s), main = parentUnchanged(root, s, base), workspace = safe(root, `.writer/revisions/${s.id}/workspace`), p = project(workspace);
      if (info(workspace)?.id !== s.id || p.state.project_id !== base.project_id) fail('REVISION_CORRUPT', '候选身份不符');
      fresh(p); gate(main, 'revise', s.scope.from, s.scope.through);
      const old = json(safe(root, `.writer/revisions/${s.id}/base-state.json`), stateLimit);
      if (p.state.units.length !== old.units.length || p.state.revision_scope || !same(p.state.units.slice(0, s.scope.from - 1), old.units.slice(0, s.scope.from - 1))) fail('REVISION_REPLAY_REQUIRED', '必须顺序重登原末章，保留范围前的登记与来源，不发布半份追踪');
      if (!same(p.state.governance, old.governance) || !same(p.state.decisions, old.decisions) || !same(p.config, main.config)) fail('REVISION_SCOPE_INVALID', '本批修订区不能更改作品配置、阶段授权或作者决策；应在主作品先登记范围');
      if (p.state.units.some((u, i) => u.draft !== old.units[i].draft)) fail('REVISION_SCOPE_INVALID', '本批须保留原章节相对路径，不自动改名或合并');
      preserveObservations(old, p.state);
      const reviews = reviewStatus(p); if (!reviews.current_records.some(r => r.from <= s.scope.from && r.to >= s.scope.through && r.revision_session === s.id)) fail('REVISION_REVIEW_REQUIRED', '需在独立区按最终字节实读整个修订尾段，并用 review 登记一次完整模型复核');
      for (const ref of extras(p)) if (!managed(ref) && (!externalDependency(ref) || !base.extra.includes(ref) || !Object.hasOwn(base.files, ref))) fail('REVISION_SCOPE_INVALID', `目录外来源未在本次基线固定，不能漏发或扩大修订：${ref}`);
      const target = structuredClone(p.state), branchHead = digest(workspace, '.writer/state.json');
      const commitId = crypto.randomUUID(), ref = `.writer/objects/${commitId}.json`;
      const record = { id: commitId, session_id: s.id, base_revision: base.revision, branch_revision: p.state.revision, branch_head_sha256: branchHead, scope: s.scope, build_id: loadedBuild, nature: 'revision-commit-not-literary-acceptance' };
      metadata(workspace, ref, record, true); target.revision = base.revision + 1; target.committed_revisions.push({ ref, sha256: digest(workspace, ref) });
      const tree = inventory(workspace, base.extra.filter(x => !x.startsWith('.writer/tool/'))), changes = [];
      for (const [file, nextHash] of Object.entries(tree)) {
        if (file === '.writer/state.json') continue;
        if (fs.statSync(safe(workspace, file)).nlink !== 1) fail('REVISION_UNSAFE_FILE', '候选不能使用硬链接');
        const before = base.files[file] ?? null; if (before === nextHash) continue;
        if (before && /^\.writer\/(objects|journal|reviews)\//.test(file)) fail('IMMUTABLE_OBJECT_CHANGED', `不可覆盖既有不可变对象：${file}`);
        if (file.startsWith('正文/') && !old.units.slice(s.scope.from - 1).some(u => u.draft === file)) fail('REVISION_SCOPE_INVALID', '正文改动超出声明尾段或含未登记新稿');
        changes.push({ file, before, after: nextHash });
      }
      for (const file of Object.keys(base.files).filter(x => !x.startsWith('.writer/tool/'))) if (!Object.hasOwn(tree, file)) fail('REVISION_DELETE_UNSUPPORTED', `本批不发布删除，请保留并明确处置：${file}`);
      changes.push({ file: '.writer/state.json', before: base.files['.writer/state.json'], after: hash(encoded(target)) });
      parentUnchanged(root, s, base);
      const prepared = { session_id: s.id, project_id: s.project_id, base_revision: base.revision, branch_head_sha256: branchHead, tree, changes, target_state: target, commit: record };
      metadata(root, `.writer/revisions/${s.id}/prepared.json`, prepared); s.prepared_sha256 = digest(root, `.writer/revisions/${s.id}/prepared.json`); s.status = 'prepared'; saveSession(root, s);
      return { ok: true, id: s.id, status: s.status, base_revision: base.revision, target_revision: target.revision, changes, ready: 'mechanical-and-process-only-not-literary-pass' };
    }, { coordination: true });
  }
  function txFile(tx) { return `.writer/transactions/${tx.id}/transaction.json`; }
  function saveTx(root, tx) { metadata(root, txFile(tx), tx); }
  function validateTx(root, tx) {
    if (tx.schema_version !== 1 || !UUID.test(tx.id ?? '') || !UUID.test(tx.session_id ?? '') || !Array.isArray(tx.plan) || hash(JSON.stringify(tx.plan)) !== tx.plan_sha256) fail('TRANSACTION_CORRUPT', '事务清单损坏');
    const s = session(root, tx.session_id), base = baseline(root, s), originalRef = `.writer/revisions/${s.id}/base-state.json`;
    if (digest(root, originalRef) !== base.files['.writer/state.json']) fail('TRANSACTION_CORRUPT', '事务原状态与固定基线不符');
    const original = json(safe(root, originalRef), stateLimit);
    if (original.project_id !== base.project_id || original.revision !== base.revision || !Array.isArray(base.extra)) fail('TRANSACTION_CORRUPT', '事务基线身份损坏');
    // A baseline inventory is not a directory grant: only explicitly consumed/planned files qualify.
    const fixed = new Set(dependencies(original).filter(ref => externalDependency(ref) && base.extra.includes(ref) && Object.hasOwn(base.files, ref)));
    const seen = new Set();
    for (const [i, row] of tx.plan.entries()) {
      if (!row || typeof row.file !== 'string') fail('TRANSACTION_CORRUPT', '事务目标损坏');
      if (!managed(row.file) && !fixed.has(row.file)) fail('TRANSACTION_CORRUPT', '事务目标重复或越界');
      const target = safe(root, row.file), identity = process.platform === 'win32' ? target.toLowerCase() : target;
      if (seen.has(identity)) fail('TRANSACTION_CORRUPT', '事务目标重复或越界'); seen.add(identity);
      if (row.before !== (base.files[row.file] ?? null)) fail('TRANSACTION_CORRUPT', '事务原字节与固定基线不符');
      for (const side of ['old', 'new']) {
        if (side === 'old' && row.before === null) continue;
        const expectedRef = `.writer/transactions/${tx.id}/${side}/${i}.bin`;
        if (row[`${side}_ref`] !== expectedRef || digest(root, expectedRef) !== (side === 'old' ? row.before : row.after)) fail('TRANSACTION_CORRUPT', '事务备份对象损坏');
      }
    }
    if (tx.plan.at(-1)?.file !== '.writer/state.json') fail('TRANSACTION_CORRUPT', '事务必须最后替换 state');
    // Terminal retries never publish again; an interrupted rollback may already have a newer prepare.
    if (!['completed', 'rolled-back'].includes(tx.status)) {
      const ref = `.writer/revisions/${s.id}/prepared.json`;
      const bound = s.prepared_sha256 ? digest(root, ref) === s.prepared_sha256 : ['committed', 'interrupted'].includes(s.status) && s.transaction_id === tx.id;
      if (!bound) fail('TRANSACTION_CORRUPT', '事务缺少原准备清单绑定');
      const prepared = json(safe(root, ref), stateLimit);
      if (prepared.session_id !== s.id || prepared.project_id !== base.project_id || prepared.base_revision !== base.revision || !same(prepared.commit?.scope, s.scope) || prepared.commit?.build_id !== base.build_id || !same(tx.plan.map(({file,before,after}) => ({file,before,after})), prepared.changes) || hash(encoded(prepared.target_state)) !== tx.plan.at(-1).after) fail('TRANSACTION_CORRUPT', '事务目标或状态与原准备清单不符');
    }
  }
  function publishFiles(root, tx, direction, hooks) {
    hooks.validate(root, tx); const conflicts = [];
    for (const row of tx.plan) { const actual = digest(root, row.file); if (actual !== row.before && actual !== row.after) {
      const current = bytes(root, row.file), ref = current === null ? null : `.writer/transactions/${tx.id}/external/${crypto.randomUUID()}.bin`;
      if (ref) storeBytes(root, ref, current, true); conflicts.push({ file: row.file, before: row.before, after: row.after, external_sha256: actual, external_ref: ref });
    } }
    if (conflicts.length) { tx.status = 'conflicted'; tx.conflicts = conflicts; saveTx(root, tx); fail('TRANSACTION_EXTERNAL_CONFLICT', '发现第三方字节，未开始本次恢复；旧、新、外部版本已保留，禁止用备份覆盖', { conflicts }); }
    tx.status = 'applying'; saveTx(root, tx); let applied = 0;
    // Both directions publish their state last; ordinary reads remain gated throughout.
    for (const row of tx.plan) {
      if(row.file==='.writer/state.json') hooks.beforeState?.(root,tx,direction);
      const desired = direction === 'complete' ? row.after : row.before, actual = digest(root, row.file);
      if (actual !== row.before && actual !== row.after) fail('TRANSACTION_EXTERNAL_CONFLICT', '替换前文件再次变化，保留现场');
      if (actual !== desired) {
        if (desired === null) fs.unlinkSync(safe(root, row.file));
        else storeBytes(root, row.file, bytes(root, direction === 'complete' ? row.new_ref : row.old_ref));
      }
      applied++;
      if (process.env.AI_WRITER_TEST_FAULT === '1' && Number(process.env[hooks.stopAfter??'AI_WRITER_TEST_STOP_AFTER']) === applied) process.exit(hooks.exitCode??91);
    }
    hooks.finalize(root,tx,direction);
    // The transaction remains pending until coordination metadata is durable too.
    tx.status = direction === 'complete' ? 'completed' : 'rolled-back'; tx.recovered_direction = direction; saveTx(root, tx);
    return { ok: true, transaction_id: tx.id, status: tx.status, ...(tx.session_id?{session_id:tx.session_id}:{}), revision: json(safe(root, '.writer/state.json'), stateLimit).revision, backups_preserved: true };
  }
  function apply(root,tx,direction){
    return publishFiles(root,tx,direction,{validate(root,tx){
      validateTx(root,tx);
      if(direction==='complete')preserveObservations(json(safe(root,`.writer/revisions/${tx.session_id}/base-state.json`),stateLimit),json(safe(root,tx.plan.at(-1).new_ref),stateLimit));
    },finalize(root,tx,direction){
      const s=session(root,tx.session_id);s.status=direction==='complete'?'committed':'interrupted';s.transaction_id=tx.id;delete s.prepared_sha256;saveSession(root,s);
      if(process.env.AI_WRITER_TEST_FAULT==='1'&&process.env.AI_WRITER_TEST_STOP_PHASE==='session-finalized')process.exit(92);
    }});
  }
  function commit(root, input) {
    keys(input, ['id', 'token']); return withLock(root, () => {
      assertReady(root); const s = getOwned(root, input);
      if(['continuation','continuation-revision'].includes(s.kind))fail('CONTINUATION_PUBLICATION_BLOCKED','此批候选不可提交或切换主稿');
      if (s.status === 'committed') return { ok: true, unchanged: true, id: s.id, transaction_id: s.transaction_id };
      if (s.status !== 'prepared') fail('REVISION_NOT_PREPARED', '先 prepare；修改 prepared 候选需 resume 后重新准备');
      const base = baseline(root, s); parentUnchanged(root, s, base);
      const ref = `.writer/revisions/${s.id}/prepared.json`; if (digest(root, ref) !== s.prepared_sha256) fail('REVISION_CORRUPT', '准备清单已变化');
      const prepared = json(safe(root, ref), stateLimit), workspace = safe(root, `.writer/revisions/${s.id}/workspace`);
      if (!same(inventory(workspace, base.extra.filter(x => !x.startsWith('.writer/tool/'))), prepared.tree)) fail('REVISION_CANDIDATE_CHANGED', 'prepare 后候选字节变化，先 resume 并重做实读/准备');
      fresh(project(workspace)); gate(project(root), 'revise', s.scope.from, s.scope.through);
      preserveObservations(json(safe(root,`.writer/revisions/${s.id}/base-state.json`),stateLimit),prepared.target_state);
      const tx = { schema_version: 1, id: crypto.randomUUID(), session_id: s.id, status: 'prepared', plan: [] };
      for (const [i, change] of prepared.changes.entries()) {
        const oldRef = `.writer/transactions/${tx.id}/old/${i}.bin`, newRef = `.writer/transactions/${tx.id}/new/${i}.bin`;
        if (digest(root, change.file) !== change.before) fail('BASELINE_CONFLICT', '事务准备期间主目标变化');
        if (change.before !== null) storeBytes(root, oldRef, bytes(root, change.file), true);
        const next = change.file === '.writer/state.json' ? encoded(prepared.target_state) : bytes(workspace, change.file);
        if (hash(next) !== change.after) fail('REVISION_CANDIDATE_CHANGED', '事务准备期间候选变化'); storeBytes(root, newRef, next, true);
        tx.plan.push({ ...change, old_ref: change.before === null ? null : oldRef, new_ref: newRef });
      }
      if (process.env.AI_WRITER_TEST_FAULT === '1' && process.env.AI_WRITER_TEST_STOP_PHASE === 'transaction-backups') process.exit(94);
      tx.plan_sha256 = hash(JSON.stringify(tx.plan)); parentUnchanged(root, s, base); saveTx(root, tx);
      if (process.env.AI_WRITER_TEST_FAULT === '1' && process.env.AI_WRITER_TEST_STOP_PHASE === 'transaction-prepared') process.exit(93);
      return apply(root, tx, 'complete');
    }, { coordination: true });
  }
  function recover(root, input) {
    keys(input, ['transaction_id', 'token', 'direction', 'lock_sha256', 'author_evidence']);
    if (!UUID.test(input.transaction_id ?? '') || !['complete', 'rollback'].includes(input.direction)) fail('REVISION_INPUT_INVALID', '恢复需有效事务 ID 与 complete/rollback');
    const tx = json(safe(root, `.writer/transactions/${input.transaction_id}/transaction.json`), stateLimit);if(tx.id!==input.transaction_id)fail('TRANSACTION_CORRUPT','事务ID与所在目录不符');if(tx.kind==='tool-update')fail('TOOL_RECOVERY_REQUIRED','工具事务需由外部tool recover恢复，不用修订所有者令牌');validateTx(root, tx); owner(session(root, tx.session_id), input.token);
    if (['completed', 'rolled-back'].includes(tx.status)) {
      if ((tx.status === 'completed') !== (input.direction === 'complete')) fail('TRANSACTION_TERMINAL', '终态不能反向回填；已提交撤销须新建修订');
      return { ok: true, unchanged: true, transaction_id: tx.id, status: tx.status };
    }
    releaseStaleLock(root, input);
    return withLock(root, () => {
      const current = json(safe(root, txFile(tx)), stateLimit); owner(session(root, current.session_id), input.token); validateTx(root, current);
      if (input.author_evidence) metadata(root, `.writer/transactions/${tx.id}/recovery-${crypto.randomUUID()}.json`, { direction: input.direction, evidence: input.author_evidence, lock_sha256: input.lock_sha256 ?? null }, true);
      return apply(root, current, input.direction);
    }, { coordination: true });
  }
  function releaseStaleLock(root, input) {
    const lockRef = '.writer/write.lock'; if (!fs.existsSync(safe(root, lockRef))) return;
    if (digest(root, lockRef) !== input.lock_sha256 || !input.author_evidence) fail('RECOVERY_LOCK_AUTH_REQUIRED', '遗留锁不自动删除；需实际 lock_sha256 和作者明确恢复授权');
    const lock = json(safe(root, lockRef)); let alive = true; try { process.kill(lock.pid, 0); } catch (e) { if (e.code === 'ESRCH') alive = false; }
    if (alive) fail('RECOVERY_OWNER_ALIVE', '原锁进程仍可见，不抢占正在运行的写入');
    const proof = input.author_evidence; keys(proof, ['quote', 'local_source', 'source_sha256', 'locator', 'recorded_by']);
    string(proof.quote, 'quote'); string(proof.locator, 'locator'); string(proof.recorded_by, 'recorded_by');
    const file = safe(root, proof.local_source); if (hash(fs.readFileSync(file)) !== proof.source_sha256 || !text(file).includes(proof.quote)) fail('AUTHOR_EVIDENCE_MISMATCH', '恢复原话与本地来源不符');
    const dir = `.writer/lock-recoveries/${crypto.randomUUID()}`;
    storeBytes(root, `${dir}/lock.json`, bytes(root, lockRef), true); storeBytes(root, `${dir}/author.txt`, fs.readFileSync(file), true);
    metadata(root, `${dir}/request.json`, { author_evidence: proof, lock_sha256: input.lock_sha256, reason: input.reason ?? 'explicit-transaction-recovery' }, true);
    if (digest(root, lockRef) !== input.lock_sha256) fail('RECOVERY_LOCK_CHANGED', '核对期间锁发生变化，保留现场'); fs.unlinkSync(safe(root, lockRef));
  }
  function unlock(root, input) {
    keys(input, ['id', 'token', 'lock_sha256', 'author_evidence', 'reason']); string(input.reason, 'reason');
    const active = sessions(root).filter(s => ACTIVE.includes(s.status)); if (active.length) { const s = getOwned(root, input); if (!ACTIVE.includes(s.status)) fail('REVISION_OWNER_REQUIRED', '需活跃会话所有者令牌'); }
    releaseStaleLock(root, input);
    return withLock(root, () => ({ ok: true, lock_recovered: true, transactions: transactions(root).filter(t => !['completed', 'rolled-back'].includes(t.status)).map(t => ({ id: t.id, status: t.status })), note: '仅处理明确授权的遗留锁；未完成事务仍需 recover，不绕过普通读写阻断' }), { coordination: true });
  }
  function replaySource(root, unit) {
    const m=marker(root); if(!m)fail('REVISION_REQUIRED','replay-input仅在独立修订区使用，先begin并在区内rewind');
    const s=session(m.parent,m.id); owner(s,getToken());
    if(s.kind==='continuation')fail('CONTINUATION_ACTION_BLOCKED','续写候选保留旧消费链，不提供旧章rewind/replay入口；新章使用revision adopt');
    if(s.kind==='continuation-revision'&&unit!==baseline(m.parent,s).limited_revision.unit)fail('LIMITED_REVISION_SCOPE','重登仅限第七章，不回放旧六章');
    if(!['open','editing'].includes(s.status)||s.build_id!==loadedBuild||runtime()!==loadedBuild)fail('REVISION_NOT_EDITING','原会话不可编辑或工具构建变化，保留候选后核实基线');
    const base=baseline(m.parent,s),ref=`.writer/revisions/${s.id}/base-state.json`;
    if(digest(m.parent,ref)!==base.files['.writer/state.json'])fail('REVISION_CORRUPT','原登记状态备份损坏');
    integer(unit,'unit',s.scope.from);if(unit>s.scope.through)fail('REVISION_SCOPE_INVALID','重登草案超出会话范围');
    return {session:s,base,state:json(safe(m.parent,ref),stateLimit)};
  }
  function publication(root,id) {
    if(!UUID.test(id??''))fail('REVISION_INPUT_INVALID','commit_id无效');const p=project(root);
    const binding=p.state.committed_revisions.find(b=>{const record=json(safe(root,b.ref));return record.id===id;});
    if(!binding||digest(root,binding.ref)!==binding.sha256)fail('REVISION_PUBLICATION_UNKNOWN','修订尚未正式提交，或提交对象损坏');
    const record=json(safe(root,binding.ref)),s=session(root,record.session_id);
    if(s.status!=='committed'||!UUID.test(s.transaction_id??''))fail('REVISION_PUBLICATION_UNKNOWN','缺少已完成的实际提交事务');
    const tx=json(safe(root,`.writer/transactions/${s.transaction_id}/transaction.json`),stateLimit);validateTx(root,tx);
    if(tx.status!=='completed'||tx.session_id!==s.id)fail('REVISION_PUBLICATION_UNKNOWN','事务尚未完成');
    const stateRow=tx.plan.find(x=>x.file==='.writer/state.json'),published=json(safe(root,stateRow.new_ref),stateLimit);
    if(!published.committed_revisions.some(b=>same(b,binding)))fail('REVISION_PUBLICATION_UNKNOWN','事务目标状态未包含此提交');
    return {...record,binding,transaction_id:tx.id,plan:tx.plan,state_refs:{before:{ref:stateRow.old_ref,sha256:stateRow.before},after:{ref:stateRow.new_ref,sha256:stateRow.after}}};
  }
  function list(root) { const parent = marker(root)?.parent ?? root; return { ok: true, sessions: sessions(parent).map(({ token_sha256, ...s }) => ({ ...s, session_sha256: digest(parent, `.writer/revisions/${s.id}/session.json`) })), transactions: transactions(parent).map(t => ({ id: t.id, session_id: t.session_id, status: t.status })), note: '令牌不在列表中返回；无自动超时抢占、合并、覆盖或清理' }; }
  return { assertReady, guardWrite, guardLoaded, info, preview, enable, begin, continueCandidate, repairContinuation, reviseContinuation, continuationState, limitedRevisionState, createLocalProof, localRevisionProof, resume, abort, transfer, prepare, commit, recover, unlock, list, loadedBuild, replaySource, publication,
    fileTransactions:{bytes,digest,storeBytes,metadata,encoded,inventory,extras,sessions,transactions,publishFiles,releaseStaleLock,saveTx} };
}
