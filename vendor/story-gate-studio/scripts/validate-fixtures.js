"use strict";

const fs = require("fs");
const path = require("path");
const { assert, listFiles, pluginRoot, readJson, runCli } = require("./lib");
const { evaluateBlindReadGate } = require("./blind-read-gate");
const { evaluateChapterGate } = require("./chapter-gate");
const { validateOneReport } = require("./validate-report");

function hasScreenplayLeak(report) {
  const text = JSON.stringify(report).toLowerCase();
  return ["shot", "camera", "镜头", "分镜", "拍摄清单"].some(term => text.includes(term.toLowerCase()));
}

function validateFixtures(fixtureDir = path.join("examples", "fixtures"), expectedDir = path.join("examples", "expected-reports")) {
  const root = pluginRoot();
  const errors = [];
  const schema = readJson(path.join(root, "references", "report.schema.json"));
  const fixturesRoot = path.resolve(root, fixtureDir);
  const reportsRoot = path.resolve(root, expectedDir);
  const files = listFiles(fixturesRoot, file => file.endsWith(".json"));

  assert(files.length > 0, `no fixture JSON files found at ${fixtureDir}`, errors);
  for (const file of files) {
    const fixture = readJson(file);
    const label = path.relative(root, file);
    assert(fixture.fixture_id, `${label} missing fixture_id`, errors);
    assert(fixture.mode, `${label} missing mode`, errors);
    assert(fixture.expected_report, `${label} missing expected_report`, errors);
    const expectedPath = path.join(reportsRoot, fixture.expected_report || "");
    assert(fs.existsSync(expectedPath), `${label} expected report not found: ${fixture.expected_report}`, errors);
    if (fs.existsSync(expectedPath)) {
      const report = readJson(expectedPath);
      validateOneReport(report, schema, fixture.expected_report, errors);
      assert(report.mode === fixture.mode, `${label} mode mismatch: fixture=${fixture.mode}, report=${report.mode}`, errors);
      assert(report.report_id === fixture.expected_report_id, `${label} expected_report_id mismatch`, errors);
      if ((fixture.fixture_id || "").startsWith("TEST-CHAP")) {
        const actual = evaluateChapterGate(fixture.input || {}, {
          reportId: fixture.expected_report_id,
          targetRef: label.replace(/\\/g, "/")
        });
        assert(
          JSON.stringify(actual) === JSON.stringify(report),
          `${label} generated chapter-gate report differs from expected report`,
          errors
        );
      }
      if ((fixture.fixture_id || "").startsWith("TEST-BLIND")) {
        const actual = evaluateBlindReadGate(fixture.input || {}, {
          reportId: fixture.expected_report_id,
          targetRef: label.replace(/\\/g, "/")
        });
        assert(
          JSON.stringify(actual) === JSON.stringify(report),
          `${label} generated blind-read-gate report differs from expected report`,
          errors
        );
      }
      if (fixture.mode === "novel") {
        assert(!hasScreenplayLeak(report), `${label} novel mode report contains screenplay/shot-list terms`, errors);
      }
    }
  }
  return errors;
}

if (require.main === module) {
  runCli("QG-004 fixture regression and QG-006 mode isolation", () => validateFixtures(process.argv[2], process.argv[3]));
}

module.exports = { validateFixtures };
