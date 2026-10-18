import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
const base=path.dirname(fileURLToPath(import.meta.url)),phase=process.argv[2],json=f=>JSON.parse(fs.readFileSync(f)),sha=b=>crypto.createHash('sha256').update(b).digest('hex');
assert.ok(/^[a-z][a-z0-9-]*$/.test(phase??''));const native=json(path.join(base,phase,'process-result.json'));assert.equal(native.exit_code,0);const reading=json(path.join(base,'reading-audit',phase+'.json'));assert.equal(reading.ok,true);
const original=json(path.join(base,'original-inventory.json')),work=path.join(base,'work'),before=JSON.parse(fs.readFileSync(path.join(base,'baseline-state.bin'))),now=json(path.join(work,'.writer/state.json'));
assert.equal(now.schema_version,6);assert.equal(now.units.length,100);assert.deepEqual(now.units,before.units);assert.deepEqual(now.snapshot,before.snapshot);assert.equal(now.tool_control.generation,2);
let preserved=0;for(const row of original.files){if(row.file==='.writer/state.json'||row.file.startsWith('.writer/tool/'))continue;assert.equal(sha(fs.readFileSync(path.join(work,row.file))),row.sha256,row.file);preserved++;}
const prefix=phase==='read-a-update'?'f-a-':phase==='read-b'?'f-b-':phase==='read-c'?'f-c-':'f-d-',products=[];
for(const name of fs.readdirSync(path.join(base,'commands')).filter(n=>n.startsWith(prefix)).sort()){const ref=path.join(base,'commands',name,'result.json');if(!fs.existsSync(ref))continue;const r=json(ref);if(!r.build_before)continue;const at=r.args.indexOf('--project');assert.ok(at>=0,'Missing explicit project '+name);assert.equal(fs.realpathSync(r.args[at+1]),fs.realpathSync(work),name);assert.equal(r.runtime_files_stable,true,name);products.push({label:name,exit_code:r.exit_code,elapsed_ms:r.elapsed_ms});}
assert.ok(products.length>0,'No captured product CLI');
const result={ok:true,phase,process_exit:native.exit_code,elapsed_s:native.elapsed_s,reading:{from:reading.from,to:reading.to,units:reading.units,characters:reading.characters,full_exact_line_coverage:true},current:{revision:now.revision,generation:now.tool_control.generation,registered:now.units.length},original_units_snapshot_and_non_tool_files_unchanged:true,preserved_original_files:preserved,product_cli:products.length,nonzero_product_results:products.filter(r=>r.exit_code!==0),products,nature:'Independent exposure, byte integrity and command target audit; no literary scoring.'};
const dest=path.join(base,'reading-audit',phase+'-stage.json');fs.writeFileSync(dest,JSON.stringify(result,null,2)+'\n',{flag:'wx'});console.log(JSON.stringify({ok:true,phase,reading:result.reading,product_cli:products.length,nonzero_results:result.nonzero_product_results.length,revision:now.revision,preserved_original_files:preserved}));
