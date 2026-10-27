import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';
import {base,main,j,sha,state,save,author,cli} from './e1-ops.mjs';
const sources=j(path.join(base,'e-proposal.json')).proposals.flatMap(p=>p.source_strategy.changes);
const edits=[
 [['12元花册','14元花册']],
 [['女拆自己12元花册','女拆自己14元花册']],
 [['拟材料实报8','拟材料实报10']],
 [['材料拟8实报','材料拟10实报'],['付款八元并留凭条','付款十元并留凭条'],['原件/八元凭条','原件/十元凭条']],
 [['买8元料','买10元料'],['八元条','十元条'],['本处工40料8待真正交款才已收','本处工40料10待真正交款才已收；若本章交款，合50整付，不发生原两元找零']],
 [['不重收41已收48','不重收41已收50']],
 [['门条41当面有限验收并实收48','门条41当面有限验收并实收50']],
 [['门41实付48/本处完成','门41实付50/本处完成']],
 [['本次门修工40料8已结','本次门修工40料10已结']]
];
const [action,num]=process.argv.slice(2),i=Number(num),s=sources[i-1],id='S'+String(i).padStart(2,'0'),label='e1-'+id.toLowerCase();
if(action==='create'){
 const manifest=[];for(let k=0;k<sources.length;k++){const old=sources[k],sid='S'+String(k+1).padStart(2,'0');let txt=fs.readFileSync(path.join(main,old.ref),'utf8');assert.equal(sha(Buffer.from(txt)),old.sha256);for(const [a,b] of edits[k]){assert.equal(txt.split(a).length-1,1,sid+': '+a);txt=txt.replace(a,b);}const file='研究/E1候选来源/'+sid+path.extname(old.ref);fs.mkdirSync(path.dirname(path.join(main,file)),{recursive:true});fs.writeFileSync(path.join(main,file),txt,{flag:'wx'});manifest.push({id:sid,ref:old.ref,file,old_sha256:old.sha256,new_sha256:sha(Buffer.from(txt)),from:old.publish_from,edits:edits[k],authority:'controller under original human task; not new human plot wording'});}save('e1-source-candidates.json',manifest);console.log(JSON.stringify(manifest,null,2));
}
if(action==='freeze'){
 const item=j(path.join(base,'e1-source-candidates.json'))[i-1];assert(s);const input=save('e1-inputs/'+id+'-freeze-new.json',{expected_revision:state().revision,operation_id:'E1_'+id+'_FREEZE_NEW',ref:s.ref,file:item.file,version_id:'E1_'+id+'_NEW',previous:'E1_'+id+'_OLD'});cli(label+'-freeze-new',['source','freeze'],{input,brief:true});
}
if(action==='impact'){
 const input=save('e1-inputs/'+id+'-impact-historical.json',{version_id:'E1_'+id+'_NEW',from:s.publish_from,mode:'historical'});cli(label+'-impact-historical',['source','impact'],{input,brief:true});const impact=j(path.join(base,'cli-logs',label+'-impact-historical','stdout.txt')).impact;console.log(JSON.stringify({id,review_from:impact.review_from,revision_from:impact.revision_from,required_readings:impact.required_readings},null,2));
}
if(action==='stage'){
 const item=j(path.join(base,'e1-source-candidates.json'))[i-1],impact=j(path.join(base,'cli-logs',label+'-impact-historical','stdout.txt')).impact;assert.equal(impact.revision,state().revision);const coverage=j(path.join(base,'e1-baseline-full-reading.json')).coverage;
 for(const [ref,h] of Object.entries(impact.required_readings)){assert.equal(sha(fs.readFileSync(path.join(main,ref))),h);if(ref.startsWith('正文/'))assert(coverage.some(c=>c.path===ref&&c.sha256===h));}
 const report=`# E1 ${id} 历史来源候选实际阅读与影响报告\n\n旧逻辑入口 ${s.ref} 保持原SHA ${s.sha256}；旧版本 E1_${id}_OLD 已baseline自动等价bind。候选 ${item.file} 已实际完整读取，SHA ${item.new_sha256}，新freeze版本E1_${id}_NEW，previous明确指旧版。\n\n本次精确语义改动：${JSON.stringify(item.edits)}。这些是根选择的controller试验值，原human仅保留总试验授权，不冒充作者新增剧情。\n\n工具计算 review_from=${impact.review_from}，revision_from=${impact.revision_from}；历史保留消费前缀：${JSON.stringify(impact.retained_prefix_consumers)}。required_readings中的所有正文在本会话E完整预读或首程276页补齐中实际返回，SHA现场相同；冻结新旧对象与实际所读文件字节对应。不把ledger当正文，不用刷新旧消费哈希越过协议。\n\n直接影响：${id==='S01'||id==='S02'?'36母亲听姑娘14、父亲听沈禾14，仍18未购、旧8、20未动；35先改花册原价及实付14，33V2不动。':'40料钱实付10，工40；41本处合50整付无找2；42不重收、43—48继承账，47实读41/42再核。其余料钱、抽屉18与旧80/35/81/84不动。'}\n\n全尾35—48整体revision；当前仅计划首停35—39，40以后仍需同ID逐章context、真实差量与登记，不以本报告代替未来正文修订。44豆干两片切三宽条并45余量仍是独立正文变量，不增改无关来源。D48补充第3行47SHA保留revision212历史锚，E当前47须后续单列，不静默刷新。保护：箱漆不可变观察、知识途径、物件所有权、原33V2、作者核心选择均保持。六条verified原application保留，改后按F当前实读报告重核。\n\n结论：已读所有工具要求，新旧来源变化明确，可stage待候选从指定章生效；不宣称已publish或已修尾稿。未决阻塞：无；未来执行义务如上。\n`;
 const ref='审查/E1-'+id+'-历史来源impact实读.md';fs.writeFileSync(path.join(main,ref),report,{flag:'wx'});
 const input=save('e1-inputs/'+id+'-stage.json',{expected_revision:state().revision,operation_id:'E1_'+id+'_STAGE',author_evidence:author(),impact,review:{report:ref,report_sha256:sha(Buffer.from(report)),readings:impact.required_readings,conclusion:'候选来源已实读且required_readings同SHA全覆盖；旧入口保留，拟从指定章历史发布，不刷新旧哈希；尾章执行与F复核尚待。',unresolved:[]}});cli(label+'-stage',['source','stage'],{input,brief:true});
}
