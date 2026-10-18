import fs from 'node:fs';

// Candidates are deliberately advisory; detecting a pattern is not a verdict.
const patterns = [
  ['template-expression', /深吸一口气|眼中闪过一丝|嘴角勾起一抹|缓缓开口/g, '检查是否成片重复、是否承担具体动作或人物特征；成立的表达保留。'],
  ['sentence-pattern', /不是[^。！？\n]{1,70}而是/g, '核对对比是否传达辨认、辩解或情绪递进；不要因为句式命中而删除。'],
  ['emotion-summary', /一丝.{0,8}(?:涌上心头|浮上心头)|心中(?:涌起|升起)一股/g, '实读情绪诱因与后果，判断有无重复解释或套式反应。'],
  ['over-explanation', /(?:她|他|他们|她们)不知道的是|命运的齿轮|故事才刚刚开始/g, '核对叙述视角、信息权限及是否提前揭底；不自动改变叙述方式。']
];
export function createStyleTools({ project, safe, text, hash, string }) {
  return function scan(root, draft, out) {
    const p = project(root);
    if (!draft?.startsWith('正文/') || !/\.(md|txt)$/i.test(draft)) throw new Error('draft 必须是 正文/ 下的 .md 或 .txt 文件');
    const file = safe(p.root, draft), sourceHash = hash(fs.readFileSync(file)), body = text(file);
    string(body, '正文', 1024 * 1024);
    const candidates = [], lines = body.split(/\r?\n/), paragraphs = [];
    let fenced = false, skipped = 0, paragraph = null;
    const flushParagraph = () => { if (paragraph) paragraphs.push(paragraph); paragraph = null; };
    lines.forEach((line, index) => {
      if (/^\s*```/.test(line)) { flushParagraph(); fenced = !fenced; skipped++; return; }
      if (fenced || /^\s*>/.test(line)) { flushParagraph(); skipped++; return; }
      if (!line.trim() || /^\s*#/.test(line)) { flushParagraph(); return; }
      if (!paragraph) paragraph = { line: index + 1, length: 0 };
      paragraph.length += [...line.trim()].length;
      for (const [category, pattern, reason] of patterns) {
        pattern.lastIndex = 0;
        for (const match of line.matchAll(pattern)) candidates.push({ category, line: index + 1, column: match.index + 1, quote: match[0], context: line.slice(Math.max(0, match.index - 60), match.index + match[0].length + 60), reason, advisory: true });
      }
    });
    flushParagraph();
    for (let i = 0; i + 3 < paragraphs.length; i += 4) {
      const window = paragraphs.slice(i, i + 4), sizes = window.map(row => row.length), mean = sizes.reduce((a, b) => a + b, 0) / 4;
      if (Math.min(...sizes) >= 30 && (Math.max(...sizes) - Math.min(...sizes)) / mean <= 0.1) candidates.push({ category: 'uniform-rhythm', line: window[0].line, through_line: window[3].line, lengths: sizes, reason: '段长接近仅是线索，须实读节奏是否单调，不能机械拆段。', advisory: true });
    }
    const result = { ok: true, scope: 'advisory-pattern-scan', kind: p.config.kind, draft, source_sha256: sourceHash,
      quality_verdict: 'requires-contextual-reading', candidates, candidate_count: candidates.length,
      manual_review: ['情绪因果与人物反应', '对白的身份、目的及人物差异', '收尾功能与跨章重复', '解释是否必要与视角权限', '事实、人物声音与正常修辞是否被误伤'],
      skipped_quote_or_code_lines: skipped,
      note: '命中不等于错误，零命中不代表没有问题；不提供 AI 概率或固定删减比例。历史引文和事实边界优先。' };
    if (hash(fs.readFileSync(file)) !== sourceHash) throw new Error('扫描期间正文已变化，请按新版本重扫');
    if (out !== undefined) {
      if (!out.startsWith('审查/') || !out.endsWith('.json')) throw new Error('out 必须是 审查/ 下的全新 .json 文件');
      const target = safe(p.root, out);
      // No overwrite: previous reports remain bound to their original manuscript.
      fs.writeFileSync(target, JSON.stringify(result, null, 2) + '\n', { flag: 'wx', encoding: 'utf8' });
    }
    return result;
  };
}
