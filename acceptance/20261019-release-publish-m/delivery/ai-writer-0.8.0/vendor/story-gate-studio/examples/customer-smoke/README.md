# Customer Smoke Example

This directory is a placeholder for customer-side installation smoke tests.

P3 verifies that a customer can validate the package without using private project content:

```powershell
node scripts/story-gate.js customer-install-smoke --full
```

The smoke workflow uses only bundled anonymous fixtures and does not require a real manuscript.
