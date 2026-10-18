# 发布门禁与评分规则

Apply this file whenever the user asks whether chapters can publish, finalize, release, pass review, or reach 定稿/发布线.

## Score Line

Use a strict 100-point scale by default.

- 97-100: reaches formal publication line if no hard blocker exists.
- 90-96: high quality but below publication line; write `阻止发布`.
- 80-89: usable but needs significant strengthening; write `阻止发布`.
- 70-79: has bright spots but structure or logic problems are obvious.
- 60-69: requires major rewrite.
- Below 60: rebuild core case, plot, or motivation.

## Gate Versus Market Score

The strict 97+ publication score is a gate score, not a natural market score. It means hard release requirements are satisfied; it must not automatically be translated into "cold third-party readers would score this 97" or "final blockbuster draft".

For full manuscripts, final volumes, long batches, or market-facing reviews, always output three separate fields:

- `formal gate verdict`: pass/block according to the strict publication gate.
- `external cold-read market score`: 0-100 from a stranger-reader/platform-editor/page-turner perspective.
- `blockbuster ceiling risk`: low/medium/high residual risk even if the formal gate passes.

Market-score anchors:

- 95+: blockbuster page-turner line strongly passes; few visible market weaknesses.
- 90-94: page-turner line passes, but ceiling can still be raised.
- 85-89: publishable with blockbuster potential, but do not call it a final blockbuster draft.
- 80-84: technically publishable may be possible, but page-turner stability is weak.
- Below 80: do not recommend release under a blockbuster goal.

Never let "rules completed", "no mechanical residue", or "logic closed" inflate the market score. If the formal gate passes but the cold-read market score is below 90, say: `通过发布门禁，但不建议称为满血爆款终稿`.
## Hard Publication Gate
For a single chapter, batch, volume, or whole manuscript:

- Below 97 must be treated as not passing publication line.
- Below 97 must not be called publishable, basically publishable, release-level, final-level, or ready with minor edits.
- Below 97 must explicitly say `阻止发布` and list concrete blockers.
- 90-96 may be called high quality, but still blocked.
- If score is 97 or above but a hard blocker exists, still write `阻止发布`.

## Hard Blockers Even At 97+

Block release if any exists:

- case or plot logic hard injury;
- ordinary readers cannot understand core danger;
- major psychological node is thin when it carries retention or chapter hook;
- double-world rules fail or two lines detach;
- key evidence is unfair or appears too late;
- scene reads like screenplay rather than novel;
- crucial professional/historical wording is so condensed that readers must stop to translate;
- emotional climax lacks trigger, pressure, choice, or consequence.
- major psychological node reads as AI-like, plot-functional, overly linear, or emotionally inhuman rather than like a specific person under real pressure;
- a chapter contains important psychological description but only patches it with one or two added sentences instead of rebuilding the reaction according to that character's personality, profession, status, fear, coping style, perception order, bodily leak, choice, and residue;
- major character reaction contradicts established personality, profession, status, fear, wound, relationship pattern, or coping style without a clear trigger and consequence;
- multiple major characters share the same generic calm/clever/analytical reaction style when their baselines should make them respond differently;
- only the protagonist has believable human psychology while supporting characters, victims, antagonists, witnesses, servants, officials, family members, or colleagues function as props, clue devices, pressure machines, or emotional buttons.

## Blockbuster Goal Gate

When the user says the target is 爆款, 追读, 上头, 陌生读者, commercial readability, or final market-facing draft, do not treat formal publication as the only gate.

Use two separate lines:

- `正式发布线`: blocked only by structural, logic, fairness, continuity, prose, or required psychological blockers.
- `爆款追读线`: blocked or cautioned by cold delivery, system-led final arcs, weak character attachment, insufficient continuous emotional cost, or answers that do not become live conflict.

Allowed verdicts include:

- `通过发布线，可以发布；爆款追读线也通过`.
- `不阻止发布，但不建议直接作为最终爆款稿`.
- `阻止发布` when formal publication blockers exist.

Do not use a 97+ formal-release score to imply 爆款 readiness if the page-turner module finds severe coldness or settlement-list fatigue.

## Output Template

For batch review:

1. Verdict: `通过发布线，可以发布` or `阻止发布`.
2. Overall score. For full manuscripts with market goals, include separate `正式发布线` and `爆款追读线` scores or verdicts.
3. Chapter score table.
4. Hard blockers, if any.
5. Cross-chapter risks.
6. Ordinary-reader readability.
7. Genre/special-module judgment.
8. Small polishing suggestions, clearly marked as non-blocking.

Never hide a release blocker inside mild wording.