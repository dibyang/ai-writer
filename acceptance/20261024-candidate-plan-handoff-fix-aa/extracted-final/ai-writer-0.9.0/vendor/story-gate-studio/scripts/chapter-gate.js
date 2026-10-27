"use strict";

const fs = require("fs");
const path = require("path");
const { defaultRulePackId, pluginRoot, readJson } = require("./lib");

const MODULE_ID = "SGM-CHAP-001";
const SOURCE_REFS = ["docs/traceability.md#SGM-CHAP-001"];
const PHYSICAL_SOURCE_REFS = ["docs/traceability.md#SGM-PHY-001"];
const DUAL_SOURCE_REFS = ["docs/traceability.md#SGM-DUAL-001"];
const PHYSICAL_TARGET_TERMS = [
  "evidence",
  "record",
  "injury",
  "wound",
  "trace",
  "mark",
  "blood",
  "mud",
  "seal",
  "paper",
  "folder",
  "body",
  "line",
  "object",
  "物证",
  "伤痕",
  "字迹",
  "泥痕",
  "血迹",
  "封签",
  "纸边",
  "藏物",
  "线索"
];
const PHYSICAL_ANCHOR_TERMS = [
  "position",
  "inside",
  "under",
  "behind",
  "folded",
  "sealed",
  "visible",
  "hidden",
  "obstruction",
  "angle",
  "light",
  "distance",
  "posture",
  "tool",
  "timing",
  "procedure",
  "flap",
  "edge",
  "surface",
  "direction",
  "pressure",
  "layer",
  "遮挡",
  "角度",
  "光线",
  "距离",
  "姿势",
  "工具",
  "流程",
  "位置",
  "方向",
  "折叠",
  "压住",
  "覆盖",
  "清理",
  "显露"
];

const SMALL_OBJECT_TERMS = [
  "small paper",
  "paper corner",
  "paper scrap",
  "wet paper",
  "medicine tag",
  "broken needle",
  "seal strip",
  "seal slip",
  "page fragment",
  "page scrap",
  "bamboo slip",
  "thin slip",
  "needle",
  "tag",
  "\u5c0f\u6e7f\u7eb8",
  "\u7eb8\u89d2",
  "\u836f\u7b7e",
  "\u65ad\u9488",
  "\u5c01\u7b7e",
  "\u6b8b\u9875",
  "\u7af9\u7b7e"
];
const SMALL_OBJECT_ACTION_TERMS = [
  "hold",
  "held",
  "cup",
  "cupped",
  "grasp",
  "gripped",
  "pinch",
  "pinched",
  "press",
  "pressed",
  "tuck",
  "tucked",
  "hide",
  "hidden",
  "support",
  "supported",
  "cover",
  "covered",
  "carry",
  "carried",
  "wrap",
  "wrapped",
  "cloth",
  "palm",
  "sleeve",
  "between",
  "\u62b1",
  "\u6367",
  "\u6505",
  "\u5939",
  "\u538b",
  "\u63e3",
  "\u85cf",
  "\u6258",
  "\u6342",
  "\u9694\u5e03",
  "\u638c\u5fc3",
  "\u8896"
];
const LARGE_OBJECT_STATE_TERMS = [
  "bundle",
  "armful",
  "in her arms",
  "in his arms",
  "under the arm",
  "large package",
  "heavy package",
  "\u5305\u88b1",
  "\u6000\u91cc\u5305\u88b1",
  "\u62b1\u5728\u6000\u91cc",
  "\u4e00\u5927\u5305"
];
const FRAGILE_OBJECT_STATE_TERMS = [
  "fragile",
  "brittle",
  "wet",
  "crumbles",
  "cracked",
  "frayed",
  "\u8106",
  "\u6e7f",
  "\u6613\u788e",
  "\u7834\u788e",
  "\u6b8b"
];
const DIRECT_PINCH_TERMS = [
  "pinch the edge",
  "pinched the edge",
  "pinched by the edge",
  "held by the edge",
  "bare fingers",
  "\u634f\u8fb9",
  "\u76f4\u63a5\u634f",
  "\u62c8\u8fb9"
];
const PROTECTIVE_HANDLING_TERMS = [
  "cloth",
  "support",
  "supported",
  "tray",
  "backing",
  "between two sheets",
  "wrapped",
  "\u9694\u5e03",
  "\u6258",
  "\u57ab",
  "\u5305",
  "\u5939\u677f"
];
const DUAL_TIMELINE_TERMS = [
  "dual timeline",
  "two timelines",
  "other world",
  "historical body",
  "modern body",
  "switch back",
  "switches back",
  "returns to modern",
  "wakes in the past",
  "wakes in the historical",
  "sleep trigger",
  "time slip",
  "crosses into",
  "\u53cc\u65f6\u7a7a",
  "\u73b0\u4ee3\u8eab\u4f53",
  "\u53e4\u4ee3\u8eab\u4f53",
  "\u5510\u671d\u8eab\u4f53",
  "\u5207\u56de\u73b0\u4ee3",
  "\u9192\u56de\u73b0\u4ee3",
  "\u5165\u7761",
  "\u63a5\u5165",
  "\u9000\u51fa"
];
const DUAL_CONTINUITY_ANCHOR_TERMS = [
  "modern body",
  "historical body",
  "location",
  "elapsed",
  "one-to-one",
  "care",
  "moved by",
  "caretaker",
  "after exit",
  "after return",
  "unconscious",
  "dehydration",
  "\u73b0\u4ee3\u8eab\u4f53",
  "\u5510\u671d\u8eab\u4f53",
  "\u53e4\u4ee3\u8eab\u4f53",
  "\u4f4d\u7f6e",
  "\u7ecf\u8fc7",
  "\u4e00\u6bd4\u4e00",
  "\u7167\u6599",
  "\u79fb\u52a8",
  "\u9000\u51fa\u540e",
  "\u8131\u6c34"
];
const OBSERVED_FACT_TERMS = [
  "observed",
  "photographed",
  "recorded",
  "archived",
  "measured",
  "cataloged",
  "sealed as evidence",
  "\u5df2\u89c2\u6d4b",
  "\u62cd\u7167",
  "\u8bb0\u5f55",
  "\u5165\u6863",
  "\u7f16\u53f7",
  "\u5c01\u5b58"
];
const FACT_REWRITE_TERMS = [
  "rewritten",
  "changed after",
  "changed in the archive",
  "new words appeared",
  "disappeared from the photo",
  "vanished from the record",
  "auto-updated",
  "retroactively changed",
  "\u81ea\u52a8\u6539\u5b57",
  "\u51ed\u7a7a\u6539\u53d8",
  "\u540e\u6765\u88ab\u6539",
  "\u65b0\u5b57\u51fa\u73b0",
  "\u4ece\u7167\u7247\u6d88\u5931",
  "\u8bb0\u5f55\u81ea\u52a8\u66f4\u65b0"
];
const FACT_SAFE_TERMS = [
  "unobserved",
  "newly revealed",
  "under the mud",
  "new angle",
  "new interpretation",
  "explanation changed",
  "\u672a\u89c2\u6d4b",
  "\u65b0\u663e\u9732",
  "\u6ce5\u5c42\u4e0b",
  "\u65b0\u89d2\u5ea6",
  "\u89e3\u91ca\u6539\u53d8"
];
const CROSS_BOUNDARY_ARTIFACT_TERMS = [
  "modern tool",
  "modern object",
  "phone",
  "surgical knife",
  "scalpel",
  "instrument",
  "brought into the past",
  "carried into the other world",
  "cross-boundary artifact",
  "\u73b0\u4ee3\u7269",
  "\u73b0\u4ee3\u5de5\u5177",
  "\u624b\u673a",
  "\u624b\u672f\u5200",
  "\u5668\u68b0",
  "\u5e26\u5165",
  "\u8de8\u754c\u7269"
];
const ARTIFACT_LIFECYCLE_ANCHOR_TERMS = [
  "old state",
  "young state",
  "source",
  "independent photo",
  "recorded comparison",
  "active choice",
  "one-way",
  "lost from modern",
  "left in the past",
  "handoff",
  "sealed",
  "\u8001\u5316\u6001",
  "\u5e74\u8f7b\u6001",
  "\u6765\u6e90",
  "\u72ec\u7acb\u62cd\u7167",
  "\u6bd4\u5bf9",
  "\u4e3b\u52a8\u9009\u62e9",
  "\u5355\u5411",
  "\u73b0\u4ee3\u7f3a\u5931",
  "\u7559\u5728",
  "\u4ea4\u63a5",
  "\u5c01\u5b58"
];

function text(value) {
  return String(value || "").trim();
}

function isResearchOnly(value) {
  const normalized = text(value).toLowerCase();
  if (!normalized) return false;
  const vagueTerms = [
    "research",
    "notes",
    "checked",
    "reviews",
    "background",
    "thinks about"
  ];
  const eventTerms = [
    "opened",
    "revealed",
    "arrives",
    "leaves",
    "confronts",
    "destroys",
    "escapes",
    "dies",
    "attacks"
  ];
  return vagueTerms.some(term => normalized.includes(term)) && !eventTerms.some(term => normalized.includes(term));
}

function countTermMatches(value, terms) {
  const normalized = text(value).toLowerCase();
  return terms.filter(term => normalized.includes(term.toLowerCase())).length;
}

function hasEnoughPhysicalDetail(value) {
  const normalized = text(value);
  if (!normalized) return false;
  return countTermMatches(normalized, PHYSICAL_TARGET_TERMS) >= 1
    && countTermMatches(normalized, PHYSICAL_ANCHOR_TERMS) >= 2;
}

function mentionsSmallObject(value) {
  return countTermMatches(value, SMALL_OBJECT_TERMS) >= 1;
}

function hasSmallObjectAction(value) {
  return countTermMatches(value, SMALL_OBJECT_ACTION_TERMS) >= 1;
}

function hasObjectStateContinuityConflict(value) {
  const hasSmall = mentionsSmallObject(value);
  const hasLargeState = countTermMatches(value, LARGE_OBJECT_STATE_TERMS) >= 1;
  const hasFragileState = countTermMatches(value, FRAGILE_OBJECT_STATE_TERMS) >= 1;
  const hasDirectPinch = countTermMatches(value, DIRECT_PINCH_TERMS) >= 1;
  const hasProtection = countTermMatches(value, PROTECTIVE_HANDLING_TERMS) >= 1;
  return (hasSmall && hasLargeState) || (hasFragileState && hasDirectPinch && !hasProtection);
}

function combinedInputText(input) {
  return [
    input.chapter_goal,
    input.main_event,
    input.worsening,
    input.reader_mainline,
    input.physical_operability,
    input.timeline_continuity,
    input.observed_fact_policy,
    input.cross_boundary_artifact,
    input.next_pursuit
  ].map(text).join("\n");
}

function mentionsDualTimeline(input) {
  return countTermMatches(combinedInputText(input), DUAL_TIMELINE_TERMS) >= 1;
}

function hasDualTimelineContinuity(input) {
  return countTermMatches(input.timeline_continuity, DUAL_CONTINUITY_ANCHOR_TERMS) >= 3;
}

function hasObservedFactRewriteConflict(input) {
  const combined = combinedInputText(input);
  return countTermMatches(combined, OBSERVED_FACT_TERMS) >= 1
    && countTermMatches(combined, FACT_REWRITE_TERMS) >= 1
    && countTermMatches(combined, FACT_SAFE_TERMS) === 0;
}

function mentionsCrossBoundaryArtifact(input) {
  return countTermMatches(combinedInputText(input), CROSS_BOUNDARY_ARTIFACT_TERMS) >= 1;
}

function hasArtifactLifecycle(input) {
  return countTermMatches(input.cross_boundary_artifact, ARTIFACT_LIFECYCLE_ANCHOR_TERMS) >= 4;
}

function finding(ruleId, severity, location, recommendation, sourceRefs = SOURCE_REFS) {
  return {
    rule_id: ruleId,
    severity,
    location,
    recommendation,
    source_refs: sourceRefs
  };
}

function evaluateChapterGate(input, options = {}) {
  const findings = [];
  const mainEvent = text(input.main_event);

  if (!mainEvent || isResearchOnly(mainEvent)) {
    findings.push(finding(
      "SGM-CHAP-001-R001",
      "blocker",
      "input.main_event",
      "Replace research-only activity with a visible event that changes the character's situation and creates a next-chapter pursuit question."
    ));
  } else {
    if (!text(input.worsening)) {
      findings.push(finding(
        "SGM-CHAP-001-R002",
        "high",
        "input.worsening",
        "Add the concrete cost, threat, or irreversible pressure created by the chapter event."
      ));
    }
    if (!text(input.reader_mainline)) {
      findings.push(finding(
        "SGM-CHAP-001-R003",
        "medium",
        "input.reader_mainline",
        "State the one-line reader-facing mainline so the chapter is easy to follow."
      ));
    }
    if (!text(input.next_pursuit)) {
      findings.push(finding(
        "SGM-CHAP-001-R004",
        "medium",
        "input.next_pursuit",
        "Add a concrete pursuit question that pulls the reader into the next chapter."
      ));
    }
    const physicalOperability = text(input.physical_operability);
    if (!physicalOperability) {
      findings.push(finding(
        "SGM-PHY-001-R001",
        "blocker",
        "input.physical_operability",
        "Explain why the key evidence, injury, trace, concealment, reveal order, or on-page action is physically possible through position, obstruction, angle, light, distance, posture, tool, timing, and procedure.",
        PHYSICAL_SOURCE_REFS
      ));
    } else if (!hasEnoughPhysicalDetail(physicalOperability)) {
      findings.push(finding(
        "SGM-PHY-001-R002",
        "blocker",
        "input.physical_operability",
        "Replace the generic physical explanation with at least one concrete evidence or action target and at least two support anchors such as position, obstruction, angle, light, distance, posture, tool, timing, or procedure.",
        PHYSICAL_SOURCE_REFS
      ));
    } else if (mentionsSmallObject(physicalOperability) && !hasSmallObjectAction(physicalOperability)) {
      findings.push(finding(
        "SGM-PHY-001-R003",
        "blocker",
        "input.physical_operability",
        "Name the handling action that matches the small object's size and state, such as holding, cupping, grasping, pinching, pressing, tucking, hiding, supporting, covering, or carrying it.",
        PHYSICAL_SOURCE_REFS
      ));
    } else if (hasObjectStateContinuityConflict(physicalOperability)) {
      findings.push(finding(
        "SGM-PHY-001-R004",
        "blocker",
        "input.physical_operability",
        "Keep the object's state continuous: a small or fragile item cannot shift into a bundle-sized object, or require protected support in one beat while being directly pinched by the edge in another.",
        PHYSICAL_SOURCE_REFS
      ));
    }
    if (mentionsDualTimeline(input) && !hasDualTimelineContinuity(input)) {
      findings.push(finding(
        "SGM-DUAL-001-R001",
        "blocker",
        "input.timeline_continuity",
        "When a chapter uses a dual timeline, sleep trigger, exit, return, or body switch, record both bodies' locations, elapsed one-to-one time, post-exit care or movement, and the next wake position.",
        DUAL_SOURCE_REFS
      ));
    }
    if (hasObservedFactRewriteConflict(input)) {
      findings.push(finding(
        "SGM-DUAL-001-R002",
        "blocker",
        "input.observed_fact_policy",
        "Already observed facts such as photographed, recorded, measured, numbered, or archived evidence cannot retroactively change; new reveals must come from unobserved layers, new angles, tests, permissions, or changed interpretation.",
        DUAL_SOURCE_REFS
      ));
    }
    if (mentionsCrossBoundaryArtifact(input) && !hasArtifactLifecycle(input)) {
      findings.push(finding(
        "SGM-DUAL-001-R003",
        "blocker",
        "input.cross_boundary_artifact",
        "A cross-boundary artifact needs a lifecycle: independently observed old state, present/source state, active carry or trigger condition, one-way cost or modern loss, handoff/use, and final storage or evidence state.",
        DUAL_SOURCE_REFS
      ));
    }
  }

  const hasBlocker = findings.some(item => item.severity === "blocker");
  return {
    report_id: options.reportId || "sgm-script-chapter-gate",
    module_id: MODULE_ID,
    mode: "novel",
    rule_pack: options.rulePack || defaultRulePackId(),
    target_refs: [options.targetRef || "inline"],
    source_refs: SOURCE_REFS,
    verdict: hasBlocker ? "blocked" : findings.length > 0 ? "needs_polish" : "pass",
    findings
  };
}

function loadChapterGateInput(filePath) {
  const resolved = path.isAbsolute(filePath) ? filePath : path.resolve(pluginRoot(), filePath);
  const data = readJson(resolved);
  const input = data.input || data;
  const targetRef = path.relative(pluginRoot(), resolved).replace(/\\/g, "/");
  const reportId = data.expected_report_id || undefined;
  return { input, reportId, targetRef };
}

if (require.main === module) {
  const filePath = process.argv[2];
  if (!filePath) {
    console.error("Usage: node scripts/chapter-gate.js <fixture-or-input.json>");
    process.exitCode = 2;
  } else {
    const request = loadChapterGateInput(filePath);
    const report = evaluateChapterGate(request.input, request);
    console.log(JSON.stringify(report, null, 2));
    process.exitCode = report.verdict === "blocked" ? 1 : 0;
  }
}

module.exports = { evaluateChapterGate, loadChapterGateInput };
