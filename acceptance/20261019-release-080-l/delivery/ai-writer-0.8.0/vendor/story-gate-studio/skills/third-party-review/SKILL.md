---
name: third-party-review
description: Run cold-reader, commercial-editor, platform-screening, clarity, and abandonment-risk reviews for fiction drafts.
---

# Third-party Review

Use this skill for `SGM-REV-001`, `SGM-READ-001`, and `SGM-BLIND-001`.

## Scope

- Surface abandonment risk before defending the project.
- Review clarity, pacing, character specificity, and reader-facing mainline.
- Separate current-page risk from future explanation.
- For blind-read tasks, separate single-chapter and continuous blind reads, human tickets, isolated agent tickets, and informed review.

## Required Output

Every report must include `report_id`, `module_id`, `mode`, `rule_pack`, `source_refs`, `target_refs`, `verdict`, and `findings`.

## Guardrails

- Default to review-only.
- Do not directly rewrite official manuscript files without explicit current-turn permission.
- Do not excuse a chapter by saying later chapters will explain it.
- Do not count informed review as blind-read evidence.
- Do not use average scores to override a failed blind-read ticket.
- Do not treat a single-chapter blind-read pass as continuous-read or publication readiness.
- For blind reading, use only an internal temporary agent: no previewable task, no inherited current conversation context, discard after readback, and leave no sidebar entry.
