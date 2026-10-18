import {session} from '../session-support.mjs';
const s=session('draft-f'),unit=Number(process.argv[2]),titles={105:'开头划掉以后',106:'先坐一会儿'};
for(const [label,args] of [['outline',['outline','--unit',String(unit)]],['context',['context','--unit',String(unit),'--max-chars','120000']],['template',['record-template','--unit',String(unit),'--draft',`正文/0${unit}-${titles[unit]}.md`]]]){
const r=s.run(label+'-'+unit,args,{entry:'embedded'});s.write(label+'-'+unit+'.json',r.value);
if(label==='context')console.log(JSON.stringify({unit,revision:r.value.revision,sources:r.value.source_hashes,recall:r.value.continuity.recall,author:Object.fromEntries(Object.entries(r.value.continuity.author).filter(([k])=>/SELF_PAGE|DINNER65|ADDON|BALL_AFTER|VOICE|PAID|CHAIR_DAY/.test(k)).map(([k,v])=>[k,{statement:v.statement,status:v.status,custody:v.custody}]))}));else console.log(JSON.stringify(r.value));
}
