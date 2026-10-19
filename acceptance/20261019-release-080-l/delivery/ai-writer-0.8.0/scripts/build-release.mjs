import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import zlib from 'node:zlib';
import {fileURLToPath} from 'node:url';
import {identifyBuild,writeBuildManifest,sourceProvenance} from '../lib/tool-build.mjs';

const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const sha=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
const forbidden=new Set(['.git','.idea','.codex','.tmp','.writer','works','acceptance','node_modules','dist']);
function safeRef(ref){
  if(typeof ref!=='string'||!ref||/[\\:\x00-\x1f]/.test(ref)||ref.split('/').some(x=>!x||x==='.'||x==='..'||/[. ]$/.test(x)||forbidden.has(x.toLowerCase())||/^(?:con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\..*)?$/i.test(x)))throw Error('Unsafe release path: '+ref);
  return ref;
}
function sourceFile(root,ref){
  let file=root;
  for(const part of safeRef(ref).split('/')){file=path.join(file,part);if(fs.lstatSync(file).isSymbolicLink())throw Error('Release input must not be a symlink: '+ref);}
  if(!fs.statSync(file).isFile())throw Error('Release input is not a file: '+ref);
  return file;
}
const crcTable=Array.from({length:256},(_,n)=>{for(let k=0;k<8;k++)n=n&1?0xedb88320^(n>>>1):n>>>1;return n>>>0;});
function crc32(bytes){let n=0xffffffff;for(const byte of bytes)n=crcTable[(n^byte)&255]^(n>>>8);return (n^0xffffffff)>>>0;}
function inventory(root,ref=''){
  const rows=[];
  for(const name of fs.readdirSync(path.join(root,ref)).sort()){
    const next=ref?ref+'/'+name:name,file=sourceFileOrDir(root,next);
    if(fs.statSync(file).isDirectory())rows.push(...inventory(root,next));else{const bytes=fs.readFileSync(file);rows.push({file:next,bytes:bytes.length,sha256:sha(bytes)});}
  }
  return rows;
}
function sourceFileOrDir(root,ref){const file=path.join(root,safeRef(ref));if(fs.lstatSync(file).isSymbolicLink())throw Error('Unexpected symlink in release');return file;}
function zip(root,prefix,rows){
  if(rows.length>=65535)throw Error('ZIP64 is not supported');
  const chunks=[],central=[];let offset=0;
  for(const row of rows){
    const name=Buffer.from(prefix+'/'+safeRef(row.file),'utf8'),raw=fs.readFileSync(path.join(root,row.file)),compressed=zlib.deflateRawSync(raw,{level:9});
    if(raw.length>=0xffffffff||offset>=0xffffffff||name.length>65535)throw Error('Release exceeds ZIP limits');
    const crc=crc32(raw),local=Buffer.alloc(30),header=Buffer.alloc(46);
    local.writeUInt32LE(0x04034b50);local.writeUInt16LE(20,4);local.writeUInt16LE(0x800,6);local.writeUInt16LE(8,8);local.writeUInt16LE(33,12);
    local.writeUInt32LE(crc,14);local.writeUInt32LE(compressed.length,18);local.writeUInt32LE(raw.length,22);local.writeUInt16LE(name.length,26);
    header.writeUInt32LE(0x02014b50);header.writeUInt16LE(0x314,4);header.writeUInt16LE(20,6);header.writeUInt16LE(0x800,8);header.writeUInt16LE(8,10);header.writeUInt16LE(33,14);
    header.writeUInt32LE(crc,16);header.writeUInt32LE(compressed.length,20);header.writeUInt32LE(raw.length,24);header.writeUInt16LE(name.length,28);header.writeUInt32LE((0o100644<<16)>>>0,38);header.writeUInt32LE(offset,42);
    chunks.push(local,name,compressed);central.push(header,name);offset+=local.length+name.length+compressed.length;
  }
  const directory=Buffer.concat(central),end=Buffer.alloc(22);end.writeUInt32LE(0x06054b50);end.writeUInt16LE(rows.length,8);end.writeUInt16LE(rows.length,10);end.writeUInt32LE(directory.length,12);end.writeUInt32LE(offset,16);
  return Buffer.concat([...chunks,directory,end]);
}
export function buildRelease({root=ROOT,out}={}){
  root=path.resolve(root);const pkg=JSON.parse(fs.readFileSync(path.join(root,'package.json')));
  if(pkg.version!=='0.8.0'||pkg.aiWriter?.resourceProfile!=='apache-2.0-v1')throw Error('Expected first release 0.8.0 with apache-2.0-v1 resources');
  out=path.resolve(out??path.join(root,'dist','0.8.0'));if(fs.existsSync(out))throw Error('Output already exists; never overwrite a release: '+out);
  const build=identifyBuild(root);if(!build.ok)throw Error('Source build is incomplete');
  const spec=JSON.parse(fs.readFileSync(path.join(root,'release/distribution.json'))),seen=new Set(),sources=[];
  for(const item of spec.files){const ref=safeRef(item.file),key=ref.toLowerCase();if(seen.has(key))throw Error('Duplicate release path: '+ref);seen.add(key);const source=sourceFile(root,item.source??ref);sources.push({file:ref,source:item.source??ref,sha256:sha(fs.readFileSync(source))});}
  fs.mkdirSync(path.dirname(out),{recursive:true});const staging=path.join(path.dirname(out),'.ai-writer-release-'+crypto.randomUUID());fs.mkdirSync(staging);
  // Preserve failed staging for diagnosis; this command never recursively deletes a path.
  const prefix='ai-writer-'+pkg.version,folder=path.join(staging,prefix);fs.mkdirSync(folder);
  for(const row of sources){const target=path.join(folder,row.file);fs.mkdirSync(path.dirname(target),{recursive:true});fs.copyFileSync(path.join(root,row.source),target);}
  const provenance=sourceProvenance(root);writeBuildManifest(folder,provenance);
  const packaged=identifyBuild(folder);if(!packaged.ok||packaged.observed_content_id!==build.observed_content_id)throw Error('Packaged runtime/resources differ from source');
  const manifest={format:'ai-writer-release@1',version:pkg.version,license:pkg.license,resource_profile:packaged.resource_profile,source_provenance:provenance,content_id:packaged.observed_content_id,sources,files:inventory(folder)};
  const manifestBytes=Buffer.from(JSON.stringify(manifest,null,2)+'\n');fs.writeFileSync(path.join(folder,'RELEASE-MANIFEST.json'),manifestBytes,{flag:'wx'});
  const archiveName=prefix+'.zip',archive=zip(folder,prefix,inventory(folder));fs.writeFileSync(path.join(staging,archiveName),archive,{flag:'wx'});
  fs.writeFileSync(path.join(staging,'release-manifest.json'),manifestBytes,{flag:'wx'});
  fs.copyFileSync(path.join(folder,'RELEASE_NOTES.md'),path.join(staging,'RELEASE_NOTES.md'));
  const sums=[archiveName,'release-manifest.json','RELEASE_NOTES.md'].map(ref=>sha(fs.readFileSync(path.join(staging,ref)))+'  '+ref).join('\n')+'\n';fs.writeFileSync(path.join(staging,'SHA256SUMS.txt'),sums,{flag:'wx'});
  if(fs.existsSync(out))throw Error('Output appeared during build; staging preserved');fs.renameSync(staging,out);
  return {ok:true,version:pkg.version,output:out,archive:path.join(out,archiveName),archive_sha256:sha(archive),archive_bytes:archive.length,files:manifest.files.length+1,content_id:manifest.content_id,resource_profile:manifest.resource_profile,source_provenance:provenance};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  try{const args=process.argv.slice(2);if(args.length&&!(args.length===2&&args[0]==='--out'))throw Error('Usage: node scripts/build-release.mjs [--out NEW_DIRECTORY]');console.log(JSON.stringify(buildRelease({out:args[1]}),null,2));}catch(error){console.error(error.message);process.exitCode=1;}
}
