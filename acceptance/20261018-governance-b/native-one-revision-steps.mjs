import fs from 'node:fs';
import {pathToFileURL} from 'node:url';
import {base,project,read,put,input,cli,rev,hash} from './native-one-helper.mjs';
import {drafts} from './native-one-drafting.mjs';
export const session=read(base+'/native-one-revision-session.json'),branch=session.workspace;
export function prepare(n){const c=cli('rev-context-'+n,['context','--purpose','revision','--unit',String(n)],{p:branch,brief:true});console.log(JSON.stringify({context_actual:{unit:c.unit,revision:c.revision,plan:c.plan,snapshot:c.snapshot,recent:c.recent,previous_ending:c.previous_ending,continuity:c.continuity,source_hashes:c.source_hashes,source_bindings:c.source_bindings}}));const t=cli('rev-template-'+n,['record-template','--unit',String(n),'--draft',drafts[n]],{p:branch});put(base+'/native-one-inputs/rev-template-'+n+'.json',t);}
export function register(n){const t=read(base+'/native-one-inputs/rev-template-'+n+'.json'),x=read(base+'/native-one-inputs/content-'+n+'.json');
if(n===6)x.changes.ledger.OBJ_LETTER.custody.location='家中裁衣桌敞开的木盒内；鞋样夹旧样册';
const text=fs.readFileSync(branch+'/'+drafts[n],'utf8'),han=(text.replace(/^#.*\r?\n/,'').match(/\p{Script=Han}/gu)||[]).length;
if(han<600||han>900)throw Error('Body out of range');
console.log(JSON.stringify({unit:n,body_han:han,draft_sha256:hash(branch+'/'+drafts[n]),main_unchanged:hash(project+'/'+drafts[n])===read(base+'/commands/native-one-revision-begin/before-state.json').units.find(u=>u.unit===n).sha256}));
cli('rev-record-'+n,['record','--revision-token',session.token,'--input',input('rev-record-'+n,{...t,...x})],{p:branch});}
if(import.meta.url===pathToFileURL(process.argv[1]).href){
if(process.argv[2]==='rewind'){cli('rev-rewind',['rewind','--from','1','--expected-revision',String(rev(branch)),'--revision-token',session.token],{p:branch});prepare(1);}
if(process.argv[2]==='prepare')prepare(Number(process.argv[3]));
if(process.argv[2]==='record')register(Number(process.argv[3]));
}
