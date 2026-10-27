# P7 Host Adapter Design

## Background

The first plugin version runs well inside Codex, but future users may run it from another agent, a container, or CI. P7 defines a stable JSON adapter so those hosts do not need to know Codex skill internals.

## Goals

- Provide a host-neutral JSON request and response contract.
- Keep the existing Codex CLI commands unchanged.
- Support container-like execution with Node.js only and no npm dependencies.
- Add an automated smoke test that proves host mode works without Codex UI.

## Non-Goals

- P7 does not build or publish a Docker image.
- P7 does not add remote MCP servers or network services.
- P7 does not support every task; first adapter coverage is limited to representative review, chapter gate, and project rule-pack checks.

## Interface Design

```powershell
node scripts/story-gate.js host-run examples/host-adapter/review-scorecard-request.json
node scripts/story-gate.js host-run examples/host-adapter/blind-read-gate-request.json
```

Request shape:

| Field | Required | Description |
| --- | --- | --- |
| `adapter_version` | Yes | `story-gate-host-adapter@0.1.0` |
| `host` | Yes | `codex`, `agent`, `container`, or `ci` |
| `task` | Yes | `review_scorecard`, `blind_read_gate`, `chapter_gate`, or `project_rule_pack_check` |
| `mode` | Yes | `novel`, `visual`, `screenplay`, or `short_drama` |
| `target_refs` | Yes | Files or directories relative to plugin root or absolute paths |
| `rule_pack` | No | Optional rule-pack label |

Response shape:

| Field | Description |
| --- | --- |
| `adapter_version` | Adapter version |
| `host` | Echoed host |
| `task` | Echoed task |
| `status` | `pass`, `needs_polish`, `blocked`, or `error` |
| `exit_code` | Process-compatible exit code |
| `report` | Task report or validation result |
| `errors` | Adapter-level errors |

## Supported Tasks

| Task | Backing Script | Expected Output |
| --- | --- | --- |
| `review_scorecard` | `scripts/review-scorecard.js` | `StoryGateReport` with `scorecard` |
| `blind_read_gate` | `scripts/blind-read-gate.js` | Blind-read `StoryGateReport` |
| `chapter_gate` | `scripts/chapter-gate.js` | `StoryGateReport` |
| `project_rule_pack_check` | `scripts/project-rule-pack-check.js` | validation result |

## Failure Behavior

- Missing request file returns exit `2`.
- Schema or adapter errors return exit `2`.
- Task-level blocked or needs-polish returns exit `1`.
- Pass returns exit `0`.
- All outcomes print JSON so CI and other agents can parse the result.

## Container/CI Smoke

First-version container smoke is command-compatible rather than Docker-dependent:

```powershell
node scripts/story-gate.js host-run examples/host-adapter/review-scorecard-request.json
node scripts/story-gate.js host-run examples/host-adapter/blind-read-gate-request.json
node scripts/story-gate.js host-run examples/host-adapter/chapter-gate-request.json
```

Any future Docker or remote-agent wrapper must call the same JSON contract.

## Acceptance

P7 is accepted when source and deliverable packages pass:

- `node scripts/story-gate.js host-run examples/host-adapter/review-scorecard-request.json`
- `node scripts/story-gate.js host-run examples/host-adapter/blind-read-gate-request.json`
- `node scripts/story-gate.js host-run examples/host-adapter/chapter-gate-request.json`
- `node scripts/story-gate.js validate`
- `node --test tests/*.test.js`
