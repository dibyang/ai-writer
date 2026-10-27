# Anonymous Customer Pilot Fixture

This fixture simulates a customer project without using source-project names, plot facts, manuscript text, or visual assets.

It covers the first sellable workflow:

1. Validate a project-local `rule-pack.json`.
2. Run review scorecard on an anonymous chapter page.
3. Run chapter gate on a structured chapter-opening card.
4. Run host adapter smoke with a container-style request.
5. Generate a support bundle that excludes manuscript files.

The `chapters/` directory is intentionally present so privacy tests can prove support bundles do not copy customer manuscript text.
