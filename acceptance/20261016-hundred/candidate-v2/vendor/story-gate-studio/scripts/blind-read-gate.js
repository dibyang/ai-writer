"use strict";

const fs = require("fs");
const path = require("path");
const { defaultRulePackId, pluginRoot, readJson } = require("./lib");

const MODULE_ID = "SGM-BLIND-001";
const SOURCE_REFS = [
  "docs/traceability.md#SGM-BLIND-001",
  "references/blind-read-review-rules.md"
];

const DEFAULT_THRESHOLDS = {
  single_reader_count: 2,
  continuous_reader_count: 2,
  single_pass_score: 4,
  formal_pass_score: 90,
  page_turner_pass_score: 90,
  continuous_min_chapters: 3
};

const FORMAL_TICKET_TYPES = new Set(["isolated_agent", "human"]);

function text(value) {
  return String(value || "").trim();
}

function array(value) {
  return Array.isArray(value) ? value : [];
}

function thresholds(input) {
  return { ...DEFAULT_THRESHOLDS, ...(input.thresholds || {}) };
}

function finding(ruleId, severity, location, recommendation) {
  return {
    rule_id: ruleId,
    severity,
    location,
    recommendation,
    source_refs: SOURCE_REFS
  };
}

function hasVersionLock(input) {
  const lock = input.version_lock || {};
  const files = array(lock.files);
  const hasFileTrace = files.length > 0 && files.every(file =>
    text(file.path) && (Number(file.word_count) > 0 || Number(file.words) > 0)
  );
  return text(lock.date)
    && hasFileTrace
    && (text(lock.git_ref) || text(lock.modified_at))
    && text(lock.questionnaire_version)
    && lock.includes !== undefined;
}

function hasEphemeralAgentProblem(input) {
  const execution = input.execution || {};
  return text(execution.runner) !== "internal_temporary_agent"
    || execution.creates_preview_task !== false
    || execution.inherits_current_context !== false
    || execution.result_discarded_after_read !== true
    || execution.sidebar_entry_retained !== false;
}

function formalReaders(input) {
  return array(input.readers).filter(reader => FORMAL_TICKET_TYPES.has(text(reader.ticket_type)));
}

function requiredReaderCount(input) {
  const t = thresholds(input);
  return input.review_scope === "continuous" ? t.continuous_reader_count : t.single_reader_count;
}

function hasTicketTypeProblem(input) {
  const readers = array(input.readers);
  if (readers.length === 0) return true;
  if (readers.some(reader => text(reader.ticket_type) === "informed_review" && reader.counted_as_blind !== false)) {
    return true;
  }
  const countedTypes = new Set(readers
    .filter(reader => reader.counted_as_blind !== false)
    .map(reader => text(reader.ticket_type)));
  return countedTypes.has("human") && countedTypes.has("isolated_agent") && input.merged_ticket_types === true;
}

function hasIsolationProblem(input) {
  const isolation = input.isolation || {};
  if (isolation.prompt_neutral === false) return true;
  if (isolation.reader_answers_isolated === false) return true;
  if (isolation.supplemental_explanations === true) return true;
  if (array(isolation.prohibited_materials_seen).length > 0) return true;
  return array(input.readers).some(reader => reader.isolated === false || reader.saw_other_answers === true);
}

function hasSubstantiveRevisionProblem(input) {
  const revision = input.revision || {};
  return revision.substantive_after_lock === true && revision.reused_prior_votes === true;
}

function readerBasicFailure(reader, input) {
  const t = thresholds(input);
  const continueScore = Number(reader.continue_score);
  return reader.complete !== true
    || reader.retell_accurate !== true
    || reader.critical_misread === true
    || reader.logical_hard_issue === true
    || !(continueScore >= t.single_pass_score)
    || reader.immediate_continue !== true;
}

function readerStrongFailure(reader, input) {
  const closeness = Number(reader.character_closeness);
  const pressure = Number(reader.scene_pressure);
  const reason = reader.pursuit_reason || {};
  return readerBasicFailure(reader, input)
    || !(closeness >= 4)
    || !(pressure >= 4)
    || reason.concrete_character !== true;
}

function continuousReaderFailure(reader, input) {
  const t = thresholds(input);
  const chapters = array(reader.chapters);
  const fatigue = reader.fatigue || {};
  return reader.complete !== true
    || reader.sequential_reading !== true
    || reader.retell_accurate !== true
    || !(Number(reader.continue_score) >= t.single_pass_score)
    || reader.immediate_continue !== true
    || chapters.length < t.continuous_min_chapters
    || chapters.some(chapter => !(Number(chapter.continue_score) >= 1) || chapter.immediate_continue === undefined)
    || !Object.prototype.hasOwnProperty.call(fatigue, "first_slow")
    || !Object.prototype.hasOwnProperty.call(fatigue, "first_skim")
    || !Object.prototype.hasOwnProperty.call(fatigue, "stable_fatigue")
    || reader.common_time_misread === true
    || reader.result_spoiled_ahead === true
    || reader.hard_chapter_break === true
    || reader.stable_skip_zone === true;
}

function formalQualityFailure(reader, input) {
  return !(Number(reader.quality_score) >= thresholds(input).formal_pass_score)
    || reader.logic_hard_issue === true
    || reader.professional_boundary_issue === true
    || reader.causality_hard_issue === true;
}

function pageTurnerFailure(reader, input) {
  const t = thresholds(input);
  const reason = reader.pursuit_reason || {};
  const chapters = array(reader.chapters);
  return !(Number(reader.page_turner_score) >= t.page_turner_pass_score)
    || chapters.some(chapter => !(Number(chapter.continue_score) >= 4) || chapter.immediate_continue !== true)
    || (reader.fatigue || {}).stable_fatigue !== "none"
    || reason.concrete_character !== true
    || reason.unresolved_event !== true;
}

function hasScoreSeparationProblem(input) {
  if (input.merged_quality_and_page_turner_score === true) return true;
  if (["formal_quality", "continuous_page_turner", "publish_ready"].includes(text(input.claim))) {
    return formalReaders(input).some(reader =>
      reader.quality_score === undefined || reader.page_turner_score === undefined
    );
  }
  return false;
}

function hasScopeSubstitutionProblem(input) {
  const scope = text(input.review_scope);
  const claim = text(input.claim);
  if (scope === "single" && claim.startsWith("continuous")) return true;
  if (scope === "single" && claim === "publish_ready") return true;
  if (scope === "continuous" && input.single_votes_used_for_continuous === true) return true;
  return false;
}

function evaluateBlindReadGate(input, options = {}) {
  const findings = [];
  const readers = array(input.readers);
  const formal = formalReaders(input);
  const claim = text(input.claim) || "blind_read_review";
  const scope = text(input.review_scope) || "single";

  if (hasEphemeralAgentProblem(input)) {
    findings.push(finding(
      "SGM-BLIND-001-R013",
      "blocker",
      "input.execution",
      "Blind reading must be performed by an internal temporary agent that creates no previewable task, inherits none of the current conversation context, discards the result after readback, and leaves no sidebar entry."
    ));
  }
  if (!hasVersionLock(input)) {
    findings.push(finding(
      "SGM-BLIND-001-R001",
      "blocker",
      "input.version_lock",
      "Record date, file order, word count, git ref or modified time, appendix/include status, ticket type, and questionnaire version before issuing blind-read tasks."
    ));
  }
  if (hasTicketTypeProblem(input)) {
    findings.push(finding(
      "SGM-BLIND-001-R002",
      "blocker",
      "input.readers",
      "Separate human blind tickets, isolated agent tickets, and informed review; do not merge them into one vote count or count informed review as blind reading."
    ));
  }
  if (hasIsolationProblem(input)) {
    findings.push(finding(
      "SGM-BLIND-001-R003",
      "blocker",
      "input.isolation",
      "Blind readers may only receive the locked text, neutral task text, and questionnaire; they must not see outlines, settings, prior comments, other answers, author concerns, or later chapters."
    ));
  }
  if (hasSubstantiveRevisionProblem(input)) {
    findings.push(finding(
      "SGM-BLIND-001-R004",
      "blocker",
      "input.revision",
      "After substantive changes to openings, endings, hooks, events, order, character action, scene position, chapter order, or appendix placement, old blind-read tickets become historical references and must not remain current scores."
    ));
  }
  if (formal.length < requiredReaderCount(input) && text(input.decision_level) !== "screening") {
    findings.push(finding(
      "SGM-BLIND-001-R005",
      "blocker",
      "input.readers",
      "Formal blind-read decisions require at least two qualifying isolated agent or human tickets; one screening ticket may only discover problems, not prove pass."
    ));
  }
  if (hasScopeSubstitutionProblem(input)) {
    findings.push(finding(
      "SGM-BLIND-001-R006",
      "blocker",
      "input.review_scope",
      "Single-chapter blind read and continuous blind read are different gates; a single-chapter pass cannot stand in for continuous pass, publication readiness, or strong commercial stickiness."
    ));
  }
  if (hasScoreSeparationProblem(input)) {
    findings.push(finding(
      "SGM-BLIND-001-R007",
      "blocker",
      "input.scores",
      "Formal quality score and page-turner/commercial stickiness score must be recorded separately; do not merge them into one average."
    ));
  }

  if (formal.length > 0) {
    if (scope === "single" && formal.some(reader => readerBasicFailure(reader, input))) {
      findings.push(finding(
        "SGM-BLIND-001-R008",
        "blocker",
        "input.readers",
        "Every formal single-chapter ticket must complete reading, retell the surface event accurately, avoid key causality or identity misread, meet the continuation threshold, and explicitly want to continue; averages cannot rescue a failed ticket."
      ));
    }
    if (scope === "single" && claim === "single_page_turner" && formal.some(reader => readerStrongFailure(reader, input))) {
      findings.push(finding(
        "SGM-BLIND-001-R009",
        "blocker",
        "input.readers",
        "Single-chapter strong page-turner pass needs basic pass, at least one 5 score with others not below 4, character closeness and scene pressure at least 4, and at least one continuation reason rooted in a concrete character."
      ));
    }
    if (scope === "continuous" && formal.some(reader => continuousReaderFailure(reader, input))) {
      findings.push(finding(
        "SGM-BLIND-001-R010",
        "blocker",
        "input.readers",
        "Continuous blind reading must cover at least three ordered chapters, record each chapter immediately, track first slow-down, first skim, and stable fatigue, and avoid shared time misread, result pre-spoiling, hard chapter breaks, or stable skip zones."
      ));
    }
    if (["formal_quality", "publish_ready"].includes(claim) && formal.some(reader => formalQualityFailure(reader, input))) {
      findings.push(finding(
        "SGM-BLIND-001-R011",
        "blocker",
        "input.readers",
        "Formal quality pass requires every qualifying ticket to meet the formal quality threshold and avoid logic, time, identity, professional-boundary, and causality hard injuries."
      ));
    }
    if (["continuous_page_turner", "publish_ready"].includes(claim) && formal.some(reader => pageTurnerFailure(reader, input))) {
      findings.push(finding(
        "SGM-BLIND-001-R012",
        "blocker",
        "input.readers",
        "Continuous strong page-turner pass requires every qualifying ticket to meet the page-turner threshold, keep each chapter at least 4, immediately continue, avoid shared stable fatigue, and cite both a concrete character and unresolved event."
      ));
    }
  }

  const hasBlocker = findings.some(item => item.severity === "blocker");
  return {
    report_id: options.reportId || "sgm-script-blind-read-gate",
    module_id: MODULE_ID,
    mode: "novel",
    rule_pack: options.rulePack || defaultRulePackId(),
    target_refs: [options.targetRef || "inline"],
    source_refs: SOURCE_REFS,
    verdict: hasBlocker ? "blocked" : findings.length > 0 ? "needs_polish" : "pass",
    findings
  };
}

function loadBlindReadInput(filePath) {
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
    console.error("Usage: node scripts/blind-read-gate.js <fixture-or-input.json>");
    process.exitCode = 2;
  } else {
    const request = loadBlindReadInput(filePath);
    const report = evaluateBlindReadGate(request.input, request);
    console.log(JSON.stringify(report, null, 2));
    process.exitCode = report.verdict === "blocked" ? 1 : 0;
  }
}

module.exports = { evaluateBlindReadGate, loadBlindReadInput };
