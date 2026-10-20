import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';
const V=path.resolve('acceptance/20261020-long-flow-090-v'),W=process.argv[4]?path.resolve(process.argv[4]):path.join(V,'scenario/东岸末班船-扩展验证');
const [mode,n]=process.argv.slice(2),num=String(n).padStart(4,'0');
const read=p=>fs.readFileSync(p,'utf8'),json=p=>JSON.parse(read(p)),sha=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const put=(p,x)=>{fs.mkdirSync(path.dirname(p),{recursive:true});fs.writeFileSync(p,typeof x==='string'?x:JSON.stringify(x,null,2)+'\n',{flag:'wx'});};
if(mode==='assemble'){
 const t=json(path.join(W,`.writer/drafts/c3-template-${n}.json`)),dir=`分段/${num}/c3`;
 const parts=fs.readdirSync(path.join(W,dir)).filter(x=>/^\d\d\.md$/.test(x)).sort().map(x=>({path:dir+'/'+x,sha256:sha(path.join(W,dir,x))}));
 const counts=parts.map(p=>({path:p.path,han:(read(path.join(W,p.path)).replace(/^#.*$/gm,'').match(/\p{Script=Han}/gu)||[]).length}));
 put(path.join(V,`inputs/c3-assemble-${n}-${parts.length}parts.json`),{unit:Number(n),expected_revision:t.expected_revision,draft:t.draft,parts,separator:'\n\n'});console.log(JSON.stringify({parts:counts,total:counts.reduce((a,b)=>a+b.han,0),draft:t.draft}));
}else if(mode==='bind'){
 const t=json(path.join(W,`.writer/drafts/c3-template-${n}.json`)),semantic=json(path.join(V,`inputs/c3-semantic-${n}.json`)),report=`审查/V-C3-${num}-完整章自检.md`;
 const header=`# 第${n}章完整稿自检\n\n审查者：本次知情模型自检，不是独立盲读或真人/市场验收。\n\n正文：${t.draft}\nSHA256=${sha(path.join(W,t.draft))}\n正文汉字=${(read(path.join(W,t.draft)).replace(/^#.*$/gm,'').match(/\p{Script=Han}/gu)||[]).length}\n细纲SHA256=${sha(path.join(W,`大纲/单元/${num}.json`))}\n\n`;
 put(path.join(W,report),header+read(path.join(V,`c3-report-${n}.md`)));
 delete t.output;delete t._instructions;Object.assign(t,semantic);t.draft_review={reviewer:'V-C3实际Codex知情自检',report,draft_sha256:sha(path.join(W,t.draft)),report_sha256:sha(path.join(W,report))};
 put(path.join(V,`inputs/c3-record-${n}.json`),t);console.log(JSON.stringify({input:`inputs/c3-record-${n}.json`,draft_review:t.draft_review}));
}else throw Error('Unknown helper operation');
