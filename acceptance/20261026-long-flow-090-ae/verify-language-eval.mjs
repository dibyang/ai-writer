import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {isDeepStrictEqual} from 'node:util';
import {fileURLToPath} from 'node:url';
const A=path.dirname(fileURLToPath(import.meta.url)),E=path.join(A,'language-eval');
const j=f=>JSON.parse(fs.readFileSync(f,'utf8').replace(/^\uFEFF/,'')),sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const sampleBytes=fs.readFileSync(path.join(E,'samples.json')),samples=JSON.parse(sampleBytes),expected=j(path.join(E,'expected-root-only.json')).cases,ids=samples.cases.map(x=>x.id);
assert.equal(ids.length,16);assert.deepEqual(Object.keys(expected),ids);
const results=[];
for(const [prefix,run]of [['baseline','language-baseline-retry'],['updated','language-updated']]){
 const native=j(path.join(A,'native',run,'result.json'));assert.equal(native.exit_code,0);assert.equal(native.error,null);
 const firstBytes=fs.readFileSync(path.join(E,prefix+'-first.json')),finalBytes=fs.readFileSync(path.join(E,prefix+'-final.json')),first=j(path.join(E,prefix+'-first.json')),final=j(path.join(E,prefix+'-final.json')),snapshot=j(path.join(E,prefix+'-first-root-snapshot.json'));
 assert.equal(sha(firstBytes),snapshot.sha256);assert.deepEqual(firstBytes,fs.readFileSync(path.join(A,'originals/language-eval',prefix+'-first.json')));
 for(const document of [first,final]){
  assert.deepEqual(document.cases.map(x=>x.id),ids);
  for(const row of document.cases){const sample=samples.cases.find(x=>x.id===row.id);assert(['issue','keep','context-needed'].includes(row.verdict));assert.equal(row.quote,sample.text,'Exact quotation '+row.id);assert(row.reason?.trim());assert(row.reading_cost?.trim());assert((row.minimal_direction??row.minimum_direction)?.trim());assert.equal(Object.keys(row.language_tests).length,4);assert(Object.values(row.language_tests).every(v=>typeof v==='string'&&v.trim()));assert(row.preserve?.length);}
 }
 const cases=final.cases,mismatches=cases.filter(x=>x.verdict!==expected[x.id].verdict).map(x=>({id:x.id,actual:x.verdict,expected:expected[x.id].verdict}));
 const counts=Object.fromEntries(['issue','keep','context-needed'].map(v=>[v,cases.filter(x=>x.verdict===v).length]));
 results.push({prefix,run,thread_id:native.thread_id,exit_code:native.exit_code,elapsed_ms:native.elapsed_ms,first_sha256:sha(firstBytes),final_sha256:sha(finalBytes),report_sha256:sha(fs.readFileSync(path.join(E,prefix+'-report.md'))),counts,case_label_agreement:16-mismatches.length,mismatches,first_to_final_verdict_changes:cases.filter(x=>x.verdict!==first.cases.find(y=>y.id===x.id).verdict).map(x=>x.id),first_to_final_case_details_unchanged:isDeepStrictEqual(first.cases,final.cases),normal_controls_flagged:cases.filter(x=>expected[x.id].verdict==='keep'&&x.verdict!=='keep').map(x=>x.id),insufficient_context_overcalled:cases.filter(x=>expected[x.id].verdict==='context-needed'&&x.verdict!=='context-needed').map(x=>x.id),first_root_snapshot_at:snapshot.at});
}
assert.deepEqual(results[0].mismatches,[{id:'L07',actual:'context-needed',expected:'issue'}]);assert.deepEqual(results[1].mismatches,[]);
for(const r of results){assert.deepEqual(r.normal_controls_flagged,[]);assert.deepEqual(r.insufficient_context_overcalled,[]);}
const updated=j(path.join(E,'updated-final.json'));for(const row of updated.sources){assert.equal(sha(fs.readFileSync(row.path)),row.sha256.toLowerCase());}
const finalPackage=j(path.join(A,'package-generation9-v5.json')),verified=j(path.join(A,'generation9-package-verification-v5.json'));assert(verified.ok);assert.equal(finalPackage.content_id,verified.content_id);
const rules=['SKILL.md','references/general-review.md','references/natural-language-authenticity.md','references/deslop.md','references/concrete-language-review.md'].map(ref=>{const old=path.join(A,'extracted-final-candidate-v4/ai-writer-0.9.0/.agents/skills/writer-review',ref),current=path.join(finalPackage.package,'.agents/skills/writer-review',ref),a=fs.readFileSync(old),b=fs.readFileSync(current);assert.deepEqual(a,b);return{file:ref,sha256:sha(b),evaluated_v4_equals_final_v5:true};});
assert.equal(sha(fs.readFileSync(path.join(E,'samples.json'))),sha(sampleBytes));
const output={ok:true,at:new Date().toISOString(),samples:16,author_example:'L07',synthetic_other_cases:15,samples_sha256:sha(sampleBytes),expected_sha256:sha(fs.readFileSync(path.join(E,'expected-root-only.json'))),results,final_package_content_id:finalPackage.content_id,rule_files:rules,scope:'Case-label agreement with controller-authored regression criteria, exact quotations/hashes and unchanged evaluated rule bytes in final package. Baseline identified L07 candidates but deferred the whole case; this is not a claim it detected nothing. Root semantic review is separate. Not independent corpus accuracy, human blind reading, guaranteed AI detection, or whole-book acceptance.'};
fs.writeFileSync(path.join(E,'root-verification.json'),JSON.stringify(output,null,2)+'\n',{flag:'wx'});console.log(JSON.stringify({ok:true,samples:16,baseline_agreement:results[0].case_label_agreement,updated_agreement:results[1].case_label_agreement,normal_controls:8,false_positive_controls:0,insufficient_context:2,final_rule_files_identical:rules.length}));
