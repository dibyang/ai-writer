import {read,json,save,sha,state,outer,assert} from './c-utils.mjs';
assert.equal(state().revision,282);const refs=['分段/AD-C-0056/01.md','分段/AD-C-0056/02.md',...Array.from({length:9},(_,i)=>`分段/AD-CR-0056/${String(i+3).padStart(2,'0')}.md`)];
const parts=refs.map(path=>({path,sha256:sha(Buffer.from(read(path)))}));
const total=refs.reduce((n,r)=>n+(read(r).replace(/^#.*$/gm,'').match(/\p{Script=Han}/gu)||[]).length,0);assert(total>=16000);
save('.writer/drafts/ad-cr-assemble56-input.json',{unit:56,expected_revision:282,draft:json('.writer/drafts/ad-c-record-template56-original.json').draft,parts,separator:'\n\n'});
outer('ccr-before56-assembly.json',{at:new Date().toISOString(),parts,han:total,original_template_preserved:true,original_first_two_preserved:true,failures:[{kind:'apply_patch-input',target:'AD-CR-0056/11.md',reason:'matched partial line instead of entire paragraph; no mutation',correction:'retry exact full paragraph successfully; original tool failure retained in native log'}]});console.log(JSON.stringify({ok:true,han:total,parts:parts.length}));
