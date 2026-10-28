import fs from 'node:fs';
import crypto from 'node:crypto';
const root = new URL('./work/', import.meta.url);
const read = p => fs.readFileSync(new URL(p, root), 'utf8');
const sha = p => crypto.createHash('sha256').update(fs.readFileSync(new URL(p,root))).digest('hex');
const save = (p,v) => fs.writeFileSync(new URL(p,root),JSON.stringify(v,null,2)+'\n',{flag:'wx'});
const state = JSON.parse(read('.writer/state.json'));
const phase=process.argv[2];
const author_evidence={quote:'本会话只做第一阶段：根据实际情节与既有分卷合约，规划并真实创作至少两章，目标每章汉字不少于 4200；分段、合章、实读、审查、预览、原生登记，保持事实与作者声音，不能靠机械重复凑篇幅。',local_source:'研究/AN轮真实用户授权.md',source_sha256:sha('研究/AN轮真实用户授权.md'),locator:'本次用户消息第二段；本地原话文件第7行，无消息ID',recorded_by:'Codex AN session A actual user instruction'};
if(phase==='outline'||phase==='draft') {
 const drafting=phase==='draft';
 const refs=drafting?['大纲/单元/0119.json','大纲/单元/0120.json']:[];
 save(`研究/AN-a-workflow-${phase}.json`,{expected_revision:state.revision,operation_id:`AN-a-${phase}-119-120-v1`,author_evidence,workflow:{stage:drafting?'drafting':'outline',task:'AN会话A：依据118已成稿规划并分段创作119—120，每章目标正文汉字至少4200；完整实读、审查、原生合章/preview/record后保存交接，不写121，不改旧章。',authorization:{allowed_actions:drafting?['discuss','plan','draft']:['discuss','plan'],draft_range:drafting?{from:119,to:120}:null,revise_range:null,stop_conditions:['120登记、115—120滚动实读登记及本会话报告后停止新正文。','仅写AN work及父目录，不改旧封存、真实作品、工具、Git。','不将新卷计划、客户预期、发出或收款推成外部最终使用/文学验收。']},planning:{positioning:{status:'draft',refs:['设定/作品定位.md','设定/文风.md'],unresolved_ids:[]},structure:{status:'draft',refs:['大纲/AN轮119-122未来规划.md'],unresolved_ids:['121—122只保留职责，待120实际后果再细化']},volume:{status:'draft',refs:['大纲/AN轮119-122未来规划.md'],unresolved_ids:[]},outline:{status:'draft',refs,unresolved_ids:drafting?[]:['待建立119—120实际细纲']}}}});
}
if(phase==='plans') {
 save('研究/AN-a-volume19.json',{id:'V19',title:'交到别人手里的东西',start:119,end:122,promises:['让一项真实工作从询问、取材走到有限交付，展示钱、用途和相处时间怎样相互牵动'],constraints:['承接118真实状态，旧自录报价例及顾初版反馈不追改成已售服务','工作素材只用本次顾本人新录，私人纸稿与旧站资料不用','沈有限第三人称；收件人未出场的使用效果不编造'],reserved:['余带未知男声与钟声、剪者、日期及罗私人原因','旧款押金与未核到家/取样/修镜等事项','长期订单和客户终端使用效果'],arcs:[{id:'A19a',start:119,end:120,goal:'顾提出一段本人新录的收音机操作口述；沈从真实用途商定录剪小单并完成有限交付',payoff:'实际新素材、付费范围和交付版本可追溯，不用自录示例代交成品',forbidden:['把沈写成机器维修鉴定人','补录冒充原句恢复','将向顾交付推成远处收件人已会操作']},{id:'A19b',start:121,end:122,goal:'依据120成稿后果再细化职业与生活的后续安排',payoff:'尚为未来计划，不预定回款之外的新单、认可或关系承诺',forbidden:['未细化写正文','新卷重复讲旧例或重开已结线索']}]});
 const common={cast:['沈禾','顾遥'],setting_refs:['设定/文风.md','设定/权威规则.md','大纲/AN轮119-122未来规划.md'],research_refs:[],arc_id:'A19a',recall_ids:['I_PRICE_EXAMPLE_109','P_GU_SAMPLE72_116']};
 save('研究/AN-a-plan119.json',{...common,unit:119,title:'这回要的是一段声音',goal:'接住顾的新询问，在看到实际素材与用途之后决定是否接一份小单',change:'从自用说明试用转为顾付费的本人新录剪辑；双方商定160元固定小单、先付80、明日午前交付，实际新录由沈带回',beats:['73日早饭后顾消息询问本人录的收音机操作说明，沈先问用途并约10:20到店，不复发粥例','顾要随修好机器寄给外地收件人，实听两分多口述；沈发现无画面指这边和前后顺序均不清，不能靠降噪替他定维修操作','不让顾当抽象试用者；在店里实际对着机器演一遍，顾确认动作并亲自重录，生活店务打断与双方时间成本进入场景','依据新任务另议160固定价、当日下午给初剪、一次合并口误/漏句修改和74日午前交；先付80实际确认，旧240仍例价','完成一次补录并保存原录，沈回家吃热透余米炒蛋、核本次资料，开工留第一版到下一章；不预写最终交付'] ,forbidden:['119不写120尚未交付的成果','旧720仍未接，两笔240不挪充本单','顾72日修后自用例未收；新工作不证明那套已好用','不写外地收件人已听懂，不确定型号/寄件身份不补']});
 save('研究/AN-a-plan120.json',{...common,unit:120,title:'把这一句放在前头',goal:'完成顾的新录音小单，在实际播放中核对动作顺序并交到顾手里',change:'一版缺失先调低音量的提醒促成顾新补录；修后由顾实听与本人机器对照并付尾80，收件人的使用仍未知',beats:['73日下午沈从头实听新原录，剪停顿口误、均衡音量但留辨认所需空隙；把顾操作口述中的指代核成可听步骤','初剪发顾，保留源与初剪；顾边放机器边试，发现应先提醒音量拧低，不是只把原句拖前便有完整口述','顾在店务间隙补录新句，沈清楚区分新录与旧录，处理衔接与音量，不把后来确认说成原来就有','顾想顺便加一段另机说明，沈给出另需完整录材与时间，顾撤回本次追加，不用道德说教替代工期','沈将完整修后稿自己从头听，再实际交付顾；顾在自有手机听到底并对机器操作，确认当前收齐转尾80；她实际收齐160，不预报远处反馈','天晚离店或在家收工，有关饭与身体的行动体现一日劳动代价；以实际结束余韵收束而非重复边界总结'],forbidden:['技术名词讲课或逐句合规清单','将顾本人试用推成外地人会用或正式验收','新160不等同109的240听辨价成交','不让沈替顾承诺维修安全或把后期补成原话']});
}
