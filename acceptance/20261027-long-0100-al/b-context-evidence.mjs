import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';import {fileURLToPath} from 'node:url';
const base=path.dirname(fileURLToPath(import.meta.url)),root=path.join(base,'work');
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const get=label=>JSON.parse(fs.readFileSync(path.join(base,'commands',label,'stdout.raw.txt')));
const a=get('b-009-context115'),b=get('b-018-context116');
const same=[],changed={};
for(const [id,v] of Object.entries(b.continuity.author)){
 const old=a.continuity.author[id];
 if(JSON.stringify(v)===JSON.stringify(old))same.push(id);else changed[id]=v;
}
const delta={revision:b.revision,unit:b.unit,plan:b.plan,outline:b.outline,source_hashes:b.source_hashes,unchanged_author_entries_compared_to_actual115context:same,changed_or_added_author_entries:changed,reader:b.continuity.reader,characters:b.continuity.characters['顾遥'],note:'此视图仅去掉与已实读115 context完全相同的author条目；完整原context仍在命令stdout保存。正文来源均另行完整实读，previous_ending不代全文。'};
fs.writeFileSync(path.join(base,'session-b-context116-view.json'),JSON.stringify(delta,null,2)+'\n',{flag:'wx'});
for(const [unit,packet,label] of [[115,a,'b-009-context115'],[116,b,'b-018-context116']]){
 const special={T_PRIVATE:'罗私因无新证，不触碰；不可补author_truth。',T_AUDIO_REMAINDER:'余带男声钟声无新证，不靠日常声认源。',T_SELF_USE_95:'95/100实际原文已完整读取；旧套停用、本人半页私读不混新页。',P_SELF_PAGE_95:'95/100实际完整读取，原半页另夹，不改不复用。',P_TRIAL_VOICE:'旧试读声音与107本人新试声不同，不取旧声；107已全文实读。',T_RIVER_EVENING_74:'旧河边约本章不提不调用，不从规划推发生。',R_SHEN_ZHOU:'本两章无与周新互动，不扩其知情。'};
 const evidence={unit,context_label:label,context_sha256:sha(fs.readFileSync(path.join(base,'commands',label,'stdout.raw.txt'))),omitted:packet.continuity.recall.omitted_ids.map(id=>({id,disposition:special[id]??'本章未调用此ID，不视为解决或未发生；若后续使用须召回并完整实读证据正文。'}))};
 fs.writeFileSync(path.join(root,`研究/AL-b-context${unit}-omitted-review.json`),JSON.stringify(evidence,null,2)+'\n',{flag:'wx'});
}
console.log(JSON.stringify({changed:Object.keys(changed),unchanged:same.length,omitted115:a.continuity.recall.omitted_ids.length,omitted116:b.continuity.recall.omitted_ids.length}));
