import fs from 'node:fs';
import crypto from 'node:crypto';
import {createRunner} from '../command-runner.mjs';
const stage='acceptance/20261016-hundred/session-13',project='acceptance/20261016-hundred/works/潮汐信号',r=createRunner(stage),hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const op=process.argv[2];
if(op==='backup-review'){
 const f=project+'/审查/0100-session13知情自检.md';fs.copyFileSync(f,stage+'/review-100-before-kinship-correction.md',fs.constants.COPYFILE_EXCL);console.log({sha256:hash(fs.readFileSync(f)),reason:'report-only 姐姐 should be 妹妹;正文/ledger never used wrong kinship'});
}else if(op==='inspect'){
 for(const n of [97,98,99,100]){const j=r.json(n===98?'context-98-cast':`context-${n}`);const x=j.continuity.recall;console.log(JSON.stringify({unit:n,recall_keys:Object.keys(x),omitted_ids:x.omitted_ids,explicit_ids:x.explicit_ids,recall_count:x.items?.length??x.matches?.length}));}
 const s=JSON.parse(fs.readFileSync(project+'/.writer/state.json'));for(const id of ['T_KEEPER_SHARE','T_HE_OLD_PAY','T_SOUND_CONTEXT','T_PAGE_PAIR','T_VOICE_CONSENT','T_SELF_USE_95','T_SHOP_SEAT_WEEK_86','T_ROOM_AFTER33','I_ROUTE_DELAY_ACCOUNT']){const x=s.snapshot.ledger[id];console.log(JSON.stringify({id,status:x?.status,due_unit:x?.due_unit,statement:x?.statement,evidence_first:x?.evidence?.[0],latest:x?.evidence?.slice(-2)}));}
}else if(op==='seal'){
 const a=JSON.parse(fs.readFileSync(stage+'/final-audit.json')),notes=JSON.parse(fs.readFileSync(stage+'/result-notes.json'));
 const statusMeta=r.last('status-final');if(statusMeta.label!=='status-final'||statusMeta.argv[1]!=='status'||statusMeta.executable!=='node')throw Error('exact final status identity');
 const s=JSON.parse(fs.readFileSync(project+'/.writer/state.json')),check=r.json('check-final');if(s.revision!==350||check.rolling_review.pending_windows.length)throw Error('final state');
 const reading=fs.readFileSync(stage+'/reading.jsonl','utf8').trim().split('\n').map(JSON.parse),commands=fs.readFileSync(r.index,'utf8').trim().split('\n').map(JSON.parse);
 const time={started_at:JSON.parse(fs.readFileSync(stage+'/start.json')).iso??a.started_at,finished_at:new Date().toISOString(),elapsed_s:(Date.now()-JSON.parse(fs.readFileSync(stage+'/start.json')).epoch_ms)/1000};
 const journals=a.chapters.map(x=>({unit:x.unit,path:x.registered.journal,sha256:hash(fs.readFileSync(project+'/'+x.registered.journal))}));
 const data={...notes,time,revision:350,initial_revision:346,chapters:a.chapters,source_and_state_hashes:{initial_state:a.initial_state_sha256,final_state:hash(fs.readFileSync(project+'/.writer/state.json')),recovery:hash(fs.readFileSync(stage+'/recovery.md')),reading_log:hash(fs.readFileSync(stage+'/reading.jsonl')),journals},checks:{status:r.json('status-final'),check,doctor:r.json('doctor-final'),preservation:a.preservation},export:a.export,reading:{events:reading.length,unique_paths:[...new Set(reading.map(x=>x.path))],versions:[...new Set(reading.map(x=>x.path+' '+x.sha256))].length,source_log:'reading.jsonl',hash_scan_not_full_read:true},commands:{count_before_seal:commands.length,failures:commands.filter(x=>x.exit_code!==0),exact_status_metadata:statusMeta,index:'commands/index.jsonl',streams:'native child Buffer stdout/stderr captured separately; bootstrap exception documented in start.json'},reviews:{window_94_99:r.json('review-99-cli'),unit_100:r.json('review-100-cli-corrected-report')},journal_write_boundary:'Only CLI record/review/plan wrote authority. No manual state/journal edits or rewind.'};
 delete data.commands.exact_status_metadata.stdout;delete data.commands.exact_status_metadata.stderr;
 fs.writeFileSync(stage+'/result.json',JSON.stringify(data,null,2)+'\n',{flag:'wx'});
 let text=fs.readFileSync(stage+'/result.md','utf8');text+='\n## 最终机器计时与哈希\n\n'+`开始 ${time.started_at}；结果封存 ${time.finished_at}；实测 ${time.elapsed_s.toFixed(3)} 秒。\n\n`+`最终 state SHA-256：${data.source_and_state_hashes.final_state}\n\n`+`reading.jsonl SHA-256：${data.source_and_state_hashes.reading_log}\n\n`+`导出正文 SHA-256：${a.export.manuscript_sha256}\n\n`+`本阶段 result.json 同时保存每章完整写前 source_hashes、模板/登记输入/当前journal哈希、CLI原始日志精确索引。\n`;
 fs.writeFileSync(stage+'/result.md',text);console.log(JSON.stringify({time,revision:350,han:a.chapters.map(x=>[x.unit,x.han]),reading_events:reading.length,command_count:commands.length,failures:commands.filter(x=>x.exit_code!==0).map(x=>[x.label,x.exit_code]),result_sha256:hash(fs.readFileSync(stage+'/result.json')),state_sha256:data.source_and_state_hashes.final_state}));
}else throw Error('unknown operation');
