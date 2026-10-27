import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
const x=path.dirname(fileURLToPath(import.meta.url)),p=path.join(x,'scenario/东岸末班船-再扩展验证');
const sha=v=>crypto.createHash('sha256').update(v).digest('hex');
const j=f=>JSON.parse(fs.readFileSync(path.join(x,f),'utf8'));
const failed=j('commands/codex-b-resume/result.json');assert.equal(failed.exit_code,1);
const rows=fs.readFileSync(path.join(x,'commands/codex-b-resume/stdout.raw.txt'),'utf8').split(/\r?\n/).filter(Boolean).map(v=>JSON.parse(v));
assert(rows.some(v=>v.type==='turn.failed'&&/model is at capacity/.test(v.error?.message??'')));
const id=rows.find(v=>v.type==='thread.started')?.thread_id;assert(id);
const raw=fs.readFileSync(path.join(p,'.writer/state.json')),s=JSON.parse(raw);
assert.equal(s.revision,128);assert.equal(s.units.length,28);
assert.equal(sha(raw),j('cli-logs/br-template29/result.json').after_state_sha256);
const archive=path.join(x,'originals/b-capacity-stop'),files=[];
assert(!fs.existsSync(archive));
function save(ref){const v=fs.readFileSync(path.join(p,ref)),dest=path.join(archive,ref);fs.mkdirSync(path.dirname(dest),{recursive:true});fs.writeFileSync(dest,v,{flag:'wx'});files.push({file:ref,bytes:v.length,sha256:sha(v)});}
function walk(ref){for(const n of fs.readdirSync(path.join(p,ref)).sort()){const r=ref+'/'+n,st=fs.lstatSync(path.join(p,r));assert(!st.isSymbolicLink());st.isDirectory()?walk(r):save(r);}}
save('.writer/state.json');save('writer.json');for(const u of s.units)save(u.draft);
for(const ref of ['分段','设定','大纲','研究','.writer/drafts'])walk(ref);
assert.deepEqual(fs.readFileSync(path.join(p,'.writer/state.json')),raw);
fs.writeFileSync(path.join(x,'parent-b-capacity-stop-state.json'),raw,{flag:'wx'});
const proof={ok:true,at:new Date().toISOString(),scope:'actual model-capacity failure checkpoint; no state mutation after last successful product template',failed_invocation:'codex-b-resume',actual_exit_code:1,thread_id:id,revision:s.revision,state_sha256:sha(raw),units:28,archive,files};
fs.writeFileSync(path.join(x,'capacity-stop-b.json'),JSON.stringify(proof,null,2)+'\n',{flag:'wx'});
const prompt=`同ID恢复X-B外部容量中断。线程${id}。X=D:/work/other/ai-writer/acceptance/20261021-long-flow-090-x；P=X/scenario/东岸末班船-再扩展验证。前次codex-b-resume因Selected model is at capacity实际退出1，不是产品验收失败或作者暂停。只恢复现有有限29—30目标，不重写28、不写31。先读prompt-common.md、author-request.md、交接-B首停.md、capacity-stop-b.json、parent-b-capacity-stop-state.json。本次任务覆盖旧首次“29两段即停”的停点，明确继续已授权29余稿及30、25—30复盘后暂停。全部CLI唯一前缀brc-，不得复用旧br-标签/覆盖旧文件；新窗口标记brc-window-current。禁止另派代理、改根源码/旧封存/作者作品/提交推送/手改state和hash。

首个产品调用固定brc-entry-status，必须等于保存的真实r128/28章状态；再workflow/revision list/identify/doctor/discussion。原28正文8873字已登记，保持。现有第29章六段全部已写但未合章登记：01-四点十分-v2、02-柜前先亮的灯-v2，以及03-送到干板上-br-v1、04-早饭慢一点-br-v1、05-扣拿来了-br-v1、06-三点半走出去-br-v1，均在P/分段/0029-B。根已备份原字节。先原生逐行读真实六段和28当前结尾、现有.writer/drafts/br-template-29-r128.json及其真实来源，不重开清晨或重写旧两段。前次已发现04段“谁问几点”指代写反，尚未保存修正；按实际原文核实，必要改段另存新版本、保留原件。其余时空/送粉付款凭据/父自热早餐及沈只能语音得知/姑娘扣与所知/纱门再约均按原文逐项核，不只机械拼接。

目前workflow已在r128正式授权28—30；不要仅因模型容量报错而无故改workflow或刷新哈希。原模板若仍有效可使用；真实来源变化才保留旧输入、核影响并另取。context --out只用.writer/drafts下新JSON。第29最终需>=8000正文汉字/4—6实际段，实际SHA assemble到新路径，完整原生回读每次<=100行，纲文回对/四语言测试和当前报告双SHA，实际同一最终输入preview0后record。第30再真实plan/context/template、>=10000汉字（目标10500—11500）且至少5段，逐段接续/合章/全读/当前报告及preview→record；不灌水、不把计划算已发生。

30成功record后，node X/read-boundary.mjs brc-window-current before 30 25 30；原生FastCtx按25→30全部当前稿完整单调读，每次<=100行、精确续页、过程中不改state或正文，紧接after同参数。另读三链首次/最近实际锚点，保留跨后卷未兑现。完整六章比较报告逐章goal/obstacle/choice/consequence/relationship_change和实际引文、至少两类比较且每比较章都有当前原文，不拿词频/脚本做文学验收。正式review-template/review绑定当前稿；硬问题与optional_style分开。原24完整units/正文、全部原观察三字段保持；已登记真问题需正式修订。

完成后workflow paused仅discuss/draft_range=null/revise_range=null，task说明30完成、31未获当前会话授权。status/check/doctor/revisions/review-issues核无漂移/活跃修订/待恢复、必要滚动覆盖有效。保存交接-B完成.md和当前清单；如实记录原codex-b-resume容量失败1、本次实际结果、原片段/模板保留和三链未决。正常退出供根核验，不导出封存提交推送，不改首停交接。`;
fs.writeFileSync(path.join(x,'prompt-b-capacity-recovery.md'),prompt+'\n',{flag:'wx'});
console.log(JSON.stringify({ok:true,thread_id:id,revision:s.revision,files:files.length,prompt:'prompt-b-capacity-recovery.md'}));
