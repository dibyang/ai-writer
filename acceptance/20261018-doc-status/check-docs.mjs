import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
const root=process.cwd(),refs=['README.md','docs/authoring-governance-status.md','docs/authoring-governance-design.md','docs/authoring-governance-b-implementation.md','docs/authoring-governance-c-implementation.md','docs/authoring-governance-d-implementation.md','docs/recovery-hardening-e.md','docs/revision-and-sources.md','docs/workflow.md','docs/verification.md','acceptance/20261018-doc-status/README.md'];
let links=0;const files=[];for(const ref of refs){const full=path.resolve(root,ref),b=fs.readFileSync(full),s=b.toString('utf8');assert.equal(s.includes('\uFFFD'),false,ref);for(const match of s.matchAll(/\[[^\]\n]*\]\(([^)\n]+)\)/g)){const raw=match[1];if(/^(?:https?:|app:|#)/.test(raw))continue;const dest=decodeURIComponent(raw.split('#')[0].replace(/^<|>$/g,''));assert.equal(fs.existsSync(path.resolve(path.dirname(full),dest)),true,ref+': '+dest);links++;}files.push({file:ref,bytes:b.length,sha256:crypto.createHash('sha256').update(b).digest('hex')});}
const status=fs.readFileSync('docs/authoring-governance-status.md','utf8');for(let i=1;i<=8;i++)assert.ok(status.includes('AW-0'+i));assert.ok(status.includes('151通过'));assert.ok(status.includes('复杂作者方案树'));assert.ok(status.includes('选择Markdown自动生成/重生成'));
const design=fs.readFileSync('docs/authoring-governance-design.md','utf8');for(const stale of ['状态：**设计候选，未实现、未验收**','当前命令尚不存在','下列均为**待执行用例**','这些细节尚未实现'])assert.equal(design.includes(stale),false,stale);
console.log(JSON.stringify({ok:true,files,local_links_checked:links,scope:'Documentation presence, links, encoding and stated current status; not semantic or literary acceptance'},null,2));
