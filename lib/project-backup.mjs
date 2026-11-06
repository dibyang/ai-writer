// Legacy read-only inventory is retained for existing callers. It must not
// authorize writes. Automatic backup is disabled until OS-enforced lock
// isolation is implemented and verified; there is no pathname-copy fallback.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { userError } from './help.mjs';

const changed = rel => userError(`清点期间文件或目录发生变化：${rel || '.'}`, { code: 'BACKUP_SOURCE_CHANGED' });
const unsafe = rel => userError(`清点拒绝链接或特殊文件：${rel || '.'}`, { code: 'BACKUP_UNSAFE_PATH' });
const identity = s => [s.dev, s.ino, s.mode, s.size, s.mtimeMs, s.ctimeMs, s.nlink].join(':');

export function inventoryProject(root) {
  const base = path.resolve(root), entries = [];
  const buffer = Buffer.allocUnsafe(1024 * 1024);
  function walk(dir, rel) {
    const before = fs.lstatSync(dir);
    if (before.isSymbolicLink() || !before.isDirectory()) throw unsafe(rel);
    entries.push({ path: rel, type: 'directory' });
    const names = fs.readdirSync(dir).sort();
    for (const name of names) {
      const file = path.join(dir, name), child = rel ? `${rel}/${name}` : name;
      const initial = fs.lstatSync(file);
      if (initial.isSymbolicLink()) throw unsafe(child);
      if (initial.isDirectory()) { walk(file, child); continue; }
      if (!initial.isFile() || initial.nlink !== 1) throw unsafe(child);
      const fd = fs.openSync(file, fs.constants.O_RDONLY | (fs.constants.O_NOFOLLOW || 0));
      try {
        const opened = fs.fstatSync(fd);
        if (!opened.isFile() || identity(initial) !== identity(opened)) throw changed(child);
        const digest = crypto.createHash('sha256'); let size = 0, n;
        while ((n = fs.readSync(fd, buffer, 0, buffer.length, null)) > 0) { digest.update(buffer.subarray(0, n)); size += n; }
        if (identity(opened) !== identity(fs.fstatSync(fd)) || size !== opened.size || identity(opened) !== identity(fs.lstatSync(file))) throw changed(child);
        entries.push({ path: child, type: 'file', bytes: size, sha256: digest.digest('hex') });
      } finally { fs.closeSync(fd); }
    }
    if (identity(before) !== identity(fs.lstatSync(dir)) || JSON.stringify(names) !== JSON.stringify(fs.readdirSync(dir).sort())) throw changed(rel);
  }
  walk(base, '');
  return { entries, file_count: entries.filter(e => e.type === 'file').length,
    bytes: entries.reduce((total, e) => total + (e.bytes ?? 0), 0) };
}

const invalid = message => { throw userError(message, {code:'BACKUP_REQUEST_INVALID'}); };

// No worker process is launched while the enforced isolation gate is closed.
export function createBackupService({safe,guard}) {
  const preliminary=root=>{
    const p=guard(root);
    if(!/^[a-f0-9]{64}$/.test(p.backup_execution?.runtime_id??'')||!/^[a-f0-9]{64}$/.test(p.backup_execution?.content_id??''))throw userError('缺少已验证的执行构建身份', {code:'BACKUP_BUILD_INVALID'});
    if(fs.existsSync(safe(p.root,'.git')))throw userError('该受限后端尚不支持内嵌Git目录或指针；需要专门备份，不忽略这些内容', {code:'BACKUP_VCS_UNSUPPORTED'});
    if(fs.existsSync(safe(p.root,'.writer/write.lock')))throw userError('作品存在写锁；保留锁并停止', {code:'BACKUP_SOURCE_BUSY'});
    return p;
  };
  const destination=q=>{
    if(typeof q.out_parent!=='string'||!path.isAbsolute(q.out_parent)||typeof q.out_name!=='string'||!/^[A-Za-z0-9_-]{1,100}$/.test(q.out_name))invalid('out_parent须为现有绝对目录，out_name须为新的安全单组件名称');
  };
  const isolationError=()=>userError('同UID可写目录没有已验证的操作系统级锁隔离；自动备份保持关闭', {code:'BACKUP_LOCK_ISOLATION_UNVERIFIED',next_action:'需要受保护的协调域与独立身份或强制访问策略方案；不能用参数、重试或旧请求跳过。'});
  return {
    inspect(root,q) {
      if(!q||Object.keys(q).some(k=>!['out_parent','out_name'].includes(k)))invalid('inspect仅接受out_parent和out_name');
      destination(q);
      preliminary(root);
      if(process.platform!=='linux'||process.arch!=='x64')return {ok:true,can_backup:false,scope:'inspect-only',blockers:[{code:'BACKUP_PLATFORM_UNSUPPORTED',message:'本平台未提供已验证的隔离备份后端'}],request:null};
      const e=isolationError();
      return {ok:true,can_backup:false,scope:'inspect-only',blockers:[{code:e.code,message:e.message}],request:null};
    },
    create(root,q) {
      // Reject before inspecting a source, acquiring a lock or opening output.
      // There is no force/test/environment option to enable this operation.
      throw isolationError();
    }
  };
}
