const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const [a,b,label]=process.argv.slice(2),base=__dirname,p=path.resolve(base,'../works/潮汐信号');
const files=fs.readdirSync(path.join(p,'正文')).sort();let output='',hashes={};
for(let n=+a;n<=+b;n++){const f=files.find(f=>f.startsWith(String(n).padStart(4,'0')+'-'));if(!f)throw new Error('missing '+n);const ref='正文/'+f,buf=fs.readFileSync(path.join(p,ref));hashes[ref]=crypto.createHash('sha256').update(buf).digest('hex');output+='\n'+ref+' SHA256='+hashes[ref]+'\n'+buf.toString('utf8').split('\n').map((s,i)=>`${i+1}\t${s}`).join('\n')+'\n';}
fs.writeFileSync(path.join(base,label+'.read.txt'),output);fs.writeFileSync(path.join(base,label+'.hashes.json'),JSON.stringify(hashes,null,2)+'\n');process.stdout.write(output);
