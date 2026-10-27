import fs from 'node:fs';import crypto from 'node:crypto';
const P=new URL('./scenario/东岸末班船-再扩展验证/',import.meta.url);
const r=p=>fs.readFileSync(new URL(p,P)),h=p=>crypto.createHash('sha256').update(r(p)).digest('hex');const put=(p,v)=>fs.writeFileSync(new URL(p,P),typeof v==='string'?v:JSON.stringify(v,null,2)+'\n',{flag:'wx'});
const draft='正文/0036-灯下还有一页-dr-v2.md',text=r(draft).toString(),quote='告诉她十二块，自己原以为是前回看过那一本';
if(!text.includes(quote))throw Error('quote mismatch');
const report='审查/X-DR36书约知情遗漏-发现.md';
put(report,`# 36追踪知情遗漏发现

r159主稿，当前36 SHA ${h(draft)}。本会话刚在36登记后用dr-window-current before/after完成31—36共18次原生完整单调分页阅读，两边state/units/snapshot/稿SHA相同。随后按ID正式recall三链，确认真实硬问题而非提示自动认错。

36:11女已向许蓉说12元及沈18元没买；36:60—68沈亲告父自己没买18/女买12，36:92又给父看红花照片。snapshot.characters及P_DR_FLOWER_BOOK已更新，T_X_BOOK_COMPANY.character_known却保留35末两项：许蓉“亲见女归家书袋未知价格页/沈决定。”、沈成林“仅亲听女出门，未获本次买否结果。”没有历史日期限定，会使未来召回错误地判当前不知。发现范围从36至当前末章36；35当时未知正确，不回改35/34。

已在用户可见进度中报告根；按本次用户明确“发现已登记旧稿真问题报根并正式修订，不直接改主稿”授权执行正式36独立区tracking修订。正文正确保持原SHA，旧输入、初次报告与首个六章pass全部保留，不通过改正文/加空白制造实改。仅补36两项实际已知，并绑定当前原句；其余未变字段保留。需正式意见采用、独立区rewind/replay/preview/record、尾段完整阅读review、prepare/commit及tracking apply/verify；之后主当前六章重新完整单调连读/正式review。

另：25首次锚点当前为v2 SHA ${h('正文/0025-衣袖落下来-v2.md')}，本次已原生完整读取101—200/201—290；此前读v1只属历史补充，不能冒充当前v2。当前锚点茶25:143/167、书25:206/226、衣25:243/271，均已从当前返回原文核实。
`);
put('.writer/drafts/dr-review36-discovery.json',{from:36,to:36,kind:'model-self-review',expected_revision:159,operation_id:'x-dr36-knowledge-discovery',report,source_hashes:{[draft]:h(draft)},issues:[{id:'I_X_DR36_BOOK_KNOWLEDGE',type:'continuity',severity:'minor',confidence:'high',statement:'36正文已让许母/沈父听到12元花书与18元未购，书约链两人知情仍保留35末未知，须正式tracking修订36。',suggestion:'保持36正文和35历史原字节，仅在36重登changes补T_X_BOOK_COMPANY.character_known许蓉/沈成林两项及真实引文。',evidence:[{unit:36,quote}]}]});
const source='研究/X-DR追踪修订授权摘录.md',q='发现已登记旧稿真问题报根并正式修订，不直接改主稿。';
put(source,'# 本次用户续程授权摘录\n\n'+q+'\n\n来源：2026-10-21本次用户同ID恢复X-D消息，线程01a15dfa-2d52-7962-a1be-a5d2fc3967f4，无单条消息ID。为修订已确认的36追踪遗漏摘录，不伪称作者逐项采纳代理新细节。\n');
const wf=JSON.parse(r('.writer/drafts/dr-workflow-adopt36.json'));wf.expected_revision=160;wf.operation_id='x-dr36-tracking-authorized';
wf.author_evidence={quote:q,local_source:source,source_sha256:h(source),locator:'本次用户续程消息末章复盘段，真实线程同上，无单条消息ID',recorded_by:'X-D同ID续程代理'};
wf.workflow.stage='revision';wf.workflow.task='36登记遗漏两项书约角色知情，已报告根；正式独立区tracking修订36至末章36，正文SHA/34及所有前缀不变，完后重新当前31—36复盘并paused仅discuss，37未授权。';
wf.workflow.authorization.allowed_actions=['discuss','plan','revise'];wf.workflow.authorization.draft_range=null;wf.workflow.authorization.revise_range={from:36,to:36};
put('.writer/drafts/dr-workflow-revision36.json',wf);
put('.writer/drafts/dr-revision36-begin.json',{expected_revision:161,owner:'X-D-same-thread-dr-tracking36',from:36,through:36});
console.log(JSON.stringify({report,input:'.writer/drafts/dr-review36-discovery.json'}));
