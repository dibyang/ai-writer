import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const dir=path.dirname(fileURLToPath(import.meta.url)),file=path.join(dir,'command-inventory.json');
const inventory=JSON.parse(fs.readFileSync(file));
inventory.non_product_artifact_commands=[
 'node acceptance/20261019-hundred-h/read-a-recover/finalize.mjs inventory',
 'node acceptance/20261019-hundred-h/read-a-recover/validate.mjs',
 'node acceptance/20261019-hundred-h/read-a-recover/record-boundary.mjs',
 'node acceptance/20261019-hundred-h/read-a-recover/validate.mjs delivery-validation-v2.json',
 'node acceptance/20261019-hundred-h/read-a-recover/close-inventory.mjs',
 'node acceptance/20261019-hundred-h/read-a-recover/validate.mjs delivery-validation-final.json'
];
inventory.other_read_only_observations={git_status_before_and_after:'git status --short',clock:'Get-Date -Format o',boundary_script_git:['git status --short','git diff --stat'],local_inspection:'FastCtx read/glob/grep; missing tool/skills path corrected; no source writes',evidence:'Current process tool events; workspace-boundary-observation.json'};
inventory.progress_correction='One commentary count corrected immediately from generator: 2056 lines / 161836 bytes. Artifact counts always computed; delivery-validation retains both values.';
fs.writeFileSync(file,JSON.stringify(inventory,null,2)+'\n','utf8');
console.log(JSON.stringify({ok:true,captured_count:inventory.captured_count,added_non_product_command_inventory:true}));
