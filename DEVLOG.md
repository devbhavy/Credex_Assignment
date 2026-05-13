## Day 1 — 2026-05-06
**Hours worked:** 1hr

**What I did:** Set up the basic Express + Typescript boilerplate for the backend and started researching for the prices of the products to be included

**What I learned:** Learned that AI tool pricing varies significantly even within the same vendor For example: Claude has 6 different plans with very different use cases.

**Blockers / what I'm stuck on:** Designing the ui and layout for the website

**Plan for tomorrow:** Set up the logic to check for savings

## Day 2 — 2026-05-07
**Hours worked:** 3hrs

**What I did:** Built the core audit engine in TypeScript. Implemented three defensible checks same-tool plan downsizing, API-to-flat-plan conversion, and redundant tool detection across categories. Added capability scores per plan (within the same tool only) to avoid suggesting downgrades that lose significant functionality. Fixed a bug where the engine was recommending free/hobby plans to paying teams.

**What I learned:** Realized that cross-tool capability comparison (e.g. Cursor vs Copilot) is not defensible from a finance perspective as different tools serve different workflows. Kept all comparisons within the same vendor only.

**Blockers / what I'm stuck on:** Designing the UI and layout for the website.

**Plan for tomorrow:** Build the spend input form on the frontend and wire it up to the audit engine via the Express API.

## Day 3 — 2026-05-08
**Hours worked:** 0hrs

**What I did:** Had a final practical exam, Took a day off.

## Day 4 — 2026-05-09
**Hours worked:** 3.5hrs

**What I did:** Extended the audit engine significantly. Added usageFrequency field per tool if a user frequently hits usage limits, the engine no longer suggests a downgrade at all.Added needsAdminControls to the audit input when true, the engine suggests the team plan equivalent with a clear breakdown of extra cost and features gained. Also connected the server to a postgres database using prisma.

**What I learned:** Savings recommendations need to be contextual, the same plan downgrade can be completely wrong for one user and perfectly right for another depending on how heavily they use the tool. Also learned that team plans are never cheaper than individual plans, so they should only be recommended for feature reasons, not savings.

**Blockers / what I'm stuck on:** Figuring out how to generate shareable link for the result of audit.

**Plan for tomorrow:** Finish up the basic routes and start working on the frontend.

## Day 5 — 2026-05-10
**Hours worked:** 4hrs

**What I did:** Started building the frontend. Set up React Router with three routes landing page, audit form, and results page. Built the AddTool modal component with a dynamic plan dropdown that auto-populates based on the selected tool. Monthly spend is now auto-calculated from seats × price per seat instead of manual input API tools (Anthropic API, OpenAI API) are the only exception since they're pay-per-token. Also finalized the backend audit routes fixed a route ordering conflict where /:id was intercepting /:shareToken/public requests, fixed incorrect 404 responses returning 200, and fixed 300 status codes to proper 500s.

**What I learned:** Express route ordering matters — more specific routes must be defined before dynamic ones otherwise they never get reached.

**Blockers / what I'm stuck on:** ToolCard component and the full form page still need to be built. Results page design not started yet.

**Plan for tomorrow:** Build ToolCard, complete the CreateAudit form with team size and use case fields, wire up the submit to the backend, and start the results page.

## Day 6 — 2026-05-11
**Hours worked:** 2hrs

**What I did:** Worked on the Frontend. Completed a basic working blueprint for the create audit page.

**What I learned:** Revised how to take proper input using form element while building a website.

**Blockers / what I'm stuck on:** Figuiring out to properly send emails to the leads and designing a simplitic and modern ui for the website

**Plan for tomorrow:** Finish a basic working prototype for the website


## Day 7 — 2026-05-12

**Hours worked:** 4hrs

**What I did:** Built the audit results page frontend and connected it to the backend API. Added recommendation and redundancy cards with parsed JSON rendering instead of raw strings. Implemented public/private audit fetching using share tokens and query params. Added copy-share-link functionality with clipboard support and a success tooltip dialog. Integrated the email capture flow using the AddLead modal and set up transactional email sending with Brevo SMTP after debugging authentication issues. Fixed multiple frontend state and routing issues, improved loading/error handling, and cleaned up UI styling across the results page.

**What I learned:** Learned about email handling services like Brevo and Resend and how to properly send emails using there apis.

**Blockers / what I'm stuck on:** Need to polish responsive styling on smaller screens and improve the audit summary formatting. Email delivery works now, but production-grade deliverability/domain setup is still pending.

**Plan for tomorrow:** Finish responsive UI polish, improve landing page visuals, add validation/error states across forms, and prepare the project for deployment.
