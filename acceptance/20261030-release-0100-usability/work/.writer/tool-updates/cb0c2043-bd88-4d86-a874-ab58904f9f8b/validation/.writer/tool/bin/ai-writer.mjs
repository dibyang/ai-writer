#!/usr/bin/env node
import { main, ROOT } from '../lib/workspace.mjs';
import { errorResult } from '../lib/help.mjs';
try {
  const result = main(process.argv.slice(2));
  console.log(result.help ?? JSON.stringify(result, null, 2));
  if (result.ok === false) process.exitCode = 1;
} catch (error) {
  console.error(JSON.stringify(errorResult(error, process.argv.slice(2), ROOT), null, 2));
  process.exitCode = 2;
}
