import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
const stage='acceptance/20261016-hundred/session-03',project='acceptance/20261016-hundred/works/潮汐信号';
const name='0041-钥匙不能替人站着.md',archive=stage+'/repair-41-before/正文__'+name;
const digest=crypto.createHash('sha256').update(fs.readFileSync(archive)).digest('hex');
const item={path:path.resolve(project,'正文',name).replaceAll('\\','/'),sha256:digest,range:'full; lines 1-72',purpose:'第41章修前版本曾通过FastCtx完整实读自检；滚动复读时定位错字。此条绑定修前哈希，原路径后来正式rewind修订，原字节另存本阶段archive。',archived_version:path.resolve(archive).replaceAll('\\','/'),read_method:'actual full text at original path before rewind; archive copied later for version evidence, not a claim of a separate archive read',logged_at:new Date().toISOString()};
fs.appendFileSync(stage+'/reading.jsonl',JSON.stringify(item)+'\n');console.log('Sealed prior read version',digest);
