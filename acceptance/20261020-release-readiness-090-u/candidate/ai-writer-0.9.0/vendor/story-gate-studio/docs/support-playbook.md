# Support Playbook

## Purpose

This playbook defines the first support workflow for private commercial trial customers. It keeps support useful without asking customers to send manuscript text.

## Support Intake

| Category | Customer Sends | Must Not Send |
| --- | --- | --- |
| Install issue | OS, Node version, command output, package checksum | Manuscript text |
| Rule-pack issue | `project-rule-check` output, rule-pack hash, module ids | Full private story bible unless explicitly approved |
| Review issue | Report JSON, command used, anonymized excerpt if customer chooses | Full chapter draft by default |
| Host/container issue | Host request JSON, exit code, stderr/stdout | Secrets, tokens, private repo paths |
| Commercial/license issue | License tier, purchase contact, package version | Payment card data |

## Support Bundle Policy

`support-bundle` may include:

- plugin version and package profile
- project label
- rule-pack hash and size
- report file hashes and sizes
- list of manuscript files that were detected and excluded
- validation errors

`support-bundle` must not include:

- chapter prose
- manuscript drafts
- visual assets
- source project private names
- customer secrets
- payment data

## Triage States

| State | Meaning | Next Action |
| --- | --- | --- |
| `new` | Customer reports an issue | Ask for command and support bundle |
| `reproduced` | Issue reproduced with fixture or support metadata | Create fix task |
| `needs_customer_context` | Metadata is insufficient | Ask for anonymized minimal example |
| `fixed` | Patch passes source and package tests | Ship next package |
| `closed` | Customer confirms or issue is no longer reproducible | Record resolution |

## Response Templates

### Install Failure

Ask the customer to run:

```powershell
node scripts/story-gate.js customer-install-smoke --full
node scripts/story-gate.js validate
```

Then request the command output and package checksum.

### Review Quality Issue

Ask for:

- the generated `StoryGateReport`
- the command used
- the project rule-pack hash
- an anonymized minimal excerpt only if the customer approves

### Support Bundle

Ask the customer to run:

```powershell
node scripts/story-gate.js support-bundle --project <project-dir> --out <support-dir>
```

Remind the customer that the bundle is designed not to include manuscript prose, but they should still inspect it before sending.

## Escalation

Escalate to product/design review when:

- the report is correct but not useful enough to sell
- the customer needs a workflow that changes privacy boundaries
- repeated projects require the same new rule module
- support evidence is insufficient without manuscript access

## Acceptance

The support workflow is accepted when `support-bundle` can run on the anonymous customer pilot fixture and prove that chapter files are detected but excluded.
