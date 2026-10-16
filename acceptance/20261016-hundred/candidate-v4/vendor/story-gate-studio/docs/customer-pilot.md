# P9 Customer Pilot Design

## Background

Story Gate Studio already has a private commercial trial package, release tracking, customer install smoke, project rule-pack template, review scorecard, host adapter, and commercial readiness checks. The next risk is not packaging. The next risk is whether a buyer can use the package on a project that is not the source project and still get value without leaking customer manuscript content.

## Goals

- Prove an anonymous customer project can complete the first workflow after zip extraction.
- Validate that customer project rules stay outside the universal plugin rule pack.
- Produce review, chapter gate, host adapter, and support-bundle evidence from one customer pilot command.
- Ensure support diagnostics do not copy manuscript prose, chapter drafts, visual assets, or customer private source material.
- Keep the workflow usable in Codex today and portable to future agents or containers.

## Non-Goals

- P9 does not run a real paid customer trial.
- P9 does not implement payment, online activation, CRM, or refund handling.
- P9 does not publish to a public marketplace.
- P9 does not upload manuscripts or send support bundles over the network.
- P9 does not replace legal review of customer data-processing terms.

## Existing Flow

| Existing Asset | Role In P9 |
| --- | --- |
| `customer-install-smoke` | Confirms the package can run after zip extraction |
| `init-project-rule-pack` | Shows how customers create project-local rules |
| `review-scorecard` | Produces the first value-bearing writing report |
| `chapter-gate` | Checks chapter-opening readiness |
| `host-run` | Keeps the same workflow portable to container/CI hosts |
| `private-package-check` | Guards distributable package boundaries |
| `commercial-readiness-check` | Guards license, support, privacy, and claim boundaries |

## Interface Design

| Command | Input | Output | Failure Behavior |
| --- | --- | --- | --- |
| `customer-pilot --project <dir> [--out report.json] [--support-out dir]` | A project directory with `rule-pack.json`, `chapters/`, `chapter-gate.json`, and `host-request.json` | `StoryGateReport` with nested review, metrics, gate, host, and support checks | Exit `1` when any check blocks; exit `2` for argument or filesystem errors |
| `support-bundle --project <dir> --out <dir> [--force]` | A customer project directory | `support-bundle.json` diagnostics | Refuses overwrite unless `--force`; does not copy manuscript text |
| `support-bundle --project <dir> --dry-run` | A customer project directory | Diagnostic JSON to stdout | No writes; useful for package smoke |

## Data Structure

| File | Purpose |
| --- | --- |
| `examples/customer-pilot/` | Anonymous customer project fixture |
| `examples/customer-pilot/rule-pack.json` | Project-local rule pack |
| `examples/customer-pilot/chapters/opening-page.md` | Anonymous manuscript-like test page |
| `examples/customer-pilot/chapter-gate.json` | Structured chapter gate card |
| `examples/customer-pilot/host-request.json` | Container-style host adapter request |
| `references/license-profile.json` | Local license-tier facts used by commercial docs and future activation design |

## State Machine

| State | Trigger | Next State |
| --- | --- | --- |
| `prepared` | Project fixture exists | `validated_rules` |
| `validated_rules` | `project-rule-check` passes | `reviewed` |
| `reviewed` | `review-scorecard` and `chapter-batch-metrics` pass | `gated` |
| `gated` | `chapter-gate` passes | `host_verified` |
| `host_verified` | `host-run` exits `0` | `support_ready` |
| `support_ready` | `support-bundle` excludes manuscript files | `accepted` |
| any state | A blocker appears | `blocked` |

## Exception Handling

- Missing project directory, rule pack, chapter gate card, host request, or chapter fixture returns a blocking finding.
- Private marker hits in the customer pilot fixture block P9.
- Review, metrics, chapter gate, host adapter, or support bundle failures are preserved as nested report data.
- Support bundle overwrite requires `--force`.

## Rollback Strategy

Rollback P9 by reverting the P9 stage commit and removing:

- `docs/customer-pilot.md`
- `docs/support-playbook.md`
- `references/license-profile.json`
- `scripts/customer-pilot.js`
- `scripts/support-bundle.js`
- `examples/customer-pilot/`
- task registry, CLI, tests, manifest, and roadmap entries that reference P9

## Compatibility

- Uses only Node.js built-in modules.
- Runs without network access.
- Produces JSON that can be called from Codex, other agents, containers, and CI.
- Keeps customer project material outside plugin universal references.

## Test Plan

| Test | Acceptance |
| --- | --- |
| `node scripts/story-gate.js customer-pilot --project examples/customer-pilot` | exits `0`, verdict `pass` |
| `node scripts/story-gate.js support-bundle --project examples/customer-pilot --dry-run` | exits `0`, lists excluded manuscript files |
| unit test support bundle privacy | output contains no chapter prose |
| `node scripts/story-gate.js validate` | all gates pass |
| `node --test tests/*.test.js` | all tests pass |
| deliverable package smoke | source and packaged plugin both pass |

## Risks

| Risk | Severity | Mitigation |
| --- | --- | --- |
| Support bundle leaks manuscript text | High | Do not copy manuscript files; test against known fixture prose |
| Anonymous fixture feels too artificial | Medium | Use it for automation first, then run a real user-approved pilot later |
| Customer expects online licensing | Medium | Keep P9 local; document online activation as future work |
| Report is technically valid but not commercially persuasive | Medium | Use pilot feedback to decide P10 pricing and product copy |

## Acceptance

P9 is accepted only when the source plugin and rebuilt deliverable package both prove:

- A customer pilot project can complete rules, review, gate, host, and support checks.
- Support diagnostics exclude manuscript files.
- Package manifests include P9 docs, scripts, and fixtures.
- Roadmap and implementation plan record P9 design, implementation, tests, acceptance, commit hash, and rollback path.
