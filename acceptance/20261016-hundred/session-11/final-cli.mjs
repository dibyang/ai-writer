import fs from 'node:fs';import {cli,runner,save,stage,project} from './run-cli.mjs';
for(const [label,args]of [['status-final',['status']],['check-final',['check']],['doctor-final',['doctor']]]){const r=cli(args,label);console.log(label+'\n'+r.stdout);if(r.stderr)console.error(r.stderr);if(r.exit_code!==0)process.exit(r.exit_code??1);}
const g=runner.run('git',['status','--short'],'git-status-final');console.log('git-status-final\n'+g.stdout);
const statusRow=runner.last('status-final');if(statusRow.label!=='status-final'||statusRow.executable!==process.execPath||statusRow.argv[0]!=='bin/ai-writer.mjs'||statusRow.argv[1]!=='status')throw Error('Exact status CLI identity mismatch');
const s=runner.json('status-final'),c=runner.json('check-final');if(s.next_unit!==91||s.draft_inventory.registered_count!==90||s.stale_units.length||s.changed_sources.length||c.rolling_review.pending_windows.length||c.findings.length)throw Error('Final status/check not ready');
if(fs.existsSync(`${stage}/export`))throw Error('Export already exists; never overwrite');
const e=cli(['export','--out',`${stage}/export`],'export-final');console.log('export-final\n'+e.stdout);if(e.stderr)console.error(e.stderr);if(e.exit_code!==0)process.exit(e.exit_code??1);
save('final-cli-summary.json',{status:s,check:c,doctor:runner.json('doctor-final'),export:runner.json('export-final'),status_label_exact:true,status_cli_argv:statusRow.argv,elapsed_s:Math.round((Date.now()-Date.parse('2026-10-16T11:20:29.717Z'))/1000)});
