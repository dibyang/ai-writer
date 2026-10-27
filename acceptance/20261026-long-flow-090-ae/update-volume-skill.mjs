import fs from 'node:fs';
import assert from 'node:assert/strict';
const file=new URL('../../.agents/skills/writer-project/SKILL.md',import.meta.url);
const original=fs.readFileSync(file,'utf8');
const before='4. 动笔前 `record-template --unit N --draft 正文/实际文件名.md` 保存真实来源哈希与当前 revision。';
const after='4. 动笔前 `record-template --unit N` 保存真实来源哈希与当前 revision。采用返回的 draft（与 context.draft_path 一致）：长篇默认 `正文/卷ID-卷名/章号-标题.md`，按需创建父目录。分段合章省略 draft 使用同一默认路径；自定新路径或旧稿修订时显式传 --draft，并在合章/登记中保持一致。旧正文不因卷名或工具更新自动搬迁。';
assert.equal(original.split(before).length,2);
fs.writeFileSync(file,original.replace(before,after));
console.log(JSON.stringify({ok:true,file:file.pathname,replacements:1}));
