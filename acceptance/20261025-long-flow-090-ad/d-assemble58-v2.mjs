import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';import assert from 'node:assert/strict';import {fileURLToPath} from 'node:url';
const base=path.dirname(fileURLToPath(import.meta.url)),p=JSON.parse(fs.readFileSync(path.join(base,'project.json'))).project,sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const input=JSON.parse(fs.readFileSync(path.join(p,'.writer/drafts/ad-d-assemble58-input.json')));
const fixes={
'02':[['问一句又差点替他买书。','问一句又差点替他定下楼。']],
'04':[['那是从前收旧报留下的套，空着，边已经折软。','那是从前收旧报留下的套，没装着报，边已经折软。'],['里头原有几张单面的纸','里头还装着几张单面的纸']],
'05':[['父亲嗯一声，接着又问那边是不是有一棵树，下面两张长椅。沈禾看他，问你什么时候去过，他笑，说她上回回来讲过，自己还记得。\n\n她想了想，确实讲过同朋友坐了一个钟头，只是自己如今一见父亲问，便先往他从前到过哪里想。她给他指大致方向，说就在那边，今天太阳没那么冲，坐哪一头看到了再挑。','父亲嗯一声，问那边有座没有。沈禾给他指大致方向，说上回同朋友坐的地方，有一棵树，下面两张长椅。父亲问若都坐满了怎么办，她笑，说自己就在旁边走几步，总找得着一处歇脚的。\n\n父亲也笑，答自己还替她着急。她把袋带放到掌心，说今天太阳没那么冲，坐哪一头看到了再挑，不用还在家里便将外头每一把椅子都想过。']],
'06':[['早晨沈禾看见的那张单面旧纸','刚才沈禾看见的那张单面旧纸']],
'08':[['父亲点头。她伸手去摸自己书袋','父亲点头，先从袋里取盒，重新戴好眼镜。她伸手去摸自己书袋'],['后来旁边孩子一讲，自己又觉得他只是在做事。','旁边孩子说像等人，自己后来又觉得他只是在做事。']],
'09':[['还同人说了狗。','还看了会儿狗。']]
};
const edits=[];
for(const [n,replacements]of Object.entries(fixes)){
 const part=input.parts[Number(n)-1],before=fs.readFileSync(path.join(p,part.path),'utf8');let after=before;
 for(const [a,b]of replacements){assert.equal(after.split(a).length,2,n+': '+a);after=after.replace(a,b);edits.push({part:n,before:a,after:b});}
 const ref=`分段/AD-D-0058-修正v2/${n}.md`;fs.mkdirSync(path.dirname(path.join(p,ref)),{recursive:true});fs.writeFileSync(path.join(p,ref),after,{flag:'wx'});input.parts[Number(n)-1]={path:ref,sha256:sha(Buffer.from(after))};
}
input.draft='正文/0058-袋里放自己的-ad-d-v2.md';fs.writeFileSync(path.join(p,'.writer/drafts/ad-d-assemble58-v2-input.json'),JSON.stringify(input,null,2)+'\n',{flag:'wx'});
fs.writeFileSync(path.join(base,'d-58-whole-read-corrections.json'),JSON.stringify({nature:'pre-registration self-review corrections, preserve original template and source hashes',original_draft:'正文/0058-袋里放自己的-ad-d-v1.md',original_sha256:sha(fs.readFileSync(path.join(p,'正文/0058-袋里放自己的-ad-d-v1.md'))),edits},null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({ok:true,edits:edits.length,draft:input.draft,han:input.parts.reduce((a,v)=>a+(fs.readFileSync(path.join(p,v.path),'utf8').replace(/^#{1,6} .*$/gm,'').match(/\p{Script=Han}/gu)||[]).length,0)},null,2));
