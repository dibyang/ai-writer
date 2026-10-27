import fs from'node:fs';import path from'node:path';import{fileURLToPath}from'node:url';
const A=path.dirname(fileURLToPath(import.meta.url)),file=path.join(A,'fvr1-private-ownership.json');
if(!fs.existsSync(file)){console.log(JSON.stringify({created:false}));process.exit(0);}
const {workspace}=JSON.parse(fs.readFileSync(file,'utf8'));
if(typeof workspace!=='string'||path.relative(A,workspace).startsWith('..'))throw Error('Unexpected workspace');
const s=JSON.parse(fs.readFileSync(path.join(workspace,'.writer/state.json'),'utf8'));
console.log(JSON.stringify({workspace,units:s.units.length,revision:s.revision,generation:s.tool_control?.generation,pending:s.impact_pending?.length??null,scope:'Only public branch progress; ownership credential is not displayed.'}));
