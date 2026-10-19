import hashlib, json, pathlib, zipfile

base = pathlib.Path(__file__).resolve().parent
root = base.parents[1]
archive = base / 'candidate' / 'ai-writer-0.9.0.zip'
destination = root / '.tmp' / '长篇 0.9.0 S 最终解压'
assert not destination.exists(), 'Never overwrite extracted candidate'
with zipfile.ZipFile(archive) as z:
    assert z.testzip() is None
    names = z.namelist()
    assert len(names) == len(set(names))
    for name in names:
        p = pathlib.PurePosixPath(name)
        assert not p.is_absolute() and '..' not in p.parts and '\\' not in name
        assert p.parts[0] == 'ai-writer-0.9.0'
    manifest = json.loads((base / 'candidate' / 'release-manifest.json').read_text(encoding='utf-8'))
    assert z.read('ai-writer-0.9.0/RELEASE-MANIFEST.json') == (base / 'candidate' / 'release-manifest.json').read_bytes()
    expected = {'ai-writer-0.9.0/RELEASE-MANIFEST.json'}
    for row in manifest['files']:
        name = 'ai-writer-0.9.0/' + row['file']
        expected.add(name)
        data = z.read(name)
        assert len(data) == row['bytes']
        assert hashlib.sha256(data).hexdigest() == row['sha256']
    assert set(names) == expected
    z.extractall(destination)
result = dict(ok=True, archive_sha256=hashlib.sha256(archive.read_bytes()).hexdigest(), entries=len(names), checked_payloads=len(manifest['files']), content_id=manifest['content_id'], extracted=str(destination / 'ai-writer-0.9.0'))
with (base / 'zip-verification.json').open('x', encoding='utf-8', newline='\n') as out:
    json.dump(result, out, ensure_ascii=False, indent=2)
    out.write('\n')
print(json.dumps(result, ensure_ascii=False))
