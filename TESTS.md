## auditEngine.test.ts
File: src/lib/auditEngine.test.ts
Runner: vitest
Command: npx vitest run

| # | Test name | What it covers |
|---|---|---|
| 1 | unknown_tool flag | Tools not in pricing catalog return unknown_tool, no redundancies |
| 2 | coding overlap detection | Cursor + Copilot flagged as redundant AI Coding Assistants |
| 3 | api_to_flat suggestion | Anthropic API >$200/mo recommended to switch to Claude flat plan |
| 4 | use_case_mismatch | Cursor flagged for writing team, Claude recommended |
| 5 | admin_controls_upgrade | Pro plan + needsAdminControls=true → recommend teams plan |
| 6 | enterprise passthrough | Enterprise plans marked optimal, no downsizing attempted |
| 7 | savings aggregation | totalAnnualSaving = totalMonthlySaving × 12, isAlreadyOptimal logic |