import {fs,path,project,json,read,sha,save,outer,assert} from './c-utils.mjs';
const x=json('.writer/drafts/ad-dr-assemble60-input.json');x.draft='正文/0060-窗边还留着光-ad-dr-v2.md';x.parts=x.parts.map(p=>({...p,sha256:sha(fs.readFileSync(path.join(project,p.path)))}));
for(const [r,h]of Object.entries(json('.writer/drafts/ad-dr-record-template60-original.json').source_hashes))assert.equal(sha(fs.readFileSync(path.join(project,r))),h,r);
const han=x.parts.reduce((n,p)=>n+(read(p.path).replace(/^#.*$/gm,'').match(/\p{Script=Han}/gu)||[]).length,0);assert(han>=16000);
save('.writer/drafts/ad-dr-assemble60-v2-input.json',x);
outer('ddr-60-v2-corrections.json',{original_draft:'正文/0060-窗边还留着光-ad-dr-v1.md',original_sha256:'38989361f18132d7baa5dcc0822941239a131a264bfc7f0b30fe13cdb4f5e1bd',draft:x.draft,han,original_parts_retained:['01','03','07','12','13'].map(n=>`分段/AD-DR-0060/${n}-v1-original.md`),corrections:['01米要下多少；59只说女自己会弄，删除各弄各的虚回述','03台历改实际电话中男人自述；去找笔改周听停顿后的有限推测','07小叶难洗改本次当场问答，删除前几日已嫌的无源旧话','12合章前已纠正母未知遗杯的又字','13按录在问录了没之前，回应录了/那我唱了可真实收入录音','13删末尾未分隔跨周视点总结，许视点连续至关灯'],source_hashes_verified:true,unregistered_draft_revision:true});
console.log(JSON.stringify({ok:true,han,draft:x.draft}));
