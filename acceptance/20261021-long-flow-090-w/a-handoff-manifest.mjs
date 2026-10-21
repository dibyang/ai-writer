import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
const W=path.dirname(fileURLToPath(import.meta.url)),P=path.join(W,'scenario/东岸末班船-规模验证');
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const baseline=JSON.parse(fs.readFileSync(path.join(W,'baseline-worktree.json'),'utf8'));
const parts=JSON.parse(fs.readFileSync(path.join(W,'a-parts-final-measure.json'),'utf8'));
const files=['交接-A首停.md','a-recovery-reading.md','a-start-baseline.json','a-start-state.json','a-final-audit.json','a-parts-final-measure.json','originals/0013-01-before-self-review.md','originals/0013-02-before-self-review.md',
 ...['大纲/扩展骨架-W.md','大纲/近期细纲-W-13-15.md','研究/W-A-测试授权原文.md','审查/0013-前两段-A首停.md','.writer/drafts/w-a-context-13.json','.writer/drafts/w-a-record-template-13.json',...parts.parts.map(p=>p.path)].map(f=>'scenario/东岸末班船-规模验证/'+f)];
const entries=files.map(file=>{const b=fs.readFileSync(path.join(W,file));return {file,sha256:sha(b),bytes:b.length};});
function walk(root,rel){const dir=path.join(root,rel);if(!fs.existsSync(dir))return [];return fs.readdirSync(dir,{withFileTypes:true}).flatMap(d=>d.isDirectory()?walk(root,rel+'/'+d.name):d.isFile()?[rel+'/'+d.name]:[]);}
const oldFiles=new Set(baseline.files.map(f=>f.file));
const newManuscriptFiles=[...walk(P,'正文'),...walk(P,'分段')].filter(f=>!oldFiles.has(f)).sort();
const expected=['分段/0013/v1/01.md','分段/0013/v1/02.md'].sort();
const currentPartsMatch=parts.parts.every(p=>sha(fs.readFileSync(path.join(P,p.path)))===p.sha256);
const report={created_at:new Date().toISOString(),entries,new_manuscript_files:newManuscriptFiles,expected_new_manuscript_files:expected,current_parts_match_measured_hashes:currentPartsMatch,only_authorized_two_new_parts:JSON.stringify(expected)===JSON.stringify(newManuscriptFiles),note:'Final handoff file manifest. Does not claim literary or product acceptance.'};
fs.writeFileSync(path.join(W,'a-handoff-files.json'),JSON.stringify(report,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify(report,null,2));
if(!report.only_authorized_two_new_parts||!currentPartsMatch)process.exitCode=1;
