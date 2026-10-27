import {fs,path,project,read,json,sha,save,outer,assert} from './c-utils.mjs';
const t=json('.writer/drafts/ad-dr-record-template60-original.json');for(const[r,h]of Object.entries(t.source_hashes))assert.equal(sha(fs.readFileSync(path.join(project,r))),h,r);
const parts=Array.from({length:13},(_,i)=>{const r=`分段/AD-DR-0060/${String(i+1).padStart(2,'0')}.md`;return {path:r,sha256:sha(fs.readFileSync(path.join(project,r)))}});
save('.writer/drafts/ad-dr-assemble60-input.json',{unit:60,expected_revision:289,draft:t.draft,parts,separator:'\n\n'});
outer('ddr-before60-assembly.json',{parts,source_hashes_verified:true,correction:{original:'分段/AD-DR-0060/12-v1-original.md',old_sha256:sha(Buffer.from(read('分段/AD-DR-0060/12-v1-original.md'))),current:'分段/AD-DR-0060/12.md',reason:'母此前未听女昨夜遗杯，删问话中又字；女随后本章亲口告知昨晚遗杯才新增母所知'},han:parts.reduce((n,p)=>n+(read(p.path).replace(/^#.*$/gm,'').match(/\p{Script=Han}/gu)||[]).length,0)});
console.log(JSON.stringify({ok:true,parts:13,source_hashes_verified:true}));
