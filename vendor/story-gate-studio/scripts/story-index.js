"use strict";

const fs = require("fs");
const path = require("path");
const { listFiles, pluginRoot } = require("./lib");

function buildIndex(target = pluginRoot()) {
  const root = path.resolve(target);
  const files = listFiles(root, file => [".md", ".json"].includes(path.extname(file).toLowerCase()));
  return {
    index_id: "sgm-script-story-index",
    root: path.relative(pluginRoot(), root) || ".",
    file_count: files.length,
    files: files.map(file => path.relative(root, file)).sort()
  };
}

if (require.main === module) {
  console.log(JSON.stringify(buildIndex(process.argv[2]), null, 2));
}

module.exports = { buildIndex };
