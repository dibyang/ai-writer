import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
const n=Number(process.argv[2]), label=String(n).padStart(2,'0')+(process.argv[3]||''),out=import.meta.dirname,p=path.join(out,'../acceptance/20261016-long/works/雨线档案');
const template=JSON.parse(fs.readFileSync(path.join(out,`cli/template-${label}/stdout.txt`),'utf8'));
const context=JSON.parse(fs.readFileSync(path.join(out,`cli/context-${label}/stdout.txt`),'utf8'));
if(template.expected_revision!==context.revision||JSON.stringify(template.source_hashes)!==JSON.stringify(context.source_hashes)) throw Error('context/template mismatch');
const authored=JSON.parse(fs.readFileSync(path.join(out,`changes-${label}.json`),'utf8'));
const input={...template,...authored};delete input._instructions;
const draft=fs.readFileSync(path.join(p,input.draft),'utf8');
for(const [id,entry] of Object.entries(input.changes.ledger||{}))for(const e of entry.evidence||[]){if(e.unit!==n||!draft.includes(e.quote))throw Error(`invalid quote ${id}`);}
const han=(draft.replace(/^#.*\r?\n/u,'').match(/\p{Script=Han}/gu)||[]).length;
if(han<450||han>700)throw Error(`length ${han}`);
const target=path.join(out,`record-${label}.json`);if(fs.existsSync(target))throw Error('input exists');
fs.writeFileSync(target,JSON.stringify(input,null,2)+'\n');
console.log(JSON.stringify({unit:n,expected_revision:input.expected_revision,han,draft_sha256:crypto.createHash('sha256').update(fs.readFileSync(path.join(p,input.draft))).digest('hex'),ledger_ids:Object.keys(input.changes.ledger)}));
