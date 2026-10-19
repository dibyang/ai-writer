# Contributing

[中文](../../CONTRIBUTING.md)

Use the [bug guide](bug-reporting.md) for ordinary issues and [security guide](SECURITY.md) for sensitive reports. Include version, build identity, entry point and an anonymous minimal reproducer; a small test is preferable. Never upload private manuscripts, author rules or unlicensed reference material.

Tool code is in bin/, lib/ and tests/; skills are in .agents/skills/. Use isolated fixtures. Do not rewrite state or sealed evidence to bypass protections. Run npm test and npm run doctor; changes to the bundled engine also require npm run test:engine. Release changes require testing the extracted final ZIP.

Contributions are provided under Apache-2.0 unless explicitly agreed otherwise. Retain third-party licenses and attribution. Mechanical checks, model reading and human acceptance are distinct. The Chinese guide is authoritative.
