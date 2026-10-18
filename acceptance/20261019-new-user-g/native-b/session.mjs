import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
const root=path.resolve('acceptance/20261019-new-user-g');
const base=path.join(root,'native-b');
const project=path.join(root,'作品/雾港 来信');
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const json=f=>JSON.parse(fs.readFileSync(f,'utf8'));
const save=(f,o)=>fs.writeFileSync(f,JSON.stringify(o,null,2)+'\n',{flag:'wx'});
fs.mkdirSync(base,{recursive:true});
const [action,session,...refs]=process.argv.slice(2);
if(action==='checkpoint'){
 const before=fs.readFileSync(path.join(root,'commands/b-status-recovery/before-state.json'));
 const after=fs.readFileSync(path.join(project,'.writer/state.json'));
 if(!before.equals(after))throw Error('Recovery changed state');
 fs.writeFileSync(path.join(base,'recovery-before-state.raw.json'),before,{flag:'wx'});
 fs.writeFileSync(path.join(base,'recovery-after-state.raw.json'),after,{flag:'wx'});
 const status=json(path.join(root,'commands/b-status-recovery/stdout.raw.txt'));
 const a=json(path.join(root,'native-a-v2/handoff.json'));
 const manuscripts=a.manuscripts.map(m=>({...m,current_sha256:hash(fs.readFileSync(m.path)),matches_handoff:hash(fs.readFileSync(m.path))===m.sha256}));
 const tests=['b-context4-paused-rejected','b-template4-paused-rejected'].map(label=>({label,...json(path.join(root,'commands',label,'result.json')),error:json(path.join(root,'commands',label,'stderr.raw.txt'))}));
 const result={created_at:new Date().toISOString(),project_path:project,recovered_from_files:true,new_authorization_applied:false,state_sha256:hash(after),state_bytes_equal:true,status,manuscripts,tests,a_scope_observed_complete:status.next_unit===4&&manuscripts.every(m=>m.matches_handoff)&&status.draft_inventory.unregistered.length===0,next:'仅讨论规划；本请求后续4–6授权尚未应用'};
 save(path.join(base,'recovery-checkpoint.json'),result);
 fs.writeFileSync(path.join(base,'recovery-checkpoint.md'),`# 恢复检查点\n\n作品：${project}\n\n从文件恢复：revision 8，schema6，long，paused；已登记1–3，next_unit=4。仅discuss/plan，无draft/revise范围。定位、结构、分卷和章纲均draft；无真人逐项文学采纳。\n\n作者明确选择：日常悬疑、普通读者，林柯/钟师傅/陶芷，无超自然/谋杀/终局阴谋；旧范围1–3写后暂停。代理挂钟方案仍candidate；寄件者当面出现方式、材料费金额、搬迁后分工未决。\n\n未登记正文、来源漂移、活跃修订和事务均为空。A的1–3正文逐份SHA与交接一致，当前CLI确认3章已登记；没有发现A范围内遗留未完成登记。文学结论待本会话实读，不以A结果代替。\n\n本次第4章context和record-template均退出2、ACTION_OUT_OF_SCOPE，未生成正文/细纲。四次恢复命令及检查点state前后字节完全一致：${hash(after)}。原字节在recovery-before-state.raw.json与recovery-after-state.raw.json。\n\n新增授权：尚未执行。用户本次验证请求的后半段明确授权4–6；后续需通过workflow正式登记，是新的有限代理执行范围，不是从文件恢复出的旧许可，也不是真人另外选择具体剧情。\n\n待接：T_TEST15仅约定周六9点实测；T_SENDER身份未知、代办所未查；牌在陶拉链内袋，钟在铺墙钩，信/借条在右抽屉，旧簿合影由陶收好，手机照片未证明展示/传送。下一步先按本次新授权登记有限范围，完整读1–3及证据，再规划第二卷。\n`,{flag:'wx'});
 console.log(JSON.stringify({checkpoint:true,state_sha256:hash(after),matches:manuscripts.map(m=>m.matches_handoff),tests:tests.map(t=>[t.label,t.exit_code,t.error.code])}));
}
if(action==='read'){
 fs.mkdirSync(path.join(base,'read-versions'),{recursive:true});
 fs.mkdirSync(path.join(base,'read-outputs'),{recursive:true});
 const entries=[];let output='';
 for(const ref of refs){const file=path.resolve(project,ref);if(!file.startsWith(project+path.sep))throw Error('outside project');const bytes=fs.readFileSync(file),sha256=hash(bytes);const frozen=path.join(base,'read-versions',sha256+path.extname(file));if(!fs.existsSync(frozen))fs.writeFileSync(frozen,bytes,{flag:'wx'});const lines=bytes.toString('utf8').split(/\r?\n/);output+=`\nFILE ${ref} SHA256 ${sha256}\n`+lines.map((s,i)=>`${i+1}\t${s}`).join('\n')+'\nEND FILE\n';entries.push({path:file,sha256,frozen_path:frozen,lines:lines.length,scope:'full-file',complete:true});}
 fs.writeFileSync(path.join(base,'read-outputs',session+'.txt'),output,{flag:'wx'});
 const readingsFile=path.join(base,'readings.json'),r=fs.existsSync(readingsFile)?json(readingsFile):{reader_nature:'same-creative-agent-informed-self-review; not human or blind',sessions:[]};
 r.sessions.push({id:session,at:new Date().toISOString(),entries,report:null});fs.writeFileSync(readingsFile,JSON.stringify(r,null,2)+'\n');console.log(output);
}
