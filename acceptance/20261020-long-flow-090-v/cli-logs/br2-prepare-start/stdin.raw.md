import fs from 'node:fs';import crypto from 'node:crypto';
const w='scenario/东岸末班船-扩展验证',s=JSON.parse(fs.readFileSync(`${w}/.writer/state.json`));
const local_source='研究/V-B恢复9实际授权.md',raw=fs.readFileSync(`${w}/${local_source}`),workflow=structuredClone(s.governance);
workflow.stage='trial';workflow.task='同一实际B恢复：只完成第9章及当前7—9完整连读review，9后停；10待C新提示';
workflow.authorization={allowed_actions:['discuss','plan','draft'],draft_range:{from:9,to:9},revise_range:null,stop_conditions:['本次只写并登记9；完整回读当前7—8和首次/最近线索，治理变更后取真实context及写前模板。','第9至少5000正文汉字，至少两个真实顺序片段CLI assemble成新稿；全文实读并修复授权内高置信问题，先报告和draft_review，再preview成功才record。','9完成后实际完整连读当前7—9并回看涉及4—6，保存文学报告/功能比较并正式review全部当前SHA与依赖。','9后停，draft_range保留9—9，不取10写前、不写10；10待C新的明确提示。','保留首停历史、planning/decisions与4—12总体有限试验历史，不把未来11/12兑现或35元支付当已发生。','只写V，不派代理，不改U/T/产品/既有作品，不修旧章、不替换包、不做目录索引，不Git提交推送。']};
const author_evidence={quote:'按原范围9—9完成第9章与7—9连读review，不写10。',local_source,source_sha256:crypto.createHash('sha256').update(raw).digest('hex'),locator:'当前用户恢复指令第1段；已完整读两份resume提示',recorded_by:'同一实际B Codex会话；代理按授权准备输入，不编造thread ID或人类逐字情节'};
fs.writeFileSync('br2-workflow-start.json',JSON.stringify({expected_revision:s.revision,operation_id:'v-b-resume-v2-only-nine',author_evidence,workflow},null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({revision:s.revision,input:'br2-workflow-start.json',range:workflow.authorization.draft_range,author_sha256:author_evidence.source_sha256},null,2));
