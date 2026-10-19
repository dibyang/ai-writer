# Changelog

## Unreleased

### Added

- `universal-novel@0.1.4` adds `SGM-PHY-001`, a physical logic and operability gate for chapter cards.
- `chapter-gate` now blocks key evidence, injury, trace, concealment, reveal order, or on-page action that lacks a physical operability explanation.
- `chapter-gate` now blocks vague physical explanations that do not include a concrete target and enough support anchors.
- `chapter-gate` now blocks small-object handling that lacks a size-appropriate action, and object states that shift between small/fragile and bundle/direct-pinch handling.
- `universal-novel@0.1.4` adds `SGM-DUAL-001` for dual-timeline body continuity, observed-fact immutability, and cross-boundary artifact lifecycle checks.
- `universal-novel@0.1.5` adds `SGM-BLIND-001` and `blind-read-gate` for single-chapter and continuous blind-read ticket governance.
- `universal-novel@0.1.6` adds `SGM-BLIND-001-R013`, requiring blind-read work to run through internal temporary agents with no current-context inheritance or sidebar/task retention.
- `install-local` installs the plugin into another local Codex project, writes marketplace config, initializes a project rule pack, and runs a light smoke check.

## story-gate-studio@0.1.0-private-commercial-trial.1

Release status: `private_trial`

Archive: `story-gate-studio-v0.1.0-private-commercial-trial.zip`

### Added

- Codex plugin baseline for story architecture, chapter workbench, review gates, market-readability, visual assets, and screenplay adaptation.
- Private commercial trial package checks and build flow.
- Versioned release manifest, release notes, changelog, archive naming, and release metadata gate.

### Quality Evidence

- `node scripts/story-gate.js validate`
- `node --test tests/*.test.js`
- `node scripts/story-gate.js customer-install-smoke --full`
- Codex `validate_plugin.py`

### Rollback

First accepted private trial release. Rollback means reinstalling a prior local package if one exists, then rerunning `customer-install-smoke --full`.
