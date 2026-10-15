import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { cleanKeys } from './journal.mjs';

export function createLongform(api) {
  const { project, safe, json, text, hash, atomic, withLock, fresh, string, strings, integer, fail, object } = api;
  const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
  const unitId = n => String(n).padStart(4, '0');
  function long(p) { if (p.state.schema_version !== 2) fail('先用 long-enable 备份并启用长篇协议'); }
  function volumes(p) {
    const dir = safe(p.root, '大纲/分卷');
    return fs.existsSync(dir) ? fs.readdirSync(dir).filter(x => x.endsWith('.json')).sort().map(x => ({ ref: `大纲/分卷/${x}`, value: json(safe(p.root, `大纲/分卷/${x}`)) })) : [];
  }
  function volumeData(value) {
    cleanKeys(value);
    if (!object(value) || !/^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$/.test(value.id ?? '')) fail('卷 id 必须是 1–64 位字母数字及 _-');
    string(value.title, '卷名', 300); integer(value.start, 'start'); integer(value.end, 'end', value.start);
    strings(value.promises, 'promises'); strings(value.constraints, 'constraints'); strings(value.reserved, 'reserved');
    if (!Array.isArray(value.arcs) || !value.arcs.length) fail('卷内至少有一个剧情单元 arcs');
    const ids = new Set();
    let last = value.start - 1;
    for (const arc of value.arcs) {
      string(arc.id, 'arc.id', 100); if (ids.has(arc.id)) fail('剧情单元 ID 重复'); ids.add(arc.id);
      integer(arc.start, 'arc.start', value.start); integer(arc.end, 'arc.end', arc.start);
      if (arc.start !== last + 1 || arc.end > value.end) fail('剧情单元范围须连续覆盖全卷且不重叠');
      string(arc.goal, 'arc.goal'); string(arc.payoff, 'arc.payoff'); strings(arc.forbidden ?? [], 'arc.forbidden');
      last = arc.end;
    }
    if (last !== value.end) fail('剧情单元没有覆盖到卷末');
    return value;
  }
  function saveVolume(root, value) {
    return withLock(root, () => {
      const p = project(root); long(p); volumeData(value);
      for (const other of volumes(p)) if (other.value.id !== value.id && value.start <= other.value.end && value.end >= other.value.start) fail('分卷范围重叠');
      const ref = `大纲/分卷/${value.id}.json`;
      if (p.state.units.some(u => Object.hasOwn(u.source_hashes, ref))) fail('此卷纲已用于正文。先核实修订影响并 rewind 最早受影响单元，再修改');
      fs.mkdirSync(safe(p.root, '大纲/分卷'), { recursive: true }); atomic(safe(p.root, ref), value);
      return { ok: true, ref, status: 'plan-only' };
    });
  }
  function outline(p, unit) {
    const candidates = volumes(p).map(row => ({ ...row, value: volumeData(row.value) })).filter(x => unit >= x.value.start && unit <= x.value.end);
    if (candidates.length !== 1) fail(`单元 ${unit} 必须唯一归属一份分卷计划，实际 ${candidates.length} 份`);
    const { ref, value } = candidates[0], arc = value.arcs.find(x => unit >= x.start && unit <= x.end);
    return { ref, volume: { id: value.id, title: value.title, start: value.start, end: value.end,
      promises: value.promises, constraints: value.constraints, reserved: value.reserved }, arc,
      note: '全部是计划；兑现情况须在正文、ledger 及审查中核实' };
  }
  function validatePlan(p, result, input) {
    if (p.state.schema_version !== 2) return result;
    strings(input.recall_ids ?? [], 'recall_ids');
    return { ...result, recall_ids: input.recall_ids ?? [], ...(input.arc_id ? { arc_id: string(input.arc_id, 'arc_id', 100) } : {}) };
  }
  function anchored(p, evidence, unit, draft) {
    if (!object(evidence)) fail('evidence 必须是对象');
    integer(evidence.unit, 'evidence.unit'); string(evidence.quote, 'evidence.quote', 2000);
    if (evidence.unit > unit) fail('证据不能指向未来章节');
    const ref = evidence.unit === unit ? draft : p.state.units.find(u => u.unit === evidence.unit)?.draft;
    if (!ref) fail('证据单元尚未登记');
    const body = text(safe(p.root, ref));
    const at = body.indexOf(evidence.quote);
    if (at < 0) fail(`正文找不到证据引文：单元 ${evidence.unit}`);
    return { unit: evidence.unit, draft: ref, sha256: hash(fs.readFileSync(safe(p.root, ref))),
      line: body.slice(0, at).split(/\r?\n/).length, quote: evidence.quote };
  }
  function ledgerChange(p, existing, input, id, unit, draft) {
    if (!/^[A-Za-z0-9][A-Za-z0-9_-]{0,99}$/.test(id) || !object(input)) fail('ledger ID/条目无效');
    const allowed = ['type', 'statement', 'status', 'cast', 'tags', 'due_unit', 'pinned', 'author_truth', 'reader_known', 'character_known', 'custody', 'previous_holder', 'evidence'];
    if (Object.keys(input).some(k => !allowed.includes(k))) fail(`ledger ${id} 有未知字段`);
    const next = { ...existing, ...input };
    if (input.character_known) next.character_known = { ...(existing?.character_known ?? {}), ...input.character_known };
    if (!['fact', 'thread', 'object', 'relationship', 'observation'].includes(next.type)) fail('ledger.type 无效');
    if (!['active', 'pending', 'partial', 'resolved', 'intentional-open'].includes(next.status)) fail('ledger.status 无效');
    string(next.statement, 'ledger.statement', 4000);
    strings(next.cast ?? [], 'ledger.cast'); strings(next.tags ?? [], 'ledger.tags');
    if (next.due_unit != null) integer(next.due_unit, 'due_unit');
    if (next.pinned != null && typeof next.pinned !== 'boolean') fail('pinned 必须是布尔值');
    if (next.author_truth != null) string(next.author_truth, 'author_truth', 4000);
    if (next.reader_known != null) string(next.reader_known, 'reader_known', 4000);
    if (next.character_known != null) {
      if (!object(next.character_known)) fail('character_known 必须是人物到已知信息的映射');
      for (const [name, known] of Object.entries(next.character_known)) { string(name, 'name', 100); string(known, 'known', 4000); }
    }
    if (next.type === 'object') {
      if (!object(next.custody)) fail('物证条目必须包含 custody 的 holder/location/condition');
      for (const field of ['holder', 'location', 'condition']) string(next.custody[field], `custody.${field}`, 1000);
      if (existing?.custody && next.custody.holder !== existing.custody.holder && input.previous_holder !== existing.custody.holder) fail(`ledger.${id}.previous_holder 必须与 custody 同级，并等于当前保管人“${existing.custody.holder}”；不能填在 custody 内`);
    }
    if (existing?.type === 'observation' && ['type', 'statement', 'author_truth'].some(k => !same(existing[k], next[k]))) fail('既有观察不可改写；新增证据应建立另一条 ledger 解释/修正条目');
    if (!Array.isArray(input.evidence) || !input.evidence.length) fail(`ledger ${id} 更新必须有正文 evidence；计划不能登记成事实`);
    const anchors = input.evidence.map(e => anchored(p, e, unit, draft));
    if (!anchors.some(e => e.unit === unit)) fail('当前变化至少需要一条本章证据');
    const all = [...(existing?.evidence ?? []), ...anchors];
    next.evidence = all.filter((e, i) => all.findIndex(x => same(x, e)) === i);
    return { ...next, cast: next.cast ?? [], tags: next.tags ?? [], introduced_unit: existing?.introduced_unit ?? unit, updated_unit: unit };
  }
  function snapshot(p, value, unit, draft) {
    if (!value.changes) {
      if (p.state.schema_version === 2) fail('长篇登记只接受 changes；不能用 context 的召回切片作为完整 snapshot 覆盖账本 ledger');
      if (!same(value.snapshot?.ledger, p.state.snapshot.ledger)) fail('ledger 只能用 changes.ledger 更新，以保留证据和不可变观察');
      return value.snapshot;
    }
    long(p); cleanKeys(value.changes);
    if (value.snapshot !== undefined || !object(value.changes)) fail('snapshot 与 changes 只能选择一种');
    const changes = value.changes;
    if (Object.keys(changes).some(k => !['characters', 'retire_characters', 'threads', 'timeline_append', 'ledger'].includes(k))) fail('changes 有未知字段');
    const next = structuredClone(p.state.snapshot);
    if (changes.characters) {
      if (!object(changes.characters)) fail('changes.characters 必须是对象');
      for (const [name, state] of Object.entries(changes.characters)) { string(name, '角色名'); string(state, '角色状态'); next.characters[name] = state; }
    }
    for (const name of strings(changes.retire_characters ?? [], 'retire_characters')) {
      if (Object.hasOwn(changes.characters ?? {}, name)) fail('不能同时更新和退役角色');
      if (!Object.hasOwn(next.characters, name)) fail('退役角色不存在');
      delete next.characters[name];
    }
    if (changes.threads !== undefined) next.threads = strings(changes.threads, 'threads');
    next.timeline.push(...strings(changes.timeline_append ?? [], 'timeline_append'));
    if (changes.ledger !== undefined) {
      if (!object(changes.ledger)) fail('changes.ledger 必须是对象');
      next.ledger ??= {};
      for (const [id, entry] of Object.entries(changes.ledger)) next.ledger[id] = ledgerChange(p, next.ledger[id], entry, id, unit, draft);
    }
    return next;
  }
  function packet(p, plan, unit) {
    if (p.state.schema_version !== 2) return {};
    const selected = outline(p, unit);
    if (plan.arc_id && plan.arc_id !== selected.arc.id) fail('细纲 arc_id 与分卷范围不一致');
    const ledger = p.state.snapshot.ledger ?? {}, explicit = new Set(plan.recall_ids), cast = new Set(plan.cast);
    for (const id of explicit) if (!Object.hasOwn(ledger, id)) fail(`recall_ids 找不到已登记条目：${id}`);
    const reasons = {}, chosen = {}, omitted = [], optional = [];
    for (const [id, entry] of Object.entries(ledger)) {
      const why = [];
      if (entry.pinned) why.push('pinned');
      if (explicit.has(id)) why.push('explicit');
      if (entry.due_unit != null && entry.due_unit <= unit && !['resolved', 'intentional-open'].includes(entry.status)) why.push('due');
      if (why.length) { chosen[id] = entry; reasons[id] = why; continue; }
      if (!['resolved', 'intentional-open'].includes(entry.status) && entry.cast.some(name => cast.has(name))) why.push('cast');
      if (entry.updated_unit >= unit - 3) why.push('recent');
      if (why.length) optional.push({ id, entry, why }); else omitted.push(id);
    }
    optional.sort((a, b) => b.entry.updated_unit - a.entry.updated_unit || a.id.localeCompare(b.id));
    for (const [i, row] of optional.entries()) {
      if (i < 12) { chosen[row.id] = row.entry; reasons[row.id] = row.why; } else omitted.push(row.id);
    }
    const characters = Object.fromEntries(plan.cast.filter(name => Object.hasOwn(p.state.snapshot.characters, name)).map(name => [name, p.state.snapshot.characters[name]]));
    const author = Object.fromEntries(Object.entries(chosen).map(([id, e]) => {
      const anchors = e.evidence.filter((_, i) => i === 0 || i >= e.evidence.length - 2);
      return [id, { type: e.type, statement: e.statement, truth: e.author_truth ?? null, status: e.status,
        ...(e.custody ? { custody: e.custody } : {}), due_unit: e.due_unit ?? null,
        evidence: anchors, evidence_omitted: e.evidence.length - anchors.length }];
    }));
    const reader = Object.fromEntries(Object.entries(chosen).filter(([, e]) => e.reader_known).map(([id, e]) => [id, e.reader_known]));
    const knowledge = Object.fromEntries(plan.cast.map(name => [name, Object.fromEntries(Object.entries(chosen).filter(([, e]) => e.character_known?.[name]).map(([id, e]) => [id, e.character_known[name]]))]));
    return { outline: selected, snapshot: { characters, threads: p.state.snapshot.threads, timeline: p.state.snapshot.timeline.slice(-6) },
      continuity: { author, reader, characters: knowledge, recall: { selected: reasons, omitted_ids: omitted, total: Object.keys(ledger).length, optional_limit: 12 },
        instruction: '作者真相只供创作核对。人物只能使用其已知信息；无人物条目表示未登记，不能据此断定其知道或不知道。召回摘要不能代替相关正文复读。' } };
  }
  function recall(root, query, limit = 20) {
    const p = project(root); fresh(p); string(query, 'query', 1000); integer(limit, 'limit');
    if (limit > 100) fail('limit 最多 100');
    const terms = query.toLocaleLowerCase().split(/\s+/), matches = [];
    for (const [id, entry] of Object.entries(p.state.snapshot.ledger ?? {})) if (terms.every(t => `${id} ${JSON.stringify(entry)}`.toLocaleLowerCase().includes(t))) matches.push({ kind: 'ledger', id, entry });
    for (const u of p.state.units) if (terms.every(t => `${u.unit} ${u.summary}`.toLocaleLowerCase().includes(t))) matches.push({ kind: 'unit', unit: u.unit, summary: u.summary, draft: u.draft, sha256: u.sha256 });
    return { ok: true, query, matches: matches.slice(0, limit), total: matches.length, omitted: Math.max(0, matches.length - limit), note: '关键词定位，不代表已经阅读原文或语义检索完整' };
  }
  function review(root, input) {
    return withLock(root, () => {
      const p = project(root); fresh(p);
      integer(input.from, 'from'); integer(input.to, 'to', input.from);
      if (input.to > p.state.units.length) fail('审查范围超过已登记正文');
      if (input.kind !== 'model-self-review') fail('此自动流程只登记 model-self-review，不生成真人验收记录');
      if (!input.report?.startsWith('审查/')) fail('report 必须在 审查/ 下');
      string(text(safe(root, input.report)), '审查报告');
      const units = p.state.units.slice(input.from - 1, input.to).map(u => ({ unit: u.unit, draft: u.draft, sha256: u.sha256 }));
      if (!object(input.source_hashes) || Object.keys(input.source_hashes).length !== units.length || units.some(u => input.source_hashes[u.draft] !== u.sha256)) fail('审查正文哈希不符；按实际阅读版本重新审查');
      const ref = `.writer/reviews/${crypto.randomUUID()}.json`; fs.mkdirSync(safe(root, '.writer/reviews'), { recursive: true });
      atomic(safe(root, ref), { from: input.from, to: input.to, kind: input.kind, report: input.report, report_sha256: hash(fs.readFileSync(safe(root, input.report))), units });
      return { ok: true, ref, coverage: [input.from, input.to], quality: 'review-recorded-not-acceptance' };
    });
  }
  function reviewStatus(p) {
    const dir = safe(p.root, '.writer/reviews'), records = fs.existsSync(dir) ? fs.readdirSync(dir).filter(x => x.endsWith('.json')).map(x => json(safe(p.root, `.writer/reviews/${x}`))) : [];
    const valid = records.filter(r => fs.existsSync(safe(p.root, r.report)) && hash(fs.readFileSync(safe(p.root, r.report))) === r.report_sha256 && r.units.every(u => p.state.units[u.unit - 1]?.sha256 === u.sha256 && fs.existsSync(safe(p.root, u.draft)) && hash(fs.readFileSync(safe(p.root, u.draft))) === u.sha256));
    const windows = [];
    for (let end = 3; end <= p.state.units.length; end += 3) {
      const from = Math.max(1, end - 5);
      if (!valid.some(r => r.from <= from && r.to >= end)) windows.push({ from, to: end });
    }
    return { valid: valid.length, stale: records.length - valid.length, pending_windows: windows, nature: 'coverage-only-not-literary-pass' };
  }
  function importIndex(root, input) {
    return withLock(root, () => {
      const p = project(root); long(p);
      if (p.state.units.length || fs.existsSync(safe(root, '.writer/import.json'))) fail('导入只在空作品建立一次，已存在时使用 import-status/import-next 续跑');
      if (!Array.isArray(input.files) || !input.files.length) fail('files 必须是明确排序的分章源文件路径');
      string(input.rights, 'rights 声明', 1000);
      const sources = input.files.map((source, i) => {
        string(source, 'source path', 1000);
        const absolute = path.resolve(source);
        if (fs.lstatSync(absolute).isSymbolicLink() || !fs.statSync(absolute).isFile()) fail('导入源须为普通文件');
        if (!/\.(md|txt)$/i.test(absolute)) fail('只支持 UTF-8 Markdown/TXT 分章文件，合订本须先明确拆章');
        const value = text(absolute), bytes = fs.readFileSync(absolute);
        if (!value.trim()) fail('导入源为空');
        return { unit: i + 1, original: absolute, sha256: hash(bytes), bytes, copy: `.writer/import-source/${unitId(i + 1)}${path.extname(absolute).toLowerCase()}` };
      });
      if (new Set(sources.map(x => x.original.toLowerCase())).size !== sources.length) fail('导入源重复');
      // Unique batch directory means a failed first attempt leaves inspectable orphans, never partial authority.
      const batch = crypto.randomUUID(), dir = `.writer/import-source/${batch}`;
      fs.mkdirSync(safe(root, dir), { recursive: true });
      for (const row of sources) { row.copy = `${dir}/${path.basename(row.copy)}`; fs.writeFileSync(safe(root, row.copy), row.bytes, { flag: 'wx' }); }
      const manifest = { schema_version: 1, role: 'own-work-continuation-baseline', rights: input.rights,
        sources: sources.map(({ bytes, ...row }) => row) };
      atomic(safe(root, '.writer/import.json'), manifest);
      return { ok: true, units: sources.length, next: '分卷规划后 import-next，逐章阅读并登记；未读部分不算分析完成' };
    });
  }
  function importStatus(root) {
    const p = project(root), manifest = json(safe(root, '.writer/import.json'));
    const changed = manifest.sources.filter(row => !fs.existsSync(safe(root, row.copy)) || hash(fs.readFileSync(safe(root, row.copy))) !== row.sha256).map(row => row.unit);
    const originalChanged = manifest.sources.filter(row => !fs.existsSync(row.original) || hash(fs.readFileSync(row.original)) !== row.sha256).map(row => row.unit);
    const recorded = manifest.sources.filter(row => p.state.units[row.unit - 1]).map(row => row.unit);
    const unchanged = manifest.sources.filter(row => p.state.units[row.unit - 1]?.sha256 === row.sha256).map(row => row.unit);
    return { ok: !changed.length, total: manifest.sources.length, registered_units: recorded, unread_or_unregistered: manifest.sources.filter(row => !recorded.includes(row.unit)).map(row => row.unit),
      unchanged_baseline_units: unchanged, baseline_registered_through: p.state.imported_through ?? 0,
      changed_copies: changed, changed_originals: originalChanged, role: manifest.role, note: '源文件变化不自动覆盖副本；登记只是填写者声明的阅读与草稿追踪' };
  }
  function importNext(root) {
    return withLock(root, () => {
      const p = project(root); fresh(p); long(p);
      const manifest = json(safe(root, '.writer/import.json')), unit = p.state.units.length + 1;
      const row = manifest.sources.find(x => x.unit === unit);
      if (!row) fail('导入范围已结束，可以按正常创作续写');
      if (hash(fs.readFileSync(safe(root, row.copy))) !== row.sha256) fail('导入副本哈希变化，保留现场');
      if (!fs.existsSync(row.original) || hash(fs.readFileSync(row.original)) !== row.sha256) fail('导入原文件已变化或缺失，先核实版本；不静默混用版本');
      const draft = `正文/${unitId(unit)}-导入${path.extname(row.copy)}`, target = safe(root, draft);
      if (fs.existsSync(target)) {
        if (hash(fs.readFileSync(target)) !== row.sha256) fail('导入目标已存在且内容不同，不覆盖');
      } else fs.copyFileSync(safe(root, row.copy), target, fs.constants.COPYFILE_EXCL);
      return { ok: true, unit, draft, sha256: row.sha256, next: '实际阅读本章，保存细纲，获取 context/record-template 并登记真实摘要与 changes；然后再 import-next' };
    });
  }
  function importGuard(p, unit, draft) {
    const ref = safe(p.root, '.writer/import.json');
    if (!fs.existsSync(ref)) return;
    const row = json(ref).sources.find(x => x.unit === unit);
    if (row && unit > (p.state.imported_through ?? 0) && hash(fs.readFileSync(safe(p.root, draft))) !== row.sha256) fail('导入登记正文与冻结副本不同，先完成原稿基线登记再按 rewind 修订');
    return row?.unit;
  }
  function inputRefs(p, unit) {
    const ref = safe(p.root, '.writer/import.json');
    if (!fs.existsSync(ref)) return [];
    const row = json(ref).sources.find(x => x.unit === unit);
    return ['.writer/import.json', ...(row ? [row.copy] : [])];
  }
  return { saveVolume, outline, validatePlan, snapshot, packet, recall, review, reviewStatus, importIndex, importStatus, importNext, importGuard, inputRefs };
}
