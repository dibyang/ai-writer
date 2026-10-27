# P6 Review Capability Enhancement Design

## Background

The plugin already has structural gates for chapter preparation, release residue, batch metrics, and market-readability signals. P6 strengthens the actual review value by adding a scorecard that separates:

- cold-reader abandonment risk
- clarity and current-page readability
- market pull
- emotional landing

## Goals

- Produce a traceable review scorecard for anonymous chapter drafts.
- Keep release readiness separate from market-readability and emotion.
- Catch concept-only emotion, dense system language, and missing next-pursuit pressure.
- Provide pass and needs-polish fixtures with automated tests.

## Non-Goals

- P6 does not promise signing, viral success, recommendations, or revenue.
- P6 does not rewrite manuscripts automatically.
- P6 does not train or call an external model.

## Current Flow

| Existing Entry | Current Capability | P6 Gap |
| --- | --- | --- |
| `third-party-review` | Cold-reader principles in skill text | No executable scorecard |
| `blockbuster-review` | Market-readability principles in skill text | No separate scores |
| `chapter-batch-metrics.js` | System density and live pressure | Batch-only, no cold-read verdict |
| `story-gate-audit.js` | Release residue scan | Mechanical, not reader-facing |

## Interface Design

```powershell
node scripts/story-gate.js review-scorecard <chapter.md...> [--rule-pack name@version] [--out report.json]
```

The command outputs a `StoryGateReport` with additional `scorecard` entries:

| Field | Meaning |
| --- | --- |
| `clarity_score` | Current-page readability and mainline clarity |
| `abandonment_risk` | Risk that a cold reader quits before future explanations |
| `market_pull_score` | Immediate pursuit, pressure, and next-click pull |
| `emotion_landing_score` | Whether emotion lands on people, body, object, and changed behavior |

## Scoring Rules

| Risk | Signal | Finding |
| --- | --- | --- |
| Dense system language | High system-term density with low live pressure | `SGM-REV-001-R002` |
| Sparse human exchange | No dialogue or exchange in a long draft | `SGM-READ-001-R003` |
| Weak next pursuit | No question, consequence, or immediate must-do | `SGM-MKT-001-R003` |
| Concept-only emotion | Low body/object pressure | `SGM-EMO-001-R001` |

## Failure Behavior

- Missing files return exit `2`.
- `needs_polish` returns exit `1`.
- Valid pass returns exit `0`.
- `--out` writes the same JSON report to disk.

## Tests

- `examples/fixtures/review-scorecard-pass.md` must pass.
- `examples/fixtures/review-scorecard-needs-polish.md` must return `needs_polish`.
- Unit tests assert score fields exist and findings use stable rule ids.
- `QG-011` verifies P6 design, script, and fixtures are traceable.

## Acceptance

P6 is accepted when source and deliverable packages pass:

- `node scripts/story-gate.js review-scorecard examples/fixtures/review-scorecard-pass.md`
- `node scripts/story-gate.js review-scorecard examples/fixtures/review-scorecard-needs-polish.md`
- `node scripts/story-gate.js validate`
- `node --test tests/*.test.js`
