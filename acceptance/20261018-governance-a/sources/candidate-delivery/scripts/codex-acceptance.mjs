import fs from 'node:fs';
import path from 'node:path';
import { spawn, spawnSync } from 'node:child_process';
import { StringDecoder } from 'node:string_decoder';
import { ROOT } from '../lib/workspace.mjs';

// Explicitly invoked real-session acceptance; never part of npm test or doctor.
const [phase, launcher, campaign = '20261015', workdir = ROOT] = process.argv.slice(2);
if (!phase || !/^[a-z][a-z0-9-]*$/.test(phase) || !launcher || !path.isAbsolute(launcher) || !/^[a-zA-Z0-9-]+$/.test(campaign) || !path.isAbsolute(workdir)) {
  console.error('Usage: node scripts/codex-acceptance.mjs <phase> <absolute codex executable or codex.js> [campaign] [absolute cwd]');
  process.exit(2);
}
const directory = path.join(ROOT, 'acceptance', campaign, phase);
const request = fs.readFileSync(path.join(directory, 'request.md'), 'utf8');
const eventsFile = path.join(directory, 'events.jsonl');
// Preserve previous evidence on retries; use a new phase name instead.
const events = fs.openSync(eventsFile, 'wx');
const stderr = fs.openSync(path.join(directory, 'stderr.log'), 'wx');
const args = ['exec', '--json', '--sandbox', 'workspace-write', '-C', workdir, '--output-last-message', path.join(directory, 'final.md'), '-'];
const isJs = /\.m?js$/i.test(launcher);
const version = spawnSync(isJs ? process.execPath : launcher, isJs ? [launcher, '--version'] : ['--version'],
  { encoding: 'utf8', windowsHide: true, timeout: 10000 });
const started = Date.now();
let eventCount = 0, commands = 0, messages = 0, pending = '';
const decoder = new StringDecoder('utf8');
const child = spawn(isJs ? process.execPath : launcher, isJs ? [launcher, ...args] : args,
  { cwd: workdir, stdio: ['pipe', 'pipe', stderr], windowsHide: true });
child.stdout.on('data', chunk => {
  fs.writeSync(events, chunk);
  pending += decoder.write(chunk);
  const lines = pending.split('\n'); pending = lines.pop();
  for (const line of lines.filter(Boolean)) {
    try {
      const event = JSON.parse(line); eventCount++;
      if (event.type === 'item.completed' && event.item?.type === 'command_execution') commands++;
      if (event.type === 'item.completed' && event.item?.type === 'agent_message') {
        messages++; console.log(event.item.text);
      }
    } catch { /* Raw events remain available for diagnosis. */ }
  }
});
child.on('error', error => console.error(error.message));
child.stdin.on('error', error => console.error(`Codex stdin: ${error.message}`));
const timer = setInterval(() => console.log(JSON.stringify({ phase, running: true,
  elapsed_s: Math.round((Date.now() - started) / 1000), events: eventCount, commands, messages })), 30000);
child.on('close', (code, signal) => {
  clearInterval(timer); fs.closeSync(events); fs.closeSync(stderr);
  const result = { phase, launcher, codex_version: version.stdout?.trim(), node: process.version, platform: process.platform,
    exit_code: code, signal, elapsed_s: Math.round((Date.now() - started) / 1000),
    events: eventCount, commands, messages, directory, args };
  fs.writeFileSync(path.join(directory, 'process-result.json'), JSON.stringify(result, null, 2) + '\n', 'utf8');
  console.log(JSON.stringify(result)); process.exitCode = code ?? 1;
});
child.stdin.end(request);
