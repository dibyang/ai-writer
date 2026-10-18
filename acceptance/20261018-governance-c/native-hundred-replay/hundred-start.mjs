import {run,state,read,put,stage,hundred,base} from './harness.mjs';
import fs from 'node:fs';import path from 'node:path';
put(path.join(hundred,'研究/百章C模拟授权.md'),'# 合成验收作者范围\n\n本记录仅供合成验收，不是真实作品作者决策。仅允许第100章等价登记回放，正文一个字也不改，不加101章，不改变任何事实或未来设定。真实完整阅读95–100章、100章细纲与原登记增量和必要设定。仅授权revise100–100；提交及当前复核后暂停到discuss/plan，正文与修订范围均取消。\n');
const start=state(hundred);
const b=run('hundred-begin',['revision','begin'],hundred,{expected_revision:start.revision,owner:'native-four-hundred-replay',from:100,through:100});
put(path.join(stage,'hundred-session.json'),b);console.log(JSON.stringify(b));
