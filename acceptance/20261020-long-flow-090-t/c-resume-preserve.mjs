import {read,save,sha} from './common.mjs';
const [label,...refs]=process.argv.slice(2);
if(!/^[a-z0-9-]+$/.test(label)||!refs.length)throw new Error('label and refs required');
const files=[];
for(const ref of refs){if(ref.includes('..')||ref.startsWith('/'))throw new Error('relative work refs only');const b=read(ref);const target=`c-resume-history/${label}/${ref}`;save(target,b.toString('utf8'));files.push({ref,archive:target,bytes:b.length,sha256:sha(b)});}
save(`${label}.json`,{files});
process.stdout.write(JSON.stringify({ok:true,files}));
