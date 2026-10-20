import fs from 'node:fs';import path from 'node:path';import {W,U,write,hash} from './final-b-run.mjs';
const source=path.join(W,'分段/0003/final-b-v1/01.md');let text=fs.readFileSync(source,'utf8');
for(const [a,b] of [['“朝窗这边。你别站后头，待会儿碰胳膊。”','“往后开。你别站后头，待会儿碰胳膊。”'],['线头一离开票夹便散了','线绕到一半便散了']]){if(!text.includes(a))throw Error(a);text=text.replace(a,b);}
const target=path.join(W,'分段/0003/final-b-v2/01.md');write(target,text);write(path.join(U,'final-b-first-part-refinement.md'),'# 首段实读修正\n\n原首段完整实读1—58行后，确认两项连续性问题：先定向窗边再转半圈使开盖方向冲突；上一章已收票夹，不能再从票夹松线。新建v2首段，只改“往后开”和“线绕到一半便散了”。v1保留，不覆盖。末段未变，下一段仍从扳起第一只搭扣续写。\n\n原片段SHA256='+hash(source)+'\n新片段SHA256='+hash(target)+'\n');
