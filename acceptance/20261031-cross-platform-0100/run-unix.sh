#!/bin/sh
# Run on a real Linux or macOS host, with Node 20 or 24 already selected.
set -u
if [ "$#" -ne 2 ]; then
  echo "Usage: sh run-unix.sh /path/to/ai-writer-0.10.0.zip /path/to/new-result-directory" >&2
  exit 2
fi
archive_dir=$(CDPATH= cd -- "$(dirname -- "$1")" && pwd -P) || exit 2
archive="$archive_dir/$(basename -- "$1")"
result="$2"
expected=e27e2bb86dddd385f366bdbcd0d7df84d654e4ded0560727b45956fee793d23c
if command -v shasum >/dev/null 2>&1; then
  actual=$(shasum -a 256 "$archive" | awk '{print $1}')
elif command -v sha256sum >/dev/null 2>&1; then
  actual=$(sha256sum "$archive" | awk '{print $1}')
else
  echo 'Neither shasum nor sha256sum is available.' >&2
  exit 2
fi
if [ "$actual" != "$expected" ]; then
  echo "Archive SHA-256 mismatch: $actual" >&2
  exit 2
fi
if ! mkdir "$result"; then
  echo 'Result directory must not already exist.' >&2
  exit 2
fi
result=$(CDPATH= cd -- "$result" && pwd -P) || exit 2
{ uname -a; node --version; npm --version; printf 'archive_sha256=%s\n' "$actual"; } > "$result/environment.txt" 2>&1
if ! unzip -q "$archive" -d "$result/unpacked" > "$result/unzip.log" 2>&1; then
  echo 'Unzip failed; see unzip.log.' >&2
  exit 2
fi
cd "$result/unpacked/ai-writer-0.10.0" || exit 2
overall=0
for task in test doctor engine; do
  case "$task" in
    test) npm test > "$result/$task.log" 2>&1 ;;
    doctor) npm run doctor > "$result/$task.log" 2>&1 ;;
    engine) npm run test:engine > "$result/$task.log" 2>&1 ;;
  esac
  code=$?
  printf '%s exit=%s\n' "$task" "$code" | tee -a "$result/results.txt"
  if [ "$code" -ne 0 ]; then overall=1; fi
done
exit "$overall"
