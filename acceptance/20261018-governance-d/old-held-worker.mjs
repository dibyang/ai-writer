import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
const [root,input,out]=process.argv.slice(2),{main}=await import(pathToFileURL(path.join(root,'.writer/tool/lib/workspace.mjs')));
const before=main(['status','--project',root]);process.send({ready:true,version:'actual-frozen-0.6',schema:before.schema_version,revision:before.revision});
process.on('message',()=>{let value;try{value={unexpected_success:main(['workflow','set','--project',root,'--input',input])};}catch(e){value={rejected:true,code:e.code??null,error:e.message};}fs.writeFileSync(out,JSON.stringify(value,null,2)+'\n');process.exit(value.rejected?0:1);});
