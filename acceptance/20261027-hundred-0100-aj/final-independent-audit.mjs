import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {isDeepStrictEqual} from 'node:util';
import {fileURLToPath} from 'node:url';
const base=path.dirname(fileURLToPath(import.meta.url)), repo=path.resolve(base,'../..');
const original=path.join(repo,'acceptance/20261019-hundred-h/work'), current=path.join(base,'work');
const read=p=>fs.readFileSync(p), sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const old=JSON.parse(read(path.join(original,'.writer/state.json'))), now=JSON.parse(read(path.join(current,'.writer/state.json')));
assert.equal(old.units.length,112);assert.equal(now.units.length,112);
const changes=[];
for(const u of old.units){const v=now.units.find(x=>x.unit===u.unit);assert(v);const a=read(path.join(original,u.draft)), b=read(path.join(current,v.draft));assert.equal(sha(a),u.sha256);assert.equal(sha(b),v.sha256);assert.equal(path.basename(u.draft),path.basename(v.draft));assert.match(v.draft,/^正文\/V\d+-[^/]+\//);if(!a.equals(b))changes.push({unit:u.unit,old_sha256:sha(a),new_sha256:sha(b),old_path:u.draft,new_path:v.draft});}
assert.deepEqual(changes.map(x=>x.unit),[108,110]);
for(const key of ['characters','threads','timeline'])assert(isDeepStrictEqual(old.snapshot[key],now.snapshot[key]),key);
const differences=[];
function walk(a,b,p,entry){if(isDeepStrictEqual(a,b))return;if(a===null||b===null||typeof a!=='object'||typeof b!=='object'){assert(entry && ['draft','sha256'].includes(p.at(-1)),`unexpected ledger change ${p.join('.')}`);const unit=now.units.find(u=>u.unit===entry.unit);assert(unit,`missing evidence unit ${entry.unit}`);if(p.at(-1)==='draft')assert.equal(b,unit.draft);else assert.equal(b,unit.sha256);differences.push({path:p.join('.'),unit:entry.unit,field:p.at(-1),old:a,current:b});return;}
for(const k of new Set([...Object.keys(a),...Object.keys(b)])){assert(Object.hasOwn(a,k)&&Object.hasOwn(b,k),`ledger shape ${p.join('.')} ${k}`);walk(a[k],b[k],[...p,k],typeof b.unit==='number'?b:entry);}}
walk(old.snapshot.ledger,now.snapshot.ledger,['ledger'],null);
let quotes=0;for(const item of Object.values(now.snapshot.ledger))for(const e of item.evidence??[]){if(typeof e.quote!=='string'||!Number.isInteger(e.unit))continue;const u=now.units.find(x=>x.unit===e.unit);assert(u);assert(read(path.join(current,u.draft)).toString('utf8').includes(e.quote),`missing quote ${e.unit}`);quotes++;}
const result={ok:true,units:now.units.length,old_revision:old.revision,current_revision:now.revision,changed_drafts:changes,unchanged_drafts:110,all_paths_volume_organized:true,characters_threads_timeline_identical:true,ledger_changes_only_rebound_evidence:differences,ledger_quotes_found:quotes,note:'Mechanical snapshot and quote comparison only; literary and causal review is in the Codex reports.'};
fs.writeFileSync(path.join(base,'final-independent-audit.json'),JSON.stringify(result,null,2)+'\n',{flag:'wx'});console.log(JSON.stringify({...result,ledger_changes_only_rebound_evidence:differences.length}));
