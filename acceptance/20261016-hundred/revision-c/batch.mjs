import {runner} from './phase.mjs';
const from=Number(process.argv[2]),to=Number(process.argv[3]),notes=process.argv[4];if(to-from>2||from<41||to>90)throw Error('At most three already-read chapters');
function helper(file,args,label){const r=runner.run(process.execPath,['acceptance/20261016-hundred/revision-c/'+file,...args],label+'-helper');if(r.exit_code){process.stderr.write(r.stderr);throw Error('Helper failed '+label);}return r;}
helper('phase.mjs',['mark-read',`rebuild-units-${from}-${to}`,...Array.from({length:to-from+1},(_,i)=>String(from+i))],`mark-${from}-${to}`);
for(let n=from;n<=to;n++){helper('manage.mjs',['input',String(n)],`input-${n}`);helper('manage.mjs',['record',String(n)],`record-${n}`);console.log(JSON.stringify({recorded:n,done:n-40,total:50}));}
if(to%3===0){if(!notes)throw Error('Need actual window notes');helper('review.mjs',[String(to),notes],`review-window-${to}`);console.log(JSON.stringify({review:[to-5,to]}));}
