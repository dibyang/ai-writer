import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
const base=path.dirname(fileURLToPath(import.meta.url));
const refs=[];
for (const m of fs.readFileSync(path.join(base,'README.md'),'utf8').matchAll(/\[[^\]]*\]\(([^)]+)\)/g)) {
  const ref=m[1].split('#')[0]; if (!ref || /^https?:/.test(ref)) continue;
  if(ref==='evidence-manifest.json') { refs.push({ref,state:'created by final seal after this check'}); continue; }
  assert.equal(fs.existsSync(path.resolve(base,decodeURIComponent(ref))),true,ref); refs.push({ref,state:'present'});
}
console.log(JSON.stringify({ok:true,report:'README.md',checked:refs.length,refs}));
