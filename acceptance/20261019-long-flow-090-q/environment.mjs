import fs from 'node:fs';import crypto from 'node:crypto';
const executable='C:/Users/admin/AppData/Local/OpenAI/Codex/bin/896a0166b774037a/codex.exe',bytes=fs.readFileSync(executable);
console.log(JSON.stringify({node:process.version,platform:process.platform,arch:process.arch,codex_executable:executable,codex_bytes:bytes.length,codex_sha256:crypto.createHash('sha256').update(bytes).digest('hex'),scope:'Current local environment only; no global configuration read or modified by this probe.'},null,2));
