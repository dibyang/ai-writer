import fs from 'node:fs';
const base='acceptance/20261016-hundred',phase=process.argv[2]??JSON.parse(fs.readFileSync(`${base}/active.json`)).phase;
const state=JSON.parse(fs.readFileSync(`${base}/works/潮汐信号/.writer/state.json`));
const events=fs.existsSync(`${base}/${phase}/events.jsonl`)?fs.readFileSync(`${base}/${phase}/events.jsonl`,'utf8').split(/\r?\n/).filter(Boolean).flatMap(x=>{try{return [JSON.parse(x)]}catch{return []}}):[];
const messages=events.filter(x=>x.type==='item.completed'&&x.item?.type==='agent_message');
const commands=events.filter(x=>x.type==='item.completed'&&x.item?.type==='command_execution');
console.log(JSON.stringify({phase,registered:state.units.length,revision:state.revision,events:events.length,commands:commands.length,latest_message:messages.at(-1)?.item?.text?.slice(-1800),process:fs.existsSync(`${base}/${phase}/process-result.json`)?JSON.parse(fs.readFileSync(`${base}/${phase}/process-result.json`)):undefined},null,2));
