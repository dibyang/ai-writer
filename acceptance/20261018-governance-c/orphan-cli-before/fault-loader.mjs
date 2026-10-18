import fs from 'node:fs';
import path from 'node:path';
if(process.env.AI_WRITER_C_TEST_FAULT==='1'&&/(?:^|[\\/])bin[\\/]ai-writer\.mjs$/.test(process.argv[1]??'')){const rename=fs.renameSync;fs.renameSync=(from,to)=>{if(path.resolve(to)===path.resolve(process.env.AI_WRITER_C_TEST_TARGET)){const e=new Error('Injected ENOSPC before review state publication');e.code='ENOSPC';throw e;}return rename(from,to);};}
