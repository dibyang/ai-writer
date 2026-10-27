import fs from 'node:fs';import path from 'node:path';import {fileURLToPath} from 'node:url';
const A=path.dirname(fileURLToPath(import.meta.url));
const copy=(from,to,changes)=>{let s=fs.readFileSync(path.join(A,from),'utf8');for(const [before,after]of changes)s=s.replaceAll(before,after);fs.writeFileSync(path.join(A,to),s,{flag:'wx'});};
copy('verify-generation9-package.mjs','verify-generation9-package-v2.mjs',[['final-candidate','final-candidate-v2'],['generation9-package-verification.json','generation9-package-verification-v2.json'],['package-generation9.json','package-generation9-v2.json'],['assert.equal(total,234);assert.equal(passed,233);','assert.equal(total,235);assert.equal(passed,234);']]);
copy('extract-final-candidate-dotnet.mjs','extract-final-candidate-v2-dotnet.mjs',[['final-candidate','final-candidate-v2']]);
copy('cli-g9-source.mjs','cli-g9-v2-source.mjs',[['package-generation9.json','package-generation9-v2.json']]);
copy('probe-final-cli-prefix.mjs','probe-final-cli-prefix-v2.mjs',[['package-generation9.json','package-generation9-v2.json'],['final-package-cli-prefix/work','final-package-cli-prefix-v2/work'],['cli-g9-source.mjs','cli-g9-v2-source.mjs'],['g9-prefix','g9-v2-prefix'],['final-package-prefix-cli-verification.json','final-package-prefix-cli-verification-v2.json']]);
for(const ref of ['prepare-generation9-update.mjs','execute-generation9-update.mjs','verify-generation9-update.mjs','verify-final-build-g9.mjs','COMMON-G9.md','prompt-volume-first.template.md','prompt-volume-resume.template.md']){
 const file=path.join(A,ref);let s=fs.readFileSync(file,'utf8');s=s.replaceAll('package-generation9.json','package-generation9-v2.json').replaceAll('generation9-package-verification.json','generation9-package-verification-v2.json').replaceAll('cli-g9-source.mjs','cli-g9-v2-source.mjs');fs.writeFileSync(file,s);
}
console.log(JSON.stringify({ok:true,note:'Candidate1 artifacts and already used wrappers preserved. Only not-yet-activated final update/mini prompts now select candidate2.'}));
