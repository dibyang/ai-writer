import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {base,sha} from './common.mjs';
const j=p=>JSON.parse(fs.readFileSync(path.join(base,p))),b=j('r6-session.json');
const ranges={13:[[1,180],[181,319]],14:[[1,145]],15:[[1,167]],16:[[1,122]],17:[[1,120]],18:[[1,48],[49,98]]};
const files=j('r6-read-before.json').files.map(row=>{const data=fs.readFileSync(path.join(b.workspace,row.ref));assert.equal(sha(data),row.sha256);return {...row,read_ranges:ranges[row.unit],line_count_method:'FastCtx returned lines, including final EOF empty line; all pages were actually read by parent Codex.'};});
fs.writeFileSync(path.join(base,'r6-read-after.json'),JSON.stringify({ok:true,files,reviewer:'parent Codex',scope:'actual full current protected-branch 13 through 18 read; no literary automation or human blind-read claim'},null,2)+'\n',{flag:'wx'});
const edits={16:[{at:['changes','characters','许舟'],old:'回家收鞋盒、亲取木箱袋告母',new:'回家在房内拢好盒中旧鞋带、亲取木箱袋告母'}],17:[],18:[]};
for(const n of [16,17,18]){fs.writeFileSync(path.join(base,`r6-record-edits-${n}.json`),JSON.stringify(edits[n],null,2)+'\n',{flag:'wx'});const p=path.join(b.workspace,`审查/S-R6-重登-${String(n).padStart(4,'0')}.md`);fs.writeFileSync(p,`# R6 第${n}章重新登记复核\n\n父 Codex 已按13→18完整阅读当前保护区稿件，正文哈希与读取前后记录见 r6-read-before.json、r6-read-after.json。\n\n- summary：本章实际发生与未发生分开；日期仍为故事第十六日。\n- characters：按实际到场、听见和转述区分；16章许舟只整理昨日已带回房的鞋盒内旧鞋带，17章自嘲对此一致。\n- timeline：14:30出铺，14:37到棚；18章14:53归布、14:58自报回铺。无延期或章号当日期。\n- ledger：16仍许持布；17短讲完成；18何实际接收、收柜，夹凳各归属。14章有限口述许可及R4读者总览保留。\n- evidence：逐项比对当前正文引文；仅当前16—18章证据哈希随新稿更新。\n- downstream：15章盒已回房不重复搬；原片、原信、节目单仍周持有，不增加未知来源或公开许可。18章推开门请喝水动作连贯。\n\n这是模型实读自检，不代表真人盲读、市场反馈或正式发布验收。\n`,{flag:'wx'});}
fs.writeFileSync(path.join(b.workspace,'审查/S-R6-0013-0018.md'),`# R6 当前13—18章连续性复核\n\n已顺序完整阅读当前保护区13、14、15、16、17、18章；每页实际读到 EOF，读取前后六章SHA一致，证据见 r6-read-after.json。\n\n15章鞋盒已经拿回许舟房内；16章改为在房内整理盒中旧鞋带，17章回说同一次整理，不新增另一只盒或再次搬盒。18章将开门让客人的动作改为“把门再推开些，请他进来喝水”。\n\n完整核对13章信中“托收”、旧片不明来源，14章有限口述许可及读者总览，15章新借布与期限，16章新场地、到场与夹子借用，17章实际讲述和“雨停”被当场纠为“雨小”，18章归布收柜、14:58回铺自报、借凳归还、陈到家后才知到家。各人物所知与保管人、两份清稿、私抄信分离保留。\n\n以上五处文字修订解决本轮发现的硬连续性/动作问题；尚未据此宣称全书最终复核，需提交后由新会话完整读当前1—18章。人物细部语言和文学效果仅是模型自读判断，不是脚本可验收项。\n`,{flag:'wx'});
console.log(JSON.stringify({ok:true,files:files.length,review_reports:4}));
