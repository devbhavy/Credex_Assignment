## Day 1 — 2026-05-06
**Hours worked:** 1hr

**What I did:** Set up the basic Express + Typescript boilerplate for the backend and started researching for the prices of the products to be included

**What I learned:** Learned that AI tool pricing varies significantly even within the same vendor For example: Claude has 6 different plans with very different use cases.

**Blockers / what I'm stuck on:** Designing the ui and layout for the website

**Plan for tomorrow:** Set up the logic to check for savings

## Day 2 — 2026-05-07
**Hours worked:** 3hrs

**What I did:** Built the core audit engine in TypeScript. Implemented three defensible checks — same-tool plan downsizing, API-to-flat-plan conversion, and redundant tool detection across categories. Added capability scores per plan (within the same tool only) to avoid suggesting downgrades that lose significant functionality. Fixed a bug where the engine was recommending free/hobby plans to paying teams.

**What I learned:** Realized that cross-tool capability comparison (e.g. Cursor vs Copilot) is not defensible from a finance perspective as different tools serve different workflows. Kept all comparisons within the same vendor only.

**Blockers / what I'm stuck on:** Designing the UI and layout for the website.

**Plan for tomorrow:** Build the spend input form on the frontend and wire it up to the audit engine via the Express API.

## Day 3 — 2026-05-08
**Hours worked:** 0hrs

**What I did:** Had a final practical exam, Took a day off.
