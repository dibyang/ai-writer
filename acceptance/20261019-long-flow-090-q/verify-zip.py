import hashlib, json, pathlib, zipfile
base = pathlib.Path(__file__).resolve().parent
root = base.parent.parent
archive = base / 'candidate' / 'ai-writer-0.9.0.zip'
target = root / '.tmp' / '长篇 0.9.0 Q 最终解压'
assert not target.exists(), 'Never overwrite extraction'
manifest = json.loads((base / 'candidate' / 'release-manifest.json').read_text(encoding='utf-8'))
assert manifest['version'] == '0.9.0'
with zipfile.ZipFile(archive) as z:
    assert z.testzip() is None
    names = z.namelist()
    assert len(names) == len(set(names))
    for name in names:
        parts = pathlib.PurePosixPath(name).parts
        assert parts[0] == 'ai-writer-0.9.0' and '..' not in parts
        assert not pathlib.PurePosixPath(name).is_absolute() and '\\' not in name
    for row in manifest['files']:
        raw = z.read('ai-writer-0.9.0/' + row['file'])
        assert hashlib.sha256(raw).hexdigest() == row['sha256']
    assert json.loads(z.read('ai-writer-0.9.0/package.json'))['version'] == '0.9.0'
    assert 'ai-writer-0.9.0/.agents/skills/writer-project/SKILL.md' in names
    z.extractall(target)
result = dict(ok=True, archive_sha256=hashlib.sha256(archive.read_bytes()).hexdigest(), entries=len(names), checked_payloads=len(manifest['files']), extracted=str(target / 'ai-writer-0.9.0'))
(base / 'zip-verification.json').write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print(json.dumps(result, ensure_ascii=False))
