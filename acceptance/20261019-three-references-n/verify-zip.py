import hashlib
import json
import pathlib
import stat
import sys
import zipfile

archive, target = map(pathlib.Path, sys.argv[1:3])
assert not target.exists(), 'Never overwrite an extraction'
prefix = 'ai-writer-0.8.0/'
with zipfile.ZipFile(archive) as z:
    infos = z.infolist()
    assert len({i.filename.casefold() for i in infos}) == len(infos)
    assert z.testzip() is None
    for i in infos:
        parts = pathlib.PurePosixPath(i.filename).parts
        assert i.filename.startswith(prefix) and '..' not in parts
        assert not stat.S_ISLNK(i.external_attr >> 16)
        assert not {'works', 'acceptance', '.git', '.idea', '.tmp', '.writer'} & set(parts)
    manifest = json.loads(z.read(prefix + 'RELEASE-MANIFEST.json'))
    assert manifest['version'] == '0.8.0'
    assert manifest['resource_profile'] == 'apache-2.0-v1'
    assert len(infos) == len(manifest['files']) + 1
    for row in manifest['files']:
        data = z.read(prefix + row['file'])
        assert len(data) == row['bytes']
        assert hashlib.sha256(data).hexdigest() == row['sha256'], row['file']
    for ref in ['.agents/skills/writer-project/SKILL.md', 'NOTICE', 'LICENSE.md', 'SECURITY.md']:
        assert prefix + ref in z.namelist()
    z.extractall(target)
print(json.dumps({'ok': True, 'reader': 'Python stdlib zipfile', 'zip_sha256': hashlib.sha256(archive.read_bytes()).hexdigest(), 'files': len(infos), 'crc_and_all_payload_sha256_verified': True, 'hidden_skills_present': True, 'safe_paths': True, 'extracted_root': str(target / 'ai-writer-0.8.0'), 'content_id': manifest['content_id']}, ensure_ascii=False))
