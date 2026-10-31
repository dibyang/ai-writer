"use strict";

const fs = require("fs");
const path = require("path");
const { defaultRulePackId, pluginRoot } = require("./lib");

const SYSTEM_TERMS = [
  "复核",
  "报告",
  "屏幕",
  "证据链",
  "案前",
  "归档",
  "标注",
  "删改",
  "封存",
  "程序",
  "权限",
  "档案",
  "记录"
];

const LIVE_PRESSURE_TERMS = [
  "手",
  "眼",
  "喉",
  "胃",
  "血",
  "汗",
  "门",
  "纸",
  "刀",
  "灯",
  "风",
  "疼",
  "抖",
  "停",
  "签",
  "退",
  "藏",
  "押"
];

function relativeRef(file) {
  const root = path.resolve(pluginRoot(), "..", "..");
  return path.relative(root, path.resolve(file)).replace(/\\/g, "/");
}

function countTerms(text, terms) {
  const counts = {};
  for (const term of terms) {
    const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const matches = text.match(new RegExp(escaped, "g"));
    if (matches && matches.length > 0) counts[term] = matches.length;
  }
  return counts;
}

function countDialogueLines(text) {
  return text.split(/\r?\n/).filter(line => /[“"「『]/.test(line)).length;
}

function inspectChapter(file) {
  const text = fs.readFileSync(file, "utf8");
  const chars = Array.from(text.replace(/\s/g, "")).length;
  const systemCounts = countTerms(text, SYSTEM_TERMS);
  const liveCounts = countTerms(text, LIVE_PRESSURE_TERMS);
  const systemTotal = Object.values(systemCounts).reduce((sum, value) => sum + value, 0);
  const liveTotal = Object.values(liveCounts).reduce((sum, value) => sum + value, 0);
  return {
    file: relativeRef(file),
    chars,
    lines: text.split(/\r?\n/).length,
    dialogue_lines: countDialogueLines(text),
    system_term_total: systemTotal,
    live_pressure_total: liveTotal,
    system_density_per_1000_chars: chars === 0 ? 0 : Number((systemTotal * 1000 / chars).toFixed(2)),
    live_pressure_per_1000_chars: chars === 0 ? 0 : Number((liveTotal * 1000 / chars).toFixed(2)),
    top_system_terms: systemCounts,
    top_live_pressure_terms: liveCounts
  };
}

function makeFinding(ruleId, severity, location, recommendation, sourceRefs = ["docs/traceability.md#SGM-MKT-001"]) {
  return {
    rule_id: ruleId,
    severity,
    location,
    recommendation,
    source_refs: sourceRefs
  };
}

function evaluateBatch(files, options = {}) {
  const chapters = files.map(file => inspectChapter(file));
  const findings = [];
  for (const chapter of chapters) {
    if (chapter.system_density_per_1000_chars > 22 && chapter.live_pressure_per_1000_chars < 35) {
      findings.push(makeFinding(
        "SGM-MKT-001-R002",
        "high",
        chapter.file,
        "System/procedure language is dense while live physical pressure is low; add immediate human cost, visible object pressure, or changed behavior before treating this as page-turner ready."
      ));
    }
    if (chapter.dialogue_lines < 2) {
      findings.push(makeFinding(
        "SGM-READ-001-R002",
        "medium",
        chapter.file,
        "Dialogue or human exchange is sparse; verify the chapter still gives readers a living-person handle instead of only report reconciliation.",
        ["docs/traceability.md#SGM-READ-001"]
      ));
    }
  }
  return {
    report_id: options.reportId || "sgm-script-chapter-batch-metrics",
    module_id: "SGM-MKT-001",
    mode: "novel",
    rule_pack: options.rulePack || defaultRulePackId(),
    target_refs: chapters.map(item => item.file),
    source_refs: [
      "docs/traceability.md#SGM-MKT-001",
      "docs/traceability.md#SGM-READ-001"
    ],
    verdict: findings.some(item => item.severity === "high" || item.severity === "blocker") ? "needs_polish" : "pass",
    findings,
    metrics: chapters
  };
}

function parseArgs(argv) {
  const args = { files: [], out: null, rulePack: null };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--out") {
      args.out = argv[++i];
    } else if (arg === "--rule-pack") {
      args.rulePack = argv[++i];
    } else {
      args.files.push(arg);
    }
  }
  return args;
}

function run(argv = process.argv.slice(2)) {
  const args = parseArgs(argv);
  if (args.files.length === 0) {
    console.error("Usage: node scripts/chapter-batch-metrics.js <chapter.md...> [--rule-pack name@version] [--out report.json]");
    return 2;
  }
  const files = args.files.map(file => path.isAbsolute(file) ? file : path.resolve(process.cwd(), file));
  for (const file of files) {
    if (!fs.existsSync(file)) {
      console.error(`Chapter file not found: ${file}`);
      return 2;
    }
  }
  const report = evaluateBatch(files, { rulePack: args.rulePack });
  const json = JSON.stringify(report, null, 2);
  if (args.out) {
    const out = path.isAbsolute(args.out) ? args.out : path.resolve(process.cwd(), args.out);
    fs.mkdirSync(path.dirname(out), { recursive: true });
    fs.writeFileSync(out, `${json}\n`, "utf8");
  } else {
    console.log(json);
  }
  return report.verdict === "pass" ? 0 : 1;
}

if (require.main === module) {
  process.exitCode = run();
}

module.exports = { evaluateBatch, inspectChapter, run };
