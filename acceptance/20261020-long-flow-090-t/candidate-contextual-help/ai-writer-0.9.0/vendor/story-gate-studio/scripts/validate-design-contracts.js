"use strict";

const fs = require("fs");
const path = require("path");
const { assert, pluginRoot, readJson, requireFields, runCli } = require("./lib");

const REQUIRED_SKILLS = [
  "story-architect",
  "chapter-workbench",
  "third-party-review",
  "feedback-triage",
  "release-gate",
  "blockbuster-review",
  "visual-asset-manager",
  "screenplay-adapter"
];

const REQUIRED_SCRIPTS = [
  "story-gate.js",
  "blind-read-gate.js",
  "build-private-package.js",
  "build-release-archive.js",
  "chapter-gate.js",
  "chapter-batch-metrics.js",
  "commercial-readiness-check.js",
  "customer-pilot.js",
  "host-adapter.js",
  "init-project-rule-pack.js",
  "project-rule-pack-check.js",
  "review-scorecard.js",
  "story-index.js",
  "story-gate-audit.js",
  "story-template-scan.js",
  "visual-asset-audit.js",
  "private-package-check.js",
  "validate-plugin-structure.js",
  "validate-rule-pack.js",
  "validate-report.js",
  "validate-fixtures.js",
  "commercial-release-check.js",
  "customer-install-smoke.js",
  "support-bundle.js",
  "release-check.js",
  "validate-design-contracts.js"
];

const REQUIRED_DOCS = [
  "docs/quickstart.md",
  "docs/help.md",
  "docs/phased-roadmap.md",
  "docs/customer-install.md",
  "docs/customer-pilot.md",
  "docs/commercial-operations.md",
  "docs/support-playbook.md",
  "docs/release-management.md",
  "docs/project-rule-pack-template.md",
  "docs/review-capability-enhancement.md",
  "docs/host-adapter.md"
];

const REQUIRED_SCHEMAS = [
  "request.schema.json",
  "report.schema.json",
  "rule-pack.schema.json",
  "quality-gate.schema.json",
  "host-adapter.schema.json",
  "commercial-readiness.json",
  "license-profile.json",
  "task-registry.schema.json"
];

const REQUIRED_SKILL_SECTIONS = [
  "Scope",
  "Required Output"
];

function validateRequestFixture(root, errors) {
  const schema = readJson(path.join(root, "references", "request.schema.json"));
  const request = readJson(path.join(root, "examples", "requests", "chapter-gate-request.json"));
  requireFields(request, schema.required_top_level_fields, "chapter-gate-request", errors);
  assert(schema.allowed_hosts.includes(request.host), `unsupported request host: ${request.host}`, errors);
  assert(schema.allowed_modes.includes(request.mode), `unsupported request mode: ${request.mode}`, errors);
  assert(schema.allowed_write_policy.includes(request.write_policy), `unsupported write_policy: ${request.write_policy}`, errors);
}

function validateDesignContracts(root = pluginRoot()) {
  const errors = [];
  const designPath = path.join(root, "docs", "v0.1-design.md");
  const implementationPath = path.join(root, "docs", "implementation-plan.md");
  assert(fs.existsSync(designPath), "missing docs/v0.1-design.md", errors);
  assert(fs.existsSync(implementationPath), "missing docs/implementation-plan.md", errors);
  for (const doc of REQUIRED_DOCS) {
    assert(fs.existsSync(path.join(root, doc)), `missing required doc: ${doc}`, errors);
  }
  const repoMarketplace = path.join(root, "..", "..", ".agents", "plugins", "marketplace.json");
  const privateMarketplaceExample = path.join(root, "marketplace.private.example.json");
  assert(
    fs.existsSync(repoMarketplace) || fs.existsSync(privateMarketplaceExample),
    "missing repo marketplace index or private marketplace example",
    errors
  );
  const design = fs.existsSync(designPath) ? fs.readFileSync(designPath, "utf8") : "";
  const implementation = fs.existsSync(implementationPath) ? fs.readFileSync(implementationPath, "utf8") : "";
  const roadmapPath = path.join(root, "docs", "phased-roadmap.md");
  const roadmap = fs.existsSync(roadmapPath) ? fs.readFileSync(roadmapPath, "utf8") : "";

  for (const skill of REQUIRED_SKILLS) {
    const skillPath = path.join(root, "skills", skill, "SKILL.md");
    assert(fs.existsSync(skillPath), `missing skill: ${skill}`, errors);
    assert(design.includes(`\`${skill}\``), `v0.1 design does not mention skill: ${skill}`, errors);
    if (fs.existsSync(skillPath)) {
      const skillText = fs.readFileSync(skillPath, "utf8");
      for (const section of REQUIRED_SKILL_SECTIONS) {
        assert(skillText.includes(section), `skill ${skill} missing section: ${section}`, errors);
      }
    }
  }

  for (const script of REQUIRED_SCRIPTS) {
    assert(fs.existsSync(path.join(root, "scripts", script)), `missing script: ${script}`, errors);
    assert(design.includes(`\`${script}\``), `v0.1 design does not mention script: ${script}`, errors);
  }

  for (const schema of REQUIRED_SCHEMAS) {
    assert(fs.existsSync(path.join(root, "references", schema)), `missing schema: ${schema}`, errors);
    assert(design.includes(`references/${schema}`), `v0.1 design does not mention schema: ${schema}`, errors);
  }

  validateRequestFixture(root, errors);
  assert(design.includes("docs/quickstart.md"), "v0.1 design must mention docs/quickstart.md", errors);
  assert(design.includes("docs/help.md"), "v0.1 design must mention docs/help.md", errors);
  assert(design.includes("docs/phased-roadmap.md"), "v0.1 design must mention docs/phased-roadmap.md", errors);
  assert(design.includes("docs/customer-install.md"), "v0.1 design must mention docs/customer-install.md", errors);
  assert(design.includes("docs/customer-pilot.md"), "v0.1 design must mention docs/customer-pilot.md", errors);
  assert(design.includes("docs/support-playbook.md"), "v0.1 design must mention docs/support-playbook.md", errors);
  assert(design.includes("docs/release-management.md"), "v0.1 design must mention docs/release-management.md", errors);
  assert(design.includes("docs/project-rule-pack-template.md"), "v0.1 design must mention docs/project-rule-pack-template.md", errors);
  assert(design.includes("docs/review-capability-enhancement.md"), "v0.1 design must mention docs/review-capability-enhancement.md", errors);
  assert(design.includes("docs/host-adapter.md"), "v0.1 design must mention docs/host-adapter.md", errors);
  assert(design.includes("docs/commercial-operations.md"), "v0.1 design must mention docs/commercial-operations.md", errors);
  assert(design.includes("references/release-manifest.json"), "v0.1 design must mention references/release-manifest.json", errors);
  assert(design.includes("templates/project-rule-pack"), "v0.1 design must mention templates/project-rule-pack", errors);
  assert(design.includes("review-scorecard.js"), "v0.1 design must mention review-scorecard.js", errors);
  assert(design.includes("host-adapter.js"), "v0.1 design must mention host-adapter.js", errors);
  assert(design.includes("commercial-readiness-check.js"), "v0.1 design must mention commercial-readiness-check.js", errors);
  assert(design.includes("customer-pilot.js"), "v0.1 design must mention customer-pilot.js", errors);
  assert(design.includes("support-bundle.js"), "v0.1 design must mention support-bundle.js", errors);
  assert(implementation.includes("IMPL-018"), "implementation plan must define IMPL-018", errors);
  assert(implementation.includes("IMPL-019"), "implementation plan must define IMPL-019", errors);
  assert(implementation.includes("IMPL-020"), "implementation plan must define IMPL-020", errors);
  assert(implementation.includes("IMPL-021"), "implementation plan must define IMPL-021", errors);
  assert(implementation.includes("IMPL-022"), "implementation plan must define IMPL-022", errors);
  assert(implementation.includes("IMPL-023"), "implementation plan must define IMPL-023", errors);
  assert(design.includes("QG-011"), "v0.1 design must define QG-011 design contract validation", errors);
  assert(implementation.includes("IMPL-001"), "implementation plan must define IMPL-001", errors);
  assert(implementation.includes("Definition of Done"), "implementation plan must define Definition of Done", errors);
  for (const section of [
    "项目目标",
    "项目产出",
    "项目测试",
    "验收结果",
    "阶段设计",
    "阶段实现",
    "初次测试",
    "修正复测",
    "完成验收",
    "本地提交",
    "commit hash",
    "回滚方式"
  ]) {
    assert(roadmap.includes(section), `phased roadmap must include ${section}`, errors);
  }
  for (const phase of ["P0", "P1", "P2", "P3", "P4", "P5", "P6"]) {
    assert(roadmap.includes(phase), `phased roadmap must include phase ${phase}`, errors);
  }
  return errors;
}

if (require.main === module) {
  runCli("QG-011 design contracts", () => validateDesignContracts());
}

module.exports = { validateDesignContracts };
