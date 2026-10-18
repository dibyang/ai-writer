import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {session,sha} from '../session-support.mjs';
const s=session('revise-a'),r=JSON.parse(fs.readFileSync(path.join(s.stage,'revision-local.json')));
const items=JSON.parse(fs.readFileSync(path.join(s.stage,'../findings/brick-wording-group.json'))).items;
for(const i of items){const bytes=fs.readFileSync(path.join(r.workspace,i.draft));assert.equal(sha(bytes),i.source_sha256);assert.ok(bytes.toString('utf8').includes(i.before));assert.equal(bytes.toString('utf8').split('同两块').length-1,1);s.write('before/'+path.basename(i.draft),bytes);}
s.write('prefix-reading-notes.md',`# 43—47只读前缀完整复读
知情模型自检，当前进程依次完整读43/44/45/46/47，FastCtx均从1到末行Complete。哈希见root-body-baseline.json；不改正文，不回退、不重登此前缀，不登记/处置范围外意见。

43：21日晚先吃面不等邹车后半场，22日14—14:58核听38:20客户文件，两种接头分别处理；15:06实收240。床单仍需自己晾。保留没见21日过车与新工作真到账的分别。
44：23日10:20—10:47，严修门90结算及何少开时段钱未回；四折纸背新增25日10:15不是旧17:10延期。陈只拟一次免费25日10—11，24日下午先学；未交钥匙，未来试行非既成。
45：24日14:33—14:57，陈真实借食谱册号核对、试锁；何常用钥练后还圈，正式25日才交，柜钥不交。老人只是怕报纸被收，解释后仍坐；陈三点真走，沈自己救米饭。
46：25日10点常用钥何→陈、公共夹留屋；何真离10:15送孟另一套三页，90实到，新外带项只报价待内容。沈同行错过买米，自去超市；不能把九十回填16日旧款。
47：沈10:55回只亲见尾段，陈还两书为转述。老人自抄棋图不带原报，陈11:04实锁，11:16常用钥陈→严纸套内袋，挂牌备用钥另一串。陈一回结束、不续明班；明日陪女买鞋仍计划。48开头应由严实还何，不得跳接。

## 真人语言别扭句
### 真人语言硬问题
没有
此处只记录承接所得，不扩大意见处置范围。未做真人盲读、发表判断或全书验收。
`);
s.write('parent101-recheck.json',{unit:101,sha256:sha(fs.readFileSync(path.join(s.project,'正文/0101-下次从这里找.md'))),read_scope:'current full 1—94 plus observation snapshot full 1—94 and interim/correction/draft-f conclusion',quote:'她打开柜子，摸到家里还剩的半包面，忽然又想笑。',decision:'E already fixed before first registration; no edit and no new candidate counted',body_change:false});
console.log({snapshots:items.length,prefix_complete:[43,44,45,46,47],parent101:'no change'});
