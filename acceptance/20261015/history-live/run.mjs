import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { ROOT } from '../../../lib/workspace.mjs';

// Evidence for CLI commands executed by the current Codex conversation.
// This is not a model runner and does not fabricate assistant/session events.
const directory = path.dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const sequence = fs.readdirSync(directory).filter(n => /^\d{2}-command\.json$/.test(n)).length + 1;
const started = Date.now();
const result = spawnSync(process.execPath, [path.join(ROOT, 'bin/ai-writer.mjs'), ...args], { cwd: ROOT, encoding: 'utf8' });
const evidence = { scope: 'actual-cli-command-only', execution: 'current-codex-conversation',
  command: [process.execPath, 'bin/ai-writer.mjs', ...args], exit_code: result.status,
  elapsed_ms: Date.now() - started, stdout: result.stdout, stderr: result.stderr, error: result.error?.message ?? null };
fs.writeFileSync(path.join(directory, `${String(sequence).padStart(2, '0')}-command.json`), JSON.stringify(evidence, null, 2) + '\n', { flag: 'wx', encoding: 'utf8' });
if (result.status === 0 && ['context', 'record-template'].includes(args[0])) {
  const unit = args[args.indexOf('--unit') + 1];
  fs.writeFileSync(path.join(directory, `${args[0]}-${unit}.json`), result.stdout, { flag: 'wx', encoding: 'utf8' });
}
console.log(result.stdout || result.stderr || result.error?.message);
process.exitCode = result.status ?? 1;
