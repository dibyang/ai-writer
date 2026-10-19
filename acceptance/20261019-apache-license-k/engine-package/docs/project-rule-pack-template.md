# P5 Project Rule Pack Template Design

## Background

The universal plugin rule pack must stay reusable across fiction and screenplay projects. Customer-specific names, world rules, forbidden topics, pacing preferences, and delivery notes belong in an external `project_rule_pack`.

P5 turns the existing external rule-pack validation into a repeatable customer project template and initialization flow.

## Goals

- Provide a copyable project rule pack template for new customer projects.
- Generate a valid external rule pack without editing plugin `references/rule-pack.json`.
- Keep customer-private story material outside the distributable plugin.
- Test the template through the same `project-rule-check` gate used by real projects.

## Non-Goals

- P5 does not define a remote rule-pack registry.
- P5 does not merge customer rules into the universal commercial package.
- P5 does not store real customer manuscripts, names, or private plot chains.

## Existing Flow

| File | Current Role |
| --- | --- |
| `references/rule-pack.schema.json` | Common rule-pack schema |
| `examples/project-rule-packs/sample-project-rule-pack.json` | Anonymous external project sample |
| `scripts/project-rule-pack-check.js` | Validates an external rule pack |
| `story-gate.js project-rule-check` | CLI entry for external validation |

## Interface Design

```powershell
node scripts/story-gate.js init-project-rule-pack --out <dir> --name <project-slug> [--mode novel] [--force]
node scripts/story-gate.js project-rule-check <dir-or-rule-pack.json>
```

| Argument | Required | Description |
| --- | --- | --- |
| `--out` | Yes | External customer project directory; must not be inside the plugin root |
| `--name` | Yes | Lowercase project slug used as `rule_pack` |
| `--mode` | No | One of `novel`, `visual`, `screenplay`, `short_drama`; defaults to `novel` |
| `--force` | No | Allows replacing an existing generated `rule-pack.json` and `README.md` |

## Data Structure

Generated directory:

```text
<customer-project>/
  README.md
  rule-pack.json
```

`rule-pack.json` must contain:

- `rule_pack`: customer project slug
- `version`: `0.1.0`
- `modes`: selected mode list
- `modules`: at least one customer boundary module
- `rules`: at least one rule reminding customers to keep private material external

The default template also reserves a project-local physical constraints module. Use it for private evidence forms, artifact materials, scene procedures, period constraints, and reveal mechanics that should guide reviews but must not be copied into the universal plugin package.

## Failure Behavior

| Failure | Result |
| --- | --- |
| Missing `--out` or `--name` | exit `2` |
| Output path is inside plugin root | exit `2` |
| Target file exists without `--force` | exit `2` |
| Generated rule pack fails schema validation | exit `1` |

## Tests

- Unit test generates a rule pack in a temporary directory.
- Generated `rule-pack.json` passes `project-rule-check`.
- Test verifies plugin `references/rule-pack.json` is unchanged.
- QG-011 verifies P5 docs, templates, and script are listed in the design contract.

## Acceptance

P5 is accepted when source and deliverable packages pass:

- `node scripts/story-gate.js init-project-rule-pack --out <temp> --name sample-customer`
- `node scripts/story-gate.js project-rule-check <temp>/rule-pack.json`
- `node scripts/story-gate.js validate`
- `node --test tests/*.test.js`
