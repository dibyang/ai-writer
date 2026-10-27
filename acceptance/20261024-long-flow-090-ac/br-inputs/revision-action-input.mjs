import fs from 'node:fs';import path from 'node:path';
const root=path.resolve('acceptance/20261024-long-flow-090-ac');const{project}=JSON.parse(fs.readFileSync(path.join(root,'project.json')));const s=JSON.parse(fs.readFileSync(path.join(project,'.writer/state.json')));const action=process.argv[2];let input;
if(action==='adopt-glasses'||action==='adopt-typo'){input={expected_revision:s.revision,operation_id:`ac-b-${action}-r${s.revision}`,id:action==='adopt-glasses'?'I_AC_B_42_GLASSES_TARGET':'I_AC_B_42_TYPO_KONGPA',disposition:'adopted',decision_actor:'agent-within-authorized-scope',authorization:s.governance_binding,reason:'本轮用户要求确认问题在正式独立区按已授范围修订；仅第42章的物件目标衔接/缺字，非冒充真人逐项新增情节选择。'};}
else if(action==='begin42'){input={expected_revision:s.revision,owner:'Codex AC-B same thread 01a16e69-dfce-7b92-a604-87003db67e49',from:42,through:42};}
else throw new Error(action);
fs.writeFileSync(path.join(root,`br-inputs/${action}.json`),JSON.stringify(input,null,2)+'\n',{flag:'wx'});console.log(JSON.stringify({action,expected_revision:s.revision}));
