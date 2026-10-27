import fs from'node:fs';import path from'node:path';import crypto from'node:crypto';import assert from'node:assert/strict';
const root=path.resolve('acceptance/20261024-long-flow-090-ac');const session=JSON.parse(fs.readFileSync(path.join(root,'cli-logs/br27-begin42/stdout.txt')));const project=session.workspace;const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const input=JSON.parse(fs.readFileSync(path.join(project,'.writer/drafts/AC-B-replay42-before.json'))),original=JSON.parse(fs.readFileSync(path.join(root,'br-inputs/record42-filled.json'))),ctx=JSON.parse(fs.readFileSync(path.join(project,'.writer/drafts/AC-B-revision-context42.json')));assert.deepEqual(input.source_hashes,ctx.source_hashes);assert.deepEqual(input.changes,original.changes);assert.equal(input.summary,original.summary);
const b=fs.readFileSync(path.join(project,input.draft)),body=b.toString(),hash=sha(b);for(let p=1;p<=7;p++)assert.equal(JSON.parse(fs.readFileSync(path.join(root,`read-pages/br-revised42-p${p}.json`))).sha256,hash);
const ev=x=>{if(!x||typeof x!=='object')return;if(Number.isInteger(x.unit)&&x.quote)assert(body.includes(x.quote),x.quote);for(const v of Object.values(x))ev(v);};ev(input.changes);
const report='审查/AC-B-42独立小修六项回放核查.md';const reportText=`# 42正式独立小修：六项核查

模型知情自检，非真人/隔离盲读或作者定稿。修订ID ${session.id}，范围42—42，主基线192。主稿不直接改；独立区rewind193后取context及写前record-template，才改正文两处。当前SHA ${hash}，正文汉字${(body.replace(/^#.*$/gm,'').match(/\p{Script=Han}/gu)||[]).length}。

## 实际改动

1. 原“男人道那怕还得叫他去。”补“恐”，仍是尚未约成的可能，不添上门事实。
2. 原“沈成林正低头找遥控，眼镜在领口挂着，自己摸了两回上衣袋，没摸到。”改为“沈成林拿起遥控，想认屏幕上那行字，摸了两回上衣袋找眼镜，却没摸到。眼镜正挂在领口，她叫他低头，他看见了……”先拿遥控、再因认字找眼镜、看见领口、取戴，目标衔接清楚。

全章br-revised42-p1…p7实际七页回读完成。42有效细纲未改，原八段初稿/原42登记/初读报告保留。

## 六项真实核查

- summary：逐条对照新全文，抽屉交还/18、预算10/15、周六补班、周日父饭冷藏、停周日夜均仍成立，眼镜微动作原摘要未概括，保留。
- characters：周/客户仅消息与亲见分开；女与母在许家、沈与父在沈家，眼镜在父领口由沈指出，父仍杖凳；六角色状态无需增写遥控为新线索，保留。
- timeline：第33周五→34周六→35周日顺序不变，眼镜仍周日晚，早半小时/12:30/周一聚餐都未来，保留。
- ledger：抽屉holder由周到客户/18有限resolved；饭约partial；纸书仍女家；柜门和工装保留旧记录。没有新款项、交接或解谜，保留四项实际差量。
- evidence：逐一实核当前新正文，原changes全部引文仍存在；两处被修旧句不是账本引文，故无需换引用或刷新历史知识。脚本等值比较辅助，不代替上述判断。
- downstream：尾段只有42，当前末章42，无43稿；37—41已完整实读且本次不改，39闹钟五分钟/41回复老板、原两段/物件均承接；父眼镜不扩大为记忆病症或历史线索。

### 真人语言别扭句

#### 真人语言硬问题

没有

本次两项已在新字节修好，后续完整尾段和窗口review仍需在重登后正式执行。可选否定旁白/停手回声保留建议，不把“已采用”当已发布或已核验。主稿42现仍旧SHA，只有正式revision prepare/commit成功才能应用。
`;
fs.writeFileSync(path.join(project,report),reportText,{flag:'wx'});delete input._instructions;input.replay_review={reviewer:'Codex AC-B同ID知情六项实读核查',report,draft_sha256:hash,checked_fields:['summary','characters','timeline','ledger','evidence','downstream']};input.draft_review={reviewer:'Codex AC-B同ID42修订全章七页自检',report,draft_sha256:hash,report_sha256:sha(Buffer.from(reportText))};fs.writeFileSync(path.join(root,'br-inputs/replay42-filled.json'),JSON.stringify(input,null,2)+'\n',{flag:'wx'});console.log(JSON.stringify({hash,report,changes_equal_after_read:true}));
