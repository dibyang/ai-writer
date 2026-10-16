"use strict";

const fs = require("fs");
const path = require("path");
const { checkProjectRulePack } = require("./project-rule-pack-check");
const { pluginRoot, readJson } = require("./lib");

const ALLOWED_MODES = new Set(["novel", "visual", "screenplay", "short_drama"]);

function parseArgs(argv) {
  const args = { out: null, name: null, mode: "novel", force: false };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--out") {
      args.out = argv[++i];
    } else if (arg === "--name") {
      args.name = argv[++i];
    } else if (arg === "--mode") {
      args.mode = argv[++i];
    } else if (arg === "--force") {
      args.force = true;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }
  if (!args.out) throw new Error("Missing --out <directory>");
  if (!args.name) throw new Error("Missing --name <project-slug>");
  if (!/^[a-z0-9][a-z0-9-]{1,62}[a-z0-9]$/.test(args.name)) {
    throw new Error("--name must be lowercase kebab-case, 3-64 characters");
  }
  if (!ALLOWED_MODES.has(args.mode)) {
    throw new Error(`Unsupported --mode: ${args.mode}`);
  }
  return args;
}

function isInside(parent, child) {
  const relative = path.relative(parent, child);
  return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative));
}

function buildRulePack(template, name, mode) {
  const rulePack = JSON.parse(JSON.stringify(template));
  const prefix = name.toUpperCase().replace(/-/g, "_");
  rulePack.rule_pack = name;
  rulePack.modes = [mode];
  rulePack.modules[0].module_id = `${prefix}-CUSTOM-001`;
  rulePack.modules[0].mode = mode;
  rulePack.rules[0].rule_id = `${prefix}-CUSTOM-001-R001`;
  rulePack.rules[0].module_id = `${prefix}-CUSTOM-001`;
  return rulePack;
}

function initProjectRulePack(options = {}) {
  const root = options.root || pluginRoot();
  const out = path.resolve(root, options.out);
  if (isInside(root, out)) {
    throw new Error("Refusing to initialize a customer project rule pack inside the plugin root.");
  }

  const templateRoot = path.join(root, "templates", "project-rule-pack");
  const template = readJson(path.join(templateRoot, "rule-pack.template.json"));
  const readmeTemplate = fs.readFileSync(path.join(templateRoot, "README.md"), "utf8");
  const rulePackPath = path.join(out, "rule-pack.json");
  const readmePath = path.join(out, "README.md");

  if (!options.force && (fs.existsSync(rulePackPath) || fs.existsSync(readmePath))) {
    throw new Error("Target project rule-pack files already exist; use --force to replace them.");
  }

  fs.mkdirSync(out, { recursive: true });
  const rulePack = buildRulePack(template, options.name, options.mode || "novel");
  const readme = `${readmeTemplate}\n\nGenerated project: \`${options.name}\`\nMode: \`${options.mode || "novel"}\`\n`;

  fs.writeFileSync(rulePackPath, `${JSON.stringify(rulePack, null, 2)}\n`, "utf8");
  fs.writeFileSync(readmePath, readme, "utf8");

  const errors = checkProjectRulePack(rulePackPath);
  return {
    verdict: errors.length === 0 ? "pass" : "blocked",
    output: out,
    rule_pack: rulePackPath,
    readme: readmePath,
    errors
  };
}

function run(argv = process.argv.slice(2)) {
  try {
    const args = parseArgs(argv);
    const report = initProjectRulePack(args);
    console.log(JSON.stringify(report, null, 2));
    return report.verdict === "pass" ? 0 : 1;
  } catch (error) {
    console.error(error.message || String(error));
    return 2;
  }
}

if (require.main === module) {
  process.exitCode = run();
}

module.exports = { buildRulePack, initProjectRulePack, run };
