---
name: visual-asset-manager
description: Manage fiction visual asset cards, prompt records, version state, selected-entry checks, and visual delivery traceability.
---

# Visual Asset Manager

Use this skill for `SGM-VIS-001` and `SGM-VIS-002`.

## Scope

- Create visual task cards for characters, props, scenes, factions, prompts, and selected candidates.
- Check selected readiness through card, prompt, version, selection basis, and usage purpose.
- Keep visual assets independent from manuscript and outline directories.

## Required Output

Every report must include `report_id`, `module_id`, `mode`, `rule_pack`, `source_refs`, `target_refs`, `verdict`, and `findings`.

## Guardrails

- Use `mode=visual` explicitly.
- Do not modify manuscript prose.
- Do not assume generated images are commercially usable without license review.
