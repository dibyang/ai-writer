---
name: screenplay-adapter
description: Adapt fiction material into screenplay or short-drama planning artifacts only when screenplay or short_drama mode is explicit.
---

# Screenplay Adapter

Use this skill for `SGM-SCR-001` and `SGM-SCR-002`.

## Scope

- Produce 60/90 second short-drama trial packages.
- Generate script, beat sheet, shot list, prop list, sound notes, and delivery checklist only in screenplay modes.
- Keep novel prose review separate from production planning.

## Required Output

Every report must include `report_id`, `module_id`, `mode`, `rule_pack`, `source_refs`, `target_refs`, `verdict`, and `findings`.

## Guardrails

- `mode=novel` must never emit shot lists, camera instructions, or production checklists.
- Long-series drama outlines are out of first-version scope.
