"use strict";

const fs = require("fs");
const path = require("path");
const { buildPrivatePackage } = require("./build-private-package");
const { validateCustomerInstall } = require("./customer-install-smoke");
const { initProjectRulePack } = require("./init-project-rule-pack");
const { pluginRoot } = require("./lib");

const PLUGIN_NAME = "story-gate-studio";

function parseArgs(argv) {
  const args = {
    project: null,
    name: null,
    mode: "novel",
    force: false,
    initRulePack: true,
    smoke: true
  };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--project") {
      args.project = argv[++i];
    } else if (arg === "--name") {
      args.name = argv[++i];
    } else if (arg === "--mode") {
      args.mode = argv[++i];
    } else if (arg === "--force") {
      args.force = true;
    } else if (arg === "--skip-rule-pack") {
      args.initRulePack = false;
    } else if (arg === "--skip-smoke") {
      args.smoke = false;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }
  if (!args.project) throw new Error("Missing --project <directory>");
  return args;
}

function slugify(value) {
  const slug = String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
  if (!/^[a-z0-9][a-z0-9-]{1,62}[a-z0-9]$/.test(slug)) {
    return "story-project";
  }
  return slug;
}

function isInside(parent, child) {
  const relative = path.relative(parent, child);
  return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative));
}

function assertInsideProject(projectRoot, target) {
  if (!isInside(projectRoot, target)) {
    throw new Error(`Refusing to write outside project root: ${target}`);
  }
}

function readJsonIfExists(file) {
  if (!fs.existsSync(file)) return null;
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function writeJson(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function upsertMarketplace(projectRoot) {
  const marketplacePath = path.join(projectRoot, ".agents", "plugins", "marketplace.json");
  const marketplace = readJsonIfExists(marketplacePath) || {
    name: "story-gate-local",
    interface: {
      displayName: "Story Gate Local"
    },
    plugins: []
  };
  if (!Array.isArray(marketplace.plugins)) marketplace.plugins = [];

  const entry = {
    name: PLUGIN_NAME,
    source: {
      source: "local",
      path: `./plugins/${PLUGIN_NAME}`
    },
    policy: {
      installation: "AVAILABLE",
      authentication: "ON_INSTALL"
    },
    category: "Productivity"
  };

  const existing = marketplace.plugins.findIndex(plugin => plugin && plugin.name === PLUGIN_NAME);
  if (existing >= 0) {
    marketplace.plugins[existing] = entry;
  } else {
    marketplace.plugins.push(entry);
  }

  writeJson(marketplacePath, marketplace);
  return marketplacePath;
}

function installLocal(options = {}) {
  const root = options.root || pluginRoot();
  const projectRoot = path.resolve(options.project);
  const projectName = options.name || slugify(path.basename(projectRoot));
  const pluginOut = path.join(projectRoot, "plugins", PLUGIN_NAME);
  const rulePackOut = path.join(projectRoot, "story-gate-projects", projectName);

  assertInsideProject(projectRoot, pluginOut);
  assertInsideProject(projectRoot, rulePackOut);

  if (isInside(root, projectRoot)) {
    throw new Error("Refusing to install into the source plugin workspace. Choose a separate project root.");
  }
  if (fs.existsSync(pluginOut)) {
    if (!options.force) {
      throw new Error(`Plugin already installed: ${pluginOut}. Use --force to replace it.`);
    }
    assertInsideProject(projectRoot, pluginOut);
    fs.rmSync(pluginOut, { recursive: true, force: true });
  }

  fs.mkdirSync(projectRoot, { recursive: true });
  const packageReport = buildPrivatePackage({
    root,
    out: pluginOut,
    verify: true
  });

  const marketplace = upsertMarketplace(projectRoot);
  let rulePack = null;
  if (options.initRulePack !== false) {
    rulePack = initProjectRulePack({
      root,
      out: rulePackOut,
      name: projectName,
      mode: options.mode || "novel",
      force: Boolean(options.force)
    });
  }

  const smokeErrors = options.smoke === false ? [] : validateCustomerInstall(pluginOut, { full: false });
  return {
    verdict: packageReport.verdict === "pass" && smokeErrors.length === 0 && (!rulePack || rulePack.verdict === "pass") ? "pass" : "blocked",
    project: projectRoot,
    plugin: pluginOut,
    marketplace,
    project_rule_pack: rulePack ? rulePack.output : null,
    smoke: options.smoke === false ? "skipped" : "pass",
    errors: [...packageReport.errors, ...(rulePack ? rulePack.errors : []), ...smokeErrors]
  };
}

function run(argv = process.argv.slice(2)) {
  try {
    const args = parseArgs(argv);
    const report = installLocal(args);
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

module.exports = { installLocal, parseArgs, slugify, upsertMarketplace, run };
