# Release Notes

| Field | Value |
| --- | --- |
| Release id | `story-gate-studio@0.1.0-private-commercial-trial.1` |
| Release status | `private_trial` |
| Plugin version | `0.1.0` |
| Package profile | `private-commercial-trial@0.1.0` |
| Archive | `story-gate-studio-v0.1.0-private-commercial-trial.zip` |
| Rollback | Reinstall the previous accepted package, then run `customer-install-smoke --full` |

## Decision

This release is accepted for private commercial trial after P0-P4 quality gates. It is not a public marketplace release.

## Included Capabilities

- Fiction architecture and chapter workbench workflows.
- Third-party review, release gate, and market-readability review workflows.
- Visual asset and short-drama planning workflows.
- Private package, archive, checksum, customer install smoke, and release metadata checks.

## Required Tests

- `node scripts/story-gate.js validate`
- `node --test tests/*.test.js`
- `node scripts/story-gate.js private-package-check`
- `node scripts/story-gate.js build-release-archive --package-dir ../../story-gate-deliverables/story-gate-studio-private-commercial-trial --out-dir ../../story-gate-deliverables --force`
- `node scripts/story-gate.js customer-install-smoke --zip ../../story-gate-deliverables/story-gate-studio-v0.1.0-private-commercial-trial.zip --extract-to ../../story-gate-deliverables/tmp-customer-smoke --full`
- Codex `validate_plugin.py`

## Rollback Procedure

1. Verify the previous release archive hash in `SHA256SUMS.txt` or customer support records.
2. Reinstall the previous package source.
3. Run `node scripts/story-gate.js customer-install-smoke --full`.
4. Record the rollback reason and customer environment.
