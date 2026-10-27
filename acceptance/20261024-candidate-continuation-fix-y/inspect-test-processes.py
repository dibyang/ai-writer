"""Inspect only process command lines for this run; no process memory scan or broad kill."""
import ctypes as c, ctypes.wintypes as w, json
k=c.WinDLL('kernel32',use_last_error=True); n=c.WinDLL('ntdll')
class Entry(c.Structure):
    _fields_=[('size',w.DWORD),('usage',w.DWORD),('pid',w.DWORD),('heap',c.c_size_t),('module',w.DWORD),('threads',w.DWORD),('parent',w.DWORD),('priority',w.LONG),('flags',w.DWORD),('exe',w.WCHAR*260)]
class U(c.Structure): _fields_=[('length',w.USHORT),('max',w.USHORT),('buffer',c.c_void_p)]
k.CreateToolhelp32Snapshot.restype=w.HANDLE;k.Process32FirstW.argtypes=[w.HANDLE,c.POINTER(Entry)];k.Process32NextW.argtypes=[w.HANDLE,c.POINTER(Entry)];k.OpenProcess.argtypes=[w.DWORD,w.BOOL,w.DWORD];k.OpenProcess.restype=w.HANDLE;k.CloseHandle.argtypes=[w.HANDLE]
n.NtQueryInformationProcess.argtypes=[w.HANDLE,w.ULONG,c.c_void_p,w.ULONG,c.POINTER(w.ULONG)];n.NtQueryInformationProcess.restype=w.LONG
def command(pid):
    handle=k.OpenProcess(0x1000,False,pid)
    if not handle:return None
    try:
        size=w.ULONG();n.NtQueryInformationProcess(handle,60,None,0,c.byref(size))
        if size.value< c.sizeof(U) or size.value>1024*1024:return None
        buf=c.create_string_buffer(size.value)
        if n.NtQueryInformationProcess(handle,60,buf,len(buf),c.byref(size))<0:return None
        value=U.from_buffer(buf);return c.wstring_at(value.buffer,value.length//2)
    finally:k.CloseHandle(handle)
handle=k.CreateToolhelp32Snapshot(2,0);entry=Entry();entry.size=c.sizeof(entry);rows=[]
try:
    more=k.Process32FirstW(handle,c.byref(entry))
    while more:
        rows.append({'pid':entry.pid,'parent':entry.parent,'exe':entry.exe});more=k.Process32NextW(handle,c.byref(entry))
finally:k.CloseHandle(handle)
markers=['npm-test-source-final.log','npm-test-package.log']
for row in rows:
    if row['exe'].lower() in ['pwsh.exe','powershell.exe','node.exe','cmd.exe']:
        row['command']=command(row['pid'])
anchors=[r for r in rows if r.get('command') and any(marker in r['command'] for marker in markers)]
ids={r['pid'] for r in anchors}
while True:
    more={r['pid'] for r in rows if r['parent'] in ids}
    if more.issubset(ids):break
    ids|=more
selected=[r for r in rows if r['pid'] in ids]
matches=[r for r in rows if r.get('command') and '--test' in r['command'] and ('D:\\work\\other\\ai-writer\\tests\\' in r['command'] or 'D:\\work\\other\\ai-writer\\acceptance\\20261024-candidate-continuation-fix-y\\extracted-fixed\\ai-writer-0.9.0\\tests\\' in r['command'])]
print(json.dumps({'process_count':len(rows),'queryable':sum(bool(r.get('command')) for r in rows),'anchors':anchors,'descendants':selected,'test_roots':matches},ensure_ascii=False,indent=2))
