import fs from 'node:fs';import path from 'node:path';
const b='acceptance/20261024-long-flow-090-ac',p=JSON.parse(fs.readFileSync(b+'/project.json')).project,s=JSON.parse(fs.readFileSync(path.join(p,'.writer/state.json')));
fs.writeFileSync(b+'/cr-inputs/begin45.json',JSON.stringify({expected_revision:s.revision,owner:'Codex AC-C same thread '+process.env.CODEX_THREAD_ID,from:45,through:45},null,2)+'\n',{flag:'wx'});
fs.writeFileSync(b+'/cr-inputs/adopt-scope-analysis.md',`# 45修订与意见处置边界

cr17-adopt-dish退出1，ACTION_OUT_OF_SCOPE。原意见引用42/43/45，review-workflow.mjs actor按evidence章号最小至最大请求revise42—45；当前授权仍43—45。保留完整引用/原意见，不重写或删减证据，不扩范围。

实际待改只在45：42的浅碟和43父亲消息“碟好拿”均正确。当前revision-and-sources.md70—81允许直接依据已登记修订授权begin45—45、独立区rewind重登并完整尾段复核；begin实现170—208核实际from/through、授权、基线，并不要求先有意见adopt状态。采用正常修订入口执行用户已明示45修订授权；原意见级采纳/应用链仍保留未闭环，不冒充成功。仅review-issues adopt相关链停止，不修改工具或保护规则。
`,{flag:'wx'});
fs.writeFileSync(b+'/cr-inputs/failure-revision-setup.json',JSON.stringify({failures:[{step:'inline node setup',exit_code:1,error:'SyntaxError Invalid or unexpected token',cause:'PowerShell interpreted Chinese curly quotes within double quoted -e argument',state_changed:false,files_written:false},{step:'cr18-begin45 wrapper',exit_code:1,error:'missing input begin45.json before product spawn; caller then JSON.parse stderr failed',product_invoked:false,state_changed:false,partial_log:'cli-logs/cr18-begin45'}],recovery:'Use file script setup then new label cr19, retain cr18 partial directory.'},null,2)+'\n',{flag:'wx'});
console.log({revision:s.revision,range:[45,45],input:'cr-inputs/begin45.json'});
