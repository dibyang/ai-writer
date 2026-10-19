import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {fileURLToPath} from 'node:url';
const here=path.dirname(fileURLToPath(import.meta.url)),base=path.dirname(here),id=process.argv[2],s=JSON.parse(fs.readFileSync(path.join(base,'work/.writer/state.json')));
const reasons={
 H72_REPEATED_KNOWLEDGE:'代理在用户已授权的隔离副本修复范围内采用D72最小压缩；保留19/21真实消息传递及何不去验夹的选择。仍属可选风格suggestion，不冒充作者逐条确认。',
 H79_SINGLE_BRICK_REFERENCE:'采用D79定位澄清，恢复36/71既有临车道单砖限定；不把歧义宣判成实体变更，不改变两砖/缺口/白罩/通行原观察。代理在本轮范围组织，不改变作者取舍。',
 H83_REPEATED_PHONE_EXCLUSION:'采用D83仅删末次视觉排除句，71–81免提内容、何在家只获转述和不得领人看完整保留；这是可选解释压缩，不升级为必改语言错。',
 H107_RETAINED_VOICE_COUNT_CANDIDATE:'采用同句数量对象澄清为留下的三段试声，区分留用素材与尝试次数；不添加删除站读或四个成品事实。保护重登时据原文核summary/changes，代理选择不冒充作者确认。',
 H109_RELATIVE_DAY_DRIFT:'采用已确认连续性修正：第67日回指第66日的三处前天均改昨天；原66日自录与原67日计划不改，不编65日隐形录音。仅实读证据支持的日期和必要派生登记在保护区修正。'
};
assert.ok(reasons[id]);assert.equal(s.governance.stage,'revision');assert.deepEqual(s.governance.authorization.revise_range,{from:72,to:112});assert.ok(s.governance_binding);
const input={expected_revision:s.revision,operation_id:'H-parent-adopt-'+id+'-v1',id,disposition:'adopted',reason:reasons[id],decision_actor:'agent-within-authorized-scope',authorization:s.governance_binding};
fs.writeFileSync(path.join(here,'resolve-'+id+'.json'),JSON.stringify(input,null,2)+'\n',{flag:'wx'});console.log(JSON.stringify({prepared:true,id,revision:s.revision,actor:input.decision_actor}));
