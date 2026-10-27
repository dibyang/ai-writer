import fs from 'node:fs';import path from 'node:path';
const a=path.resolve('acceptance/20261026-long-flow-090-ae');const x=JSON.parse(fs.readFileSync(path.join(a,'b-workflow-input.json')));
x.expected_revision=364;x.operation_id='AE_B_RESUME_AFTER_RECORD65_TO66_20261026';
x.author_evidence.locator='研究/AE作者任务.md第9—15行原话；根b-first-root-stop-verification.json与已激活B同ID恢复提示授权fixture续65/66及最终61—66实读审查。';
x.workflow.task='AE B同一原生恢复，65已由原CAS363模板完成合章/完整实读/preview/record，当前main65。继续完整有限draft64—66目标内的66：核消费者后细化未消费单元计划，取66新context/template，写完整≥16000汉字并实读/登记；之后以新标签61→66逐章完整阅读、正式review绑定。普通场面为授权独立fixture实施，不冒称新增人类原话。';
x.workflow.authorization.stop_conditions=[
'有限draft范围仍64—66，不写67、不动旧1—63；65原context/template/源链/首合章/选定原两段永久保留，不重洗。',
'66只归还63实际借出的14，保留65新画去处/各人有限知情与不展示选择；不强聚齐总结、不治脚伤、不复航、不填两空、不偷转录音。',
'已消费骨架/卷纲不直改后刷新hash；真实必须来源问题保留失败/原件交根，不私改工具资源。',
'完成66后用新标签61→62→63→64→65→66全章顺序实读，保存功能/同构/差异/不完美风险报告与正式review，不以机械check代文学。',
'本task先保持revise范围空；若最终发现64—66高置信已登记硬问题，按本次真实授权另设窄范围正式revision，不直改正文。旧33未发布差异、9已采用、13optional/49retained保留。',
'从本次恢复起100—105分钟未完成就真实交接/checkpoint退出供同ID续；不得预填根验证、exit或整轮完成。'
];
for(const v of Object.values(x.workflow.planning))v.reason='根已授权B同ID恢复有限fixture。65已登记后转66，当前真实稿与原作者规则为准；消费审计先行，仅细化未消费0066，已消费骨架/卷纲字节保持。';
fs.writeFileSync(path.join(a,'b-resume-workflow66-input.json'),JSON.stringify(x,null,2)+'\n',{flag:'wx'});console.log({ok:true,expected_revision:364});
