#!/usr/bin/env node
import { main } from '../lib/workspace.mjs';
try {
  const result = main(process.argv.slice(2));
  console.log(result.help ?? JSON.stringify(result, null, 2));
  if (result.ok === false) process.exitCode = 1;
} catch (error) {
  console.error(JSON.stringify({ ok: false, error: error.message }, null, 2));
  process.exitCode = 2;
}
