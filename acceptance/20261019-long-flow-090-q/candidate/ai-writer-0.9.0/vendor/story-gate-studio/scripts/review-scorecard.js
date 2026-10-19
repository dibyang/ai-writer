"use strict";

const fs = require("fs");
const path = require("path");
const { defaultRulePackId, pluginRoot } = require("./lib");

const SYSTEM_TERMS = [
  "procedure",
  "report",
  "archive",
  "screen",
  "evidence chain",
  "permission",
  "record",
  "configuration",
  "结构",
  "程序",
  "报告",
  "证据链",
  "归档",
  "权限",
  "记录"
];

const LIVE_TERMS = [
  "hand",
  "door",
  "page",
  "brother",
  "lamp",
  "ink",
  "name",
  "guard",
  "blood",
  "breath",
  "手",
  "门",
  "纸",
  "灯",
  "血",
  "疼",
  "眼",
  "喉"
];

function relativeRef(file) {
  const root = path.resolve(pluginRoot(), "..", "..");
  return path.relative(root, path.resolve(file)).replace(/\\/g, "/");
}

function countTerms(text, terms) {
  let total = 0;
  for (const term of terms) {
    const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const matches = text.match(new RegExp(escaped, "gi"));
    total += matches ? matches.length : 0;
  }
  return total;
}

function countDialogueLines(text) {
  return text.split(/\r?\n/).filter(line => /[“"「『]/.test(line)).length;
}

function clamp(value) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function inspectDraft(file) {
  const text = fs.readFileSync(file, "utf8");
  const chars = Array.from(text.replace(/\s/g, "")).length;
  const systemTerms = countTerms(text, SYSTEM_TERMS);
  const liveTerms = countTerms(text, LIVE_TERMS);
  const dialogueLines = countDialogueLines(text);
  const hasQuestion = /[?？]/.test(text);
  const hasImmediatePressure = /(must|before|choose|loses|protect|vanish|knocks|必须|否则|不能|今晚|立刻|之前)/i.test(text);
  const systemDensity = chars === 0 ? 0 : systemTerms * 1000 / chars;
  const liveDensity = chars === 0 ? 0 : liveTerms * 1000 / chars;

  return {
    file: relativeRef(file),
    chars,
    dialogue_lines: dialogueLines,
    system_density_per_1000_chars: Number(systemDensity.toFixed(2)),
    live_pressure_per_1000_chars: Number(liveDensity.toFixed(2)),
    has_question: hasQuestion,
    has_immediate_pressure: hasImmediatePressure
  };
}

function makeFinding(ruleId, severity, location, recommendation, sourceRefs) {
  return { rule_id: ruleId, severity, location, recommendation, source_refs: sourceRefs };
}

function scoreDraft(metric) {
  const clarity = clamp(82 - Math.max(0, metric.system_density_per_1000_chars - 12) * 1.4 + (metric.dialogue_lines > 0 ? 6 : -10));
  const abandonment = clamp(20 + Math.max(0, metric.system_density_per_1000_chars - 12) * 2 - metric.live_pressure_per_1000_chars * 0.4 + (metric.dialogue_lines === 0 ? 18 : -6));
  const market = clamp(58 + (metric.has_question ? 10 : -10) + (metric.has_immediate_pressure ? 12 : -12) + Math.min(20, metric.live_pressure_per_1000_chars * 0.45));
  const emotion = clamp(55 + Math.min(30, metric.live_pressure_per_1000_chars * 0.7) + (metric.dialogue_lines > 0 ? 8 : -12));
  return {
    target_ref: metric.file,
    clarity_score: clarity,
    abandonment_risk: abandonment,
    market_pull_score: market,
    emotion_landing_score: emotion
  };
}

function evaluateReviewScorecard(files, options = {}) {
  const metrics = files.map(file => inspectDraft(file));
  const scorecard = metrics.map(scoreDraft);
  const findings = [];

  for (const metric of metrics) {
    if (metric.system_density_per_1000_chars > 18 && metric.live_pressure_per_1000_chars < 25) {
      findings.push(makeFinding(
        "SGM-REV-001-R002",
        "high",
        metric.file,
        "Cold-reader risk is high: system or procedure language dominates the current page before enough living-person pressure lands.",
        ["docs/review-capability-enhancement.md#Scoring Rules"]
      ));
    }
    if (metric.dialogue_lines === 0 && metric.chars > 120) {
      findings.push(makeFinding(
        "SGM-READ-001-R003",
        "medium",
        metric.file,
        "No visible human exchange appears in a long draft; add a spoken beat, reaction, or concrete interpersonal turn.",
        ["docs/review-capability-enhancement.md#Scoring Rules"]
      ));
    }
    if (!metric.has_question && !metric.has_immediate_pressure) {
      findings.push(makeFinding(
        "SGM-MKT-001-R003",
        "high",
        metric.file,
        "Next-pursuit pressure is weak; make the reader understand what must happen next and what is lost if it does not.",
        ["docs/review-capability-enhancement.md#Scoring Rules"]
      ));
    }
    if (metric.live_pressure_per_1000_chars < 8) {
      findings.push(makeFinding(
        "SGM-EMO-001-R001",
        "high",
        metric.file,
        "Emotion is concept-only; land it on body, object, relationship, or changed behavior.",
        ["docs/review-capability-enhancement.md#Scoring Rules"]
      ));
    }
  }

  return {
    report_id: options.reportId || "sgm-script-review-scorecard",
    module_id: "SGM-REV-001",
    mode: "novel",
    rule_pack: options.rulePack || defaultRulePackId(),
    target_refs: metrics.map(item => item.file),
    source_refs: [
      "docs/review-capability-enhancement.md",
      "docs/traceability.md#SGM-REV-001",
      "docs/traceability.md#SGM-MKT-001",
      "docs/traceability.md#SGM-EMO-001"
    ],
    verdict: findings.some(item => item.severity === "high" || item.severity === "blocker") ? "needs_polish" : "pass",
    findings,
    scorecard,
    metrics
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
    console.error("Usage: node scripts/review-scorecard.js <chapter.md...> [--rule-pack name@version] [--out report.json]");
    return 2;
  }
  const files = args.files.map(file => path.isAbsolute(file) ? file : path.resolve(process.cwd(), file));
  for (const file of files) {
    if (!fs.existsSync(file)) {
      console.error(`Draft file not found: ${file}`);
      return 2;
    }
  }
  const report = evaluateReviewScorecard(files, { rulePack: args.rulePack });
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

module.exports = { evaluateReviewScorecard, inspectDraft, run };
