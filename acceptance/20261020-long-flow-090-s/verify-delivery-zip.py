import hashlib, json, pathlib, sys, zipfile
base = pathlib.Path(__file__).resolve().parent
root = base.parents[1]
candidate_name, destination_name, receipt_name = sys.argv[1:]
for name in (candidate_name, destination_name, receipt_name):
    assert name and name not in ('.', '..') and '/' not in name and '\\' not in name
candidate = base / candidate_name
destination = root / '.tmp' / destination_name
assert not destination.exists(), 'Never overwrite extracted candidate'
archive = candidate / 'ai-writer-0.9.0.zip'
manifest = json.loads((candidate / 'release-manifest.json').read_text(encoding='utf-8'))
with zipfile.ZipFile(archive) as z:
    assert z.testzip() is None
    names = z.namelist()
    assert len(names) == len(set(names)) == len({x.casefold() for x in names})
    for name in names:
        p = pathlib.PurePosixPath(name)
        assert not p.is_absolute() and '..' not in p.parts and '\\' not in name and p.parts[0] == 'ai-writer-0.9.0'
    assert z.read('ai-writer-0.9.0/RELEASE-MANIFEST.json') == (candidate / 'release-manifest.json').read_bytes()
    expected = {'ai-writer-0.9.0/RELEASE-MANIFEST.json'}
    for row in manifest['files']:
        name = 'ai-writer-0.9.0/' + row['file']
        expected.add(name)
        raw = z.read(name)
        assert len(raw) == row['bytes'] and hashlib.sha256(raw).hexdigest() == row['sha256']
    assert set(names) == expected
    z.extractall(destination)
result = dict(ok=True, candidate=candidate_name, archive_sha256=hashlib.sha256(archive.read_bytes()).hexdigest(), entries=len(names), checked_payloads=len(manifest['files']), content_id=manifest['content_id'], extracted=str(destination / 'ai-writer-0.9.0'))
with (base / receipt_name).open('x', encoding='utf-8', newline='\n') as out:
    json.dump(result, out, ensure_ascii=False, indent=2)
    out.write('\n')
print(json.dumps(result, ensure_ascii=False))
