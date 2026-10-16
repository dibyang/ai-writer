import path from 'node:path';
import {stage,work,cli,read,logRead,save} from './stage.mjs';
const before=path.join(stage,'before/work'), state=read(path.join(before,'.writer/state.json'));
for(const n of [15,22,23,24,...Array.from({length:18},(_,i)=>25+i)])logRead(path.join(before,state.units[n-1].draft),n<25?'必要前文与原证据回查全文':'修前正文全文');
for(const p of ['writer.json','设定/作品定位.md','设定/文风.md','设定/权威规则.md','设定/角色卡.md','大纲/全书大纲.md','大纲/续部总纲.md'])logRead(path.join(before,p),'当前创作资料全文（current-sources汇集阅读）');
for(let n=25;n<=42;n++)logRead(path.join(before,`大纲/单元/${String(n).padStart(4,'0')}.json`),'修前章纲全文');
logRead(path.join(stage,'before/compact-ledger.txt'),'r90逐章相关ledger全部增量及证据，重复历史按先前所读回指；非全state原始JSON全文');
const r=cli('rewind',['--from','25','--expected-revision','90'],'rewind-from25-r90');
console.log(r.stdout||r.stderr);if(r.exit_code!==0)process.exitCode=1;
