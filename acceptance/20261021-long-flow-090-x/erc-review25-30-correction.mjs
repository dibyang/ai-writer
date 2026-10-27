import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {fileURLToPath} from 'node:url';
const X=path.dirname(fileURLToPath(import.meta.url)),h=JSON.parse(fs.readFileSync(path.join(X,'cli-logs/e-begin/stdout.raw.txt'),'utf8')),r=JSON.parse(fs.readFileSync(path.join(X,'er-review25-30-erc-final.json'),'utf8'));
r.comparison.similar_structures[0].evidence.push({unit:27,quote:'久了还能摸着一点，换个坐法就过去了。'});
const old=r.report;r.report='审查/X-ERC25-30完整连读-引文补正.md';r.operation_id='X_ERC_25_30_r192_evidence_corrected';
for(const c of r.comparison.similar_structures)for(const n of c.units)assert(c.evidence.some(e=>e.unit===n));
fs.writeFileSync(path.join(h.workspace,r.report),fs.readFileSync(path.join(h.workspace,old),'utf8')+'\n\n## 原review失败与补正\n\ncli-logs/erc-review25-30原产品exit2（包装进程exit1），REVIEW_EVIDENCE_REQUIRED。第一组比较列27但漏附其引文；当前补上27实际原句“久了还能摸着一点，换个坐法就过去了。”；原报告/输入保留，state未变，完整阅读范围不变。\n',{flag:'wx'});
fs.writeFileSync(path.join(X,'erc-review25-30-corrected.json'),JSON.stringify(r,null,2)+'\n',{flag:'wx'});
