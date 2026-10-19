import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'../..');
const changes=[
 ['writer-novel/SKILL.md','## 写作与自检','## 专项规划与局部问题\n\n+从简介做长篇、检查中段供给或阶段兑现时，按需读[长篇方向与阶段兑现](references/story-development.md)。开篇、转场、对白或章末承接问题读[小说局部诊断](references/scene-connections.md)，先核因果与人物状态再改表达；不要求每次全读或固定套冲突节拍。既有规划、分卷和登记流程继续复用。\n\n## 写作与自检'],
 ['writer-review/SKILL.md','## 报告','小说的开篇、转场、对白或章末承接专项审查，按需读[小说局部诊断](../writer-novel/references/scene-connections.md)；长篇供给与卷末兑现问题读[长篇方向](../writer-novel/references/story-development.md)。报告保留有效慢热、合作对白与余韵，不把偏好升级为硬伤；未来章未写只核计划，不声称承接已经落实。\n\n## 报告'],
 ['writer-research/SKILL.md','## 历史与事实','## 有资料时怎样借鉴局部机制\n\n+专项参考先回查相邻上下文，记录位置/哈希、它解决的具体问题、依赖条件，以及本作品可以独立实现的做法。需要对比时可选少量不同做法及失败例，数量不设硬门槛；没有合法可用的范例仍可原创。不要默认抓取或打包小说语料，不把自有稿混入跨书素材库。示例成功只支持机制观察，不证明市场效果。\n\n## 历史与事实']
];
for(const [ref,from,to] of changes){const file=path.join(root,'.agents/skills',ref),text=fs.readFileSync(file,'utf8');if(text.split(from).length!==2)throw Error('anchor changed: '+ref);fs.writeFileSync(file,text.replace(from,to.replaceAll('\n+','\n')));}
for(const name of ['story-development.md','scene-connections.md']){const target=path.join(root,'.agents/skills/writer-novel/references',name);fs.copyFileSync(path.join(import.meta.dirname,'skill-changes',name),target,fs.constants.COPYFILE_EXCL);}
console.log('Updated three skill routes and added two original references.');
