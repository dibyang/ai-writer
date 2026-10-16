import {createRunner} from '../command-runner.mjs';
const r=createRunner('acceptance/20261016-hundred/session-03');
for(const id of ['T_PUBLIC_USE','T_VOICE_CONSENT','T_KEEPER_SHARE','T_ROUTE_COMMON','T_SOUND_CONTEXT','T_PAGE_PAIR','T_LAMP','T_PRIVATE','T_AUDIO_REMAINDER','T_RETURN_MONTH']){
const x=r.run(process.execPath,['bin/ai-writer.mjs','recall','--project','acceptance/20261016-hundred/works/潮汐信号','--query',id,'--limit','20'],'recall-'+id);
if(x.exit_code!==0)throw Error(x.stderr);const a=JSON.parse(x.stdout);console.log(id,JSON.stringify(a).slice(0,450));
}
