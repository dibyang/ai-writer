import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
const base=path.resolve('acceptance/20261018-governance-b');
const stage=path.join(base,'native-four');
const root=path.join(base,'scale-hundred/work');
const state=JSON.parse(fs.readFileSync(path.join(root,'.writer/state.json')));
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
function view(name,ref,bytes) {
 const lines=['READ VIEW; source='+ref,'source_sha256='+sha(bytes),'Every original character follows; added wraps only.'];
 for(const line of bytes.toString('utf8').split('\n')) for(let i=0;i<Math.max(line.length,1);i+=130) lines.push(line.slice(i,i+130));
 fs.writeFileSync(path.join(stage,name+'.txt'),lines.join('\n')+'\n',{flag:'wx'});
}
const old=path.join(base,'commands/hundred-rebuild-v2-6-record/input.raw.json');
view('old-record-readable',old,fs.readFileSync(old));
const journal=JSON.parse(fs.readFileSync(path.join(root,state.units.at(-1).journal)));
console.log(JSON.stringify({journal_keys:Object.keys(journal),old_keys:Object.keys(JSON.parse(fs.readFileSync(old))),journal_ref:state.units.at(-1).journal}));
const selected={characters:state.snapshot.characters,ledger:Object.fromEntries(Object.entries(state.snapshot.ledger).filter(([k])=>['T_VOICE_CONSENT','T_SELF_USE_95','P_SELF_PAGE_95','P_TRIAL_VOICE','T_PAGE_PAIR','P_QIU_WORK_PAGES','P_QIU_SINGLE_27','P_RO_LOCATION_NOTE_27','P_RO_WORK_PAGES','T_AUDIO_REMAINDER','T_PRIVATE','T_HE_OLD_PAY','T_ROOM_AFTER33','R_SHEN_QIU_LIFE'].includes(k)))};
fs.writeFileSync(path.join(stage,'related-facts-index.json'),JSON.stringify(selected,null,2)+'\n',{flag:'wx'});
