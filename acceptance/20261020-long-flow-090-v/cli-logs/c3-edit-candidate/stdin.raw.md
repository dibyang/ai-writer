import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';
const V=path.resolve('acceptance/20261020-long-flow-090-v'),session=JSON.parse(fs.readFileSync(path.join(V,'cli-logs/c3-revision-begin/stdout.raw.txt'),'utf8')),R=path.resolve(session.workspace);
if(!R.startsWith(V+path.sep)||session.base_revision!==51||session.scope.from!==7||session.scope.through!==12)throw Error('Unexpected workspace');
const sha=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
fs.writeFileSync(path.join(V,'c3-revision-session.json'),JSON.stringify(session,null,2)+'\n',{flag:'wx'});
const edits={
 '正文/0007-先留出两包-v1.md':[['顺手带出一卷零钱。','顺手带出两卷零钱。'],['老板在柜台拆零钱的纸卷，纸边撕不开，','老板把一卷原封放在钱盒内侧，在柜台拆开另一卷。纸边撕不开，']],
 '正文/0008-半个钟头-v2.md':[['她擦干手，取出钱盒底下的零钱，递过去。上午开过的那卷已经少了大半，','她擦干手，取出早晨留在钱盒内侧、还没拆的那卷零钱。纸边紧，她借剪刀剪开，把零钱倒进盒里，再分出老板要找的数递过去。上午先开过的那卷已经少了大半，']],
 '正文/0009-留给明天的活-v2.md':[['我工钱五十。','我工钱五十五。'],['工五十，','工五十五，'],['七十六','八十一']],
 '正文/0011-盒子放进去-v2.md':[['工五十，','工五十五，'],['七十六','八十一'],['抽出五十、二十、一张五元和一张一元。','抽出五十、二十、一张十元和一张一元。'],['那张五元','那张十元']]
};
const results=[];for(const [rel,changes]of Object.entries(edits)){const file=path.join(R,rel),before=sha(file),backup=path.join(R,'.writer/drafts/c3-originals',path.basename(rel));fs.mkdirSync(path.dirname(backup),{recursive:true});fs.copyFileSync(file,backup,fs.constants.COPYFILE_EXCL);let text=fs.readFileSync(file,'utf8');for(const [a,b]of changes){if(!text.includes(a))throw Error('Missing '+a);text=text.split(a).join(b);}fs.writeFileSync(file,text);results.push({draft:rel,before_sha256:before,after_sha256:sha(file),original:path.relative(R,backup).replaceAll('\\','/'),edits:changes});}
fs.writeFileSync(path.join(V,'c3-candidate-edits.json'),JSON.stringify({id:session.id,workspace:R,results},null,2)+'\n',{flag:'wx'});console.log(JSON.stringify({id:session.id,results}));
