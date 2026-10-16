import fs from 'node:fs';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';
const launcher='C:/Users/admin/AppData/Local/OpenAI/Codex/bin/e78bad9887fa50cf/codex.exe';
const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const record={created_at:new Date().toISOString(),platform:process.platform,node:process.version,node_sha256:hash(process.execPath),launcher,launcher_sha256:hash(launcher),cli_version:execFileSync(launcher,['--version'],{encoding:'utf8'}).trim(),git:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),model_override:false,subagents:false,source_note:'CLI is a locally installed native executable. No global user configuration was changed.',official_configuration_reference:'https://developers.openai.com/zh-Hans/docs/config-file/config-basic'};
fs.writeFileSync('acceptance/20261016-hundred/environment.json',JSON.stringify(record,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify(record));
