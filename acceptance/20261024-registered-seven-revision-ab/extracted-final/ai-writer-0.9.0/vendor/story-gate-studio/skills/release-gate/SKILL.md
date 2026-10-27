---
name: release-gate
description: Check manuscript release readiness, dedicated line-by-line typo and grammar proofreading, mechanical formatting, forbidden residue, term clarity, and publishing gate blockers.
---

# Release Gate

Use this skill for `SGM-GATE-001`, `SGM-GATE-002`, and `SGM-PROOF-001`.

## Scope

- Check word count, title/body format, TODOs, placeholders, meta-writing residue, encoding issues, and repeated templates.
- Run a dedicated line-by-line proofreading pass for typos, incorrect characters, broken collocations, missing sentence components, unclear references, subject drift, quote and punctuation errors, accidental repetition, and inconsistent names, ages, numbers, or object labels.
- Produce a pass/block/needs-polish verdict.
- Keep mechanical scan, human line-by-line proofreading, and market-readability scoring as three separate checks.

## Proofreading Gate

- Mechanical scripts may locate suspicious text, but they do not count as completion of the proofreading pass.
- For full-manuscript or formal-release review, read every target chapter in order and record the reviewed range.
- Fix only unambiguous language defects when manuscript editing is authorized; report debatable style changes separately.
- Block formal release when the target range has not received a dedicated line-by-line pass or when clear language defects remain.

## Required Output

Every report must include `report_id`, `module_id`, `mode`, `rule_pack`, `source_refs`, `target_refs`, `verdict`, and `findings`.

## Guardrails

- Do not submit, publish, schedule, or save drafts on external platforms.
- Do not modify manuscript files unless explicitly requested.
