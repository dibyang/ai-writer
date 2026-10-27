import fs from 'node:fs';
const p='lib/tool-update.mjs';let s=fs.readFileSync(p,'utf8');
function r(a,b){if(!s.includes(a))throw Error(a);s=s.replace(a,b);}
r("keys(input,['source','documents','legacy_target_acknowledged'])","keys(input,['source','documents','legacy_target_acknowledged','validation_mode'])");
r("return {source:input.source,documents:[...docs].sort(),legacy_target_acknowledged:input.legacy_target_acknowledged??false};","if(input.validation_mode!==undefined&&!['copy','in-place-readonly'].includes(input.validation_mode))fail('TOOL_INPUT_INVALID','validation_mode 须 copy 或 in-place-readonly');return {source:input.source,documents:[...docs].sort(),legacy_target_acknowledged:input.legacy_target_acknowledged??false,validation_mode:input.validation_mode??'copy'};");
s=s.replaceAll('p.state.schema_version!==6)blockers','p.state.schema_version<6)blockers');s=s.replaceAll('p.state.schema_version!==6)fail','p.state.schema_version<6)fail');
r('const body={project_id',"if(!source.supported_state_schemas.includes(p.state.schema_version))blockers.push({code:'TOOL_SCHEMA_UNSUPPORTED',reason:'来源不支持当前作品状态协议，不能降级'});const body={validation_mode:opts.validation_mode,project_id");
r('plan_sha256,documents:opts.documents,legacy_target_acknowledged:opts.legacy_target_acknowledged,author_evidence:null','plan_sha256,documents:opts.documents,legacy_target_acknowledged:opts.legacy_target_acknowledged,validation_mode:opts.validation_mode,author_evidence:null');
r("'plan_sha256','documents','legacy_target_acknowledged','author_evidence'","'plan_sha256','documents','legacy_target_acknowledged','validation_mode','author_evidence'");
s=s.replaceAll('source:input.source,documents:input.documents,legacy_target_acknowledged:input.legacy_target_acknowledged','source:input.source,documents:input.documents,legacy_target_acknowledged:input.legacy_target_acknowledged,validation_mode:input.validation_mode');
r('for(const ref of Object.keys(beforeInventory))io.storeBytes(validation,ref,read(p.root,ref),true);',"if(proposed.validation_mode!=='in-place-readonly')for(const ref of Object.keys(beforeInventory))io.storeBytes(validation,ref,read(p.root,ref),true);");
r('const outcomes=checks(validation);',"const outcomes=proposed.validation_mode==='in-place-readonly'?checks(p.root,path.join(source.tool_root,'bin/ai-writer.mjs')):checks(validation);");
r("tx={schema_version:2,kind:'tool-update'","tx={validation_mode:proposed.validation_mode,schema_version:2,kind:'tool-update'");
r('const outcomes=checks(work);io.metadata',"accept(root);const outcomes=tx.validation_mode==='in-place-readonly'?api.inspectReadonly(root):checks(work);io.metadata");
fs.writeFileSync(p,s);
