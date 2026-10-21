import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
const W=path.dirname(fileURLToPath(import.meta.url)),src=path.join(W,'scenario/东岸末班船-规模验证/分段/0013/v1/01.md');
fs.mkdirSync(path.join(W,'originals'),{recursive:true});
const raw=fs.readFileSync(src),dest=path.join(W,'originals/0013-01-before-self-review.md');
fs.writeFileSync(dest,raw,{flag:'wx'});
console.log(JSON.stringify({preserved:dest,sha256:crypto.createHash('sha256').update(raw).digest('hex'),reason:'Preserve first actual draft before length correction and local continuity edits'}));
