import fs from 'node:fs';
import crypto from 'node:crypto';
const stage='acceptance/20261016-expanded/session-e',work='acceptance/20261016-expanded/works/潮汐信号';
const s=JSON.parse(fs.readFileSync(`${work}/.writer/state.json`)),a=JSON.parse(fs.readFileSync(`${stage}/initial-state.json`));
const sha=x=>crypto.createHash('sha256').update(x).digest('hex');
const findings=[],preservation=[];let evidence=0;
for(const [id,v] of Object.entries(s.snapshot.ledger))for(const e of v.evidence??[]){evidence++;const raw=fs.readFileSync(`${work}/${e.draft}`),lines=raw.toString('utf8').split(/\r?\n/u);if(sha(raw)!==e.sha256||!lines[e.line-1]?.includes(e.quote))findings.push({id,e,code:'EVIDENCE_MISMATCH'});}
for(const [id,v] of Object.entries(a.snapshot.ledger)){
 const n=s.snapshot.ledger[id];const errors=[];
 if(!n)errors.push('missing-id');else{
 for(const e of v.evidence??[])if(!n.evidence.some(x=>JSON.stringify(x)===JSON.stringify(e)))errors.push('missing-old-evidence');
 for(const [c,k] of Object.entries(v.character_known??{}))if(!n.character_known[c]?.includes(k))errors.push('missing-old-knowledge:'+c);
 if(v.type==='observation'&&v.statement!==n.statement)errors.push('observation-changed');
 if(v.due_unit!==undefined&&v.due_unit!==n.due_unit)errors.push('due-changed');
 }
 preservation.push({id,old_evidence:v.evidence.length,new_evidence:n?.evidence?.length,errors});
 if(errors.length)findings.push({id,errors,code:'PRESERVATION'});
}
for(const [name,txt] of Object.entries(a.snapshot.characters))if(!s.snapshot.characters[name]?.includes(txt))findings.push({name,code:'OLD_CHARACTER_LOSS'});
const first=x=>String(x).split(/；此前(?:已知与经历|知情保留|状态|知情记录)/u)[0];
let view=`# 最终账本实读辅助视图\n\nrevision ${s.revision}\n\n`;
for(const [id,v] of Object.entries(s.snapshot.ledger)){view+=`## ${id} / ${v.type} / ${v.status} / due ${v.due_unit??'-'}\n\n${v.statement}\n\n${v.reader_known??''}\n\n`;if(v.custody)view+=`保管：${JSON.stringify(v.custody)}\n\n`;for(const [name,k] of Object.entries(v.character_known??{}))view+=`${name}：${first(k)}\n\n`;view+=`证据数：${v.evidence.length}；最新：${JSON.stringify(v.evidence.at(-1))}\n\n`;}
fs.writeFileSync(`${stage}/final-ledger-view.md`,view);
const report={revision:s.revision,ledger_count:Object.keys(s.snapshot.ledger).length,evidence_count:evidence,initial_ledger_count:preservation.length,initial_evidence_count:Object.values(a.snapshot.ledger).reduce((n,v)=>n+v.evidence.length,0),preservation,findings};
fs.writeFileSync(`${stage}/ledger-audit.json`,JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({...report,preservation:preservation.map(x=>({id:x.id,before:x.old_evidence,after:x.new_evidence,errors:x.errors})),state_keys:Object.keys(s)}));
