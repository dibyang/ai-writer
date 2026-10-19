# P8 Commercial Operations Design

Current license (2026-10-19): Apache-2.0; see ../LICENSE.md and ../NOTICE.
P8 records the earlier commercial packaging design. Trial, Pro, Studio and
Enterprise now describe optional support services only. Software use,
modification, commercial use and redistribution follow Apache-2.0 for all users.

## Background

Story Gate Studio can be sold as a private plugin package, but a sellable package needs more than working code. P8 closes the first commercial loop: license scope, trial policy, support flow, privacy boundary, renewal/update rules, and prohibited claims must all be documented and checked.

## Goals

- Define optional Trial, Pro, Studio, and Enterprise support-service boundaries.
- Document support, refund/escalation, update, and rollback procedures.
- State privacy and customer-content boundaries clearly.
- Prevent marketing claims that promise viral success, signing, traffic, revenue, or platform recommendation.
- Add an automated commercial-readiness gate.

## Non-Goals

- P8 does not implement online license activation.
- P8 does not integrate payment, invoice, tax, or refund systems.
- P8 does not provide legal advice or replace review by counsel.
- P8 does not publish to any public marketplace.

## Optional Support Tiers

| Tier | Intended Use | Distribution |
| --- | --- | --- |
| Trial | Time-limited evaluation support for one person or team | Versioned package; software rights do not expire |
| Pro | Individual author/editor workflow | Private zip, customer id, versioned package |
| Studio | Multi-project team workflow | Private package plus project-rule-pack templates |
| Enterprise | Contracted deployment or custom adapter | Contract, support plan, optional custom branch |

## Trial Policy

- Trial users receive a versioned package and checksum.
- Trial support or contracted update services may end after the agreed period; Apache-2.0 software rights do not expire.
- Customers may redistribute the software and bundled self-owned rules under Apache-2.0, retaining the required notices.
- Trial feedback must be anonymized before becoming universal plugin rules or fixtures.

## Privacy Boundary

- The plugin runs locally by default.
- It does not upload manuscripts, outlines, reports, visual assets, or customer rule packs.
- Optional service systems may only receive the minimum information authorized by the customer; software use does not require license activation.
- Customer work remains customer-owned.
- Support requests should use short excerpts, file paths, logs, or anonymized reproductions instead of full manuscripts.

## Support Flow

| Step | Owner | Evidence |
| --- | --- | --- |
| Intake | Customer/support | Version, archive SHA256, host, command, error output |
| Reproduce | Support | Run `customer-install-smoke --full` and relevant `host-run` request |
| Triage | Support | Classify as install, rule, report, docs, or commercial-policy issue |
| Fix | Maintainer | Patch, test, rebuild package, update `SHA256SUMS.txt` |
| Close | Support | Record fixed version or workaround |

## Update And Rollback

- Every package must include `CHANGELOG.md`, `RELEASE.md`, and `SHA256SUMS.txt`.
- Customers can roll back by reinstalling the previous accepted package and running `customer-install-smoke --full`.
- Stage commit hashes in `docs/phased-roadmap.md` are the engineering rollback anchors.

## Prohibited Claims

Commercial materials must not claim or imply:

- guaranteed virality or commercial success
- guaranteed signing or acceptance
- guaranteed platform recommendation
- guaranteed income, sales, or traffic
- official platform endorsement unless explicitly granted

## Acceptance

P8 is accepted when:

- `docs/commercial-operations.md` is included in the private package.
- `references/commercial-readiness.json` declares required docs, required statements, and prohibited claims.
- `scripts/commercial-readiness-check.js` passes in source and deliverable packages.
- `node scripts/story-gate.js validate` and `node --test tests/*.test.js` pass.
