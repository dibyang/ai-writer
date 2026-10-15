# P4 Release Management Design

## Objective

P4 makes every customer package traceable by version, release decision, test evidence, archive hash, and rollback path. A release is accepted only when design, implementation, tests, retest notes, and acceptance status are all recorded.

## Scope

P4 covers the private commercial trial package for Codex. Future public marketplaces, license activation services, and remote update channels are outside this phase.

## Source Of Truth

`references/release-manifest.json` is the single release metadata source for:

- plugin name and plugin version
- private package profile
- release id and release status
- archive file name
- release notes and changelog paths
- required quality evidence
- rollback instructions

`package.json`, `.codex-plugin/plugin.json`, `CHANGELOG.md`, `RELEASE.md`, and archive naming must agree with the manifest.

## Release States

| State | Meaning |
| --- | --- |
| `draft` | Metadata is being prepared and must not be delivered |
| `release_candidate` | Candidate is ready for full quality gates |
| `private_trial` | Accepted for paid private trial or customer evaluation |
| `withdrawn` | Release is no longer deliverable |

## Archive Naming

The default archive name is:

```text
story-gate-studio-v<plugin_version>-private-commercial-trial.zip
```

The package directory can remain `story-gate-studio-private-commercial-trial` so customer install instructions stay stable. The zip name carries the version for support and rollback.

## Quality Gates

`scripts/release-check.js` must verify:

- `package.json` and `.codex-plugin/plugin.json` versions match the release manifest.
- `CHANGELOG.md` and `RELEASE.md` exist and mention the release id, version, archive name, status, tests, and rollback.
- The archive name follows the P4 naming convention.
- Required evidence includes quality gates, unit tests, customer install smoke, private package check, archive build, and Codex plugin validation.
- If a `SHA256SUMS.txt` path is supplied, it includes the manifest archive name.

## Rollback

Rollback is document-first in P4:

1. Locate the previous accepted release id and archive hash.
2. Reinstall the previous zip or marketplace source.
3. Re-run `customer-install-smoke --full`.
4. Record the rollback in customer support notes.

P4 does not automate remote rollback because the first version is distributed as a private local package.

## Acceptance

P4 is accepted when:

- `release-check` passes in source and deliverable package.
- `node scripts/story-gate.js validate` passes.
- `node --test tests/*.test.js` passes.
- Codex `validate_plugin.py` passes.
- The deliverable zip and `SHA256SUMS.txt` are rebuilt with the versioned archive name.
