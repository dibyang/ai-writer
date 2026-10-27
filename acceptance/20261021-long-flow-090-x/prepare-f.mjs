import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
const x=path.dirname(fileURLToPath(import.meta.url)),p=path.join(x,'scenario/东岸末班船-再扩展验证'),j=f=>JSON.parse(fs.readFileSync(path.join(x,f),'utf8'));
assert.equal(j('commands/codex-e-network-recovery/result.json').exit_code,0);assert.equal(j('e-complete-verification.json').ok,true);
const raw=fs.readFileSync(path.join(p,'.writer/state.json')),s=JSON.parse(raw);
assert.equal(s.units.length,36);assert.equal(s.governance.stage,'paused');assert.deepEqual(s.governance.authorization.allowed_actions,['discuss']);assert.equal(s.governance.authorization.draft_range,null);assert.equal(s.governance.authorization.revise_range,null);
fs.writeFileSync(path.join(x,'parent-before-f-state.json'),raw,{flag:'wx'});
const prompt=`X-F全新独立会话：对E正式修订发布后的当前36章做全书恢复、全文回读及最终草稿导出核对。X=D:/work/other/ai-writer/acceptance/20261021-long-flow-090-x；P=X/scenario/东岸末班船-再扩展验证。先读prompt-common.md、author-request.md、交接-E完成.md、e-choice.json、e-complete-verification.json、d-tracking-fix-verification.json、source33-publish-verification.json。只在X活动，不另派代理，不碰旧W/真人作品/根产品，不Git提交/推送/发布，不付费/改全局配置。模型审查不称真人盲读/市场或正式发布验收。

第一产品调用固定f-entry-status，与parent-before-f-state.json完全相同；再实际workflow show/tool identify/revision list/doctor/context --purpose discussion，恢复当前暂停边界，不能因为next_unit37或已有计划就创作37。所有产品调用经x-writer.mjs唯一f-标签，全部--input用真实绝对文件，串行等前步0再依赖。不把discussion当独立命令，不猜捆绑docs/skill路径，复杂脚本写独立.mjs，失败保留原件用新标签重试，不运行创建失败的脚本。允许为全书正式review/issue verify变更P状态，禁止修改当前正文、章节路径或来源来迁就报告。

先稳定当前版本全书回读：node X/read-boundary.mjs f-current-full before 36 1 36；之后按state登记当前draft，从1到36单调完整FastCtx实读，每次<=100行按Partial精确续页，不读历史候选代替当前。可每6章在X根保存基于实际文本的语义阅读笔记以控制上下文；不在P写笔记/状态或正文。全书读完同边界after。边界期间P状态/正文不变。36章约24.6万汉字，摘要/脚本扫描不能算全文阅读，根会核实际public工具每页返回及当前SHA。

阅读全文后生成真正当前36章的全局审查：章间目标/选择/后果/关系变化重复性，人物各自声音和生活兴趣，句子/对白/因果/动线/数字/时间/物件/读者知道与角色知道的区别，指出可选风格与高置信硬错的不同。重点核受控修订课程100分钟19:00—20:40的13/18/24/30及钟面/后续时间，凳净宽29及17/18/21/23/24实际细节，返书15:20与22提前到店，19原提前90分钟工作变动/题文独立；不得把风扇27、柜26+55=81、15另日外出或29特殊15:30下班误改。核E所有重新登记后与新25—36承接，不把controlled变量说成原有bug。

新伏笔按当前实际文字：T_X_COAT_DAILY25布衣实穿→洗后/反馈→33老师实读，仍partial且未来实衣/下一课未知；T_X_TEA_AFTER_WORK25约下周四→32真实14—16到访和交流而非代修；T_X_BOOK_COMPANY25下下周日14→26/27各自问班→34前日互认→35实同行且女12元自购/沈18未买20未花→36父母已经听到真实结果，不让tracking退回35。日历30跳过周二，不每章硬加一天；36周日/周一后本周三不多一周。原箱漆O_BOX_PAINT不可变三字段且非排他归属证明，旅客终点/伤脚/远约未知不强结，80押金/35门费/81柜/84凳金额不混。CR33_INITIAL→RECALL_ID_V2从33有效，现33绑定冻结新bbc...对象而物理canonical旧c90...文件故意保留，按逻辑源解析，不能刷新所有hash掩盖问题。

实际全读后若发现高置信正文/追踪硬问题，停止依赖导出并保存真实原句/路径/SHA到X/f-blocker.json、报告和交接，正常退出向根报告；根将决定实际修复及新的当前回读，不能在本F静默改正文/手工state。无硬错则保存P/审查/X-F当前36章全书复核.md（引文逐字实际、含局限/可选保留，不给机械文学验收），按实际help正式review覆盖from1 through36和当前内容。旧I_F19_TITLE_TIME/V_A_U5_TIME_METADATA等已修意见若当前依赖变化，应基于本次全读当前报告正式issue verify并说明是复核，不重复改正文或假造新修复。可选风格意见保持未采用，不自动升级必改；旧stale由新当前覆盖而非篡改旧report。

复核成功后正式保持paused/discuss-only/draft_range=null/revise_range=null。先读export实际help与docs，用真实产品export到X/export-final下新的唯一文件，只导出state当前36章，显式草稿，历史候选/旧标题不混。固定export标签f-export-final，保留实际输入和输出。最终f-final-status/check/doctor/workflow/revision list/tool identify，报告当前unit36/无drift/无active lease/无pending窗口、全部过期审查是否有当前覆盖。保存X/交接-F完成.md与f-complete-summary.json，包含真实当前36章全文读取label、实际高置信问题与可选保留、review/issue复核输入、最终raw stateSHA/body汉字、导出路径/hash和没有写37的状态。不要声称草稿文学定稿/发布通过。正常退出供根独立核验和最终越界拒绝测试。`;
fs.writeFileSync(path.join(x,'prompt-f.md'),prompt+'\n',{flag:'wx'});
console.log(JSON.stringify({ok:true,units:36,revision:s.revision,prompt:'prompt-f.md'}));
