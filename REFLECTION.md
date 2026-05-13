# Reflection — CredLens

## 1. Hardest Bug

The hardest bug I hit was a route ordering conflict in Express. I had
defined `GET /:id` before `GET /:shareToken/public` in the audit router.
When I tested the public route in Postman, it was returning audit data
by ID instead of by share token, the `:id` route was intercepting
every request before the public route ever got a chance to match.

My first hypothesis was that the share_token column wasn't being set
correctly in the DB. I checked the Supabase dashboard tokens were
there. Then I wondered if Prisma was silently failing the findUnique
on share_token. Added console.logs the route handler wasn't even
being reached. That's when I realized Express was matching `/:id` first
because it was defined earlier in the file.

Fix was one line — moved `/:shareToken/public` above `/:id`. Took
about 40 minutes of Postman tinkering to isolate something that was
fixed in 5 seconds. Learned that in Express, route specificity doesn't
matter order does.

---

## 2. A Decision I Reversed

I initially planned to use Resend for transactional emails. Set up the account, got the API key, started integrating. Mid-week I switched to Brevo instead. Brevo's free tier is equally as generous for the volume a lead-gen tool like this would realistically send and it supports sending emails without having a verified domain.

The switch wasn't painful — the API shape is similar enough that it was mostly a find-and-replace on the SDK calls. But it cost about an hour of re-integration time I hadn't budgeted for. In hindsight I should have compared free tier limits before committing to either.

---

## 3. What I'd Build in Week 2

First priority would be the three bonus features from the brief — PDF
export of the full audit report, a benchmark mode showing how a team's
AI spend per developer compares to companies of similar size, and
referral codes so sharing the tool has a built-in incentive loop.

Beyond that I'd add data visualisation to the results page — a bar
chart breaking down spend per tool, a pie chart showing the split
between optimal and overspent tools, and a savings timeline showing
projected annual savings month by month. Right now the results page
is numbers and text. Charts make it shareable and screenshot-worthy,
which is the viral loop the product needs.

I'd also add a returning user flow — right now every audit is stateless.
A lightweight account system would let teams track their spend over
time and see if they acted on the recommendations.

---

## 4. How I Used AI Tools

I used Claude and ChatGPT throughout the week as a thought partner
and code reviewer. Specifically for: designing the audit engine logic,
catching edge cases in the capability scoring system, writing the
Express route structure, and drafting the markdown documentation files.

I did not trust Claude with: pricing data (verified every number
manually against official vendor pages), the audit engine's defensibility
logic (Claude suggested cross-tool capability comparisons early on —
I rejected this because a finance person couldn't verify it), and
the user interview notes (those had to be real conversations).

One specific time Claude was wrong: it initially suggested recommending
GitHub Copilot Pro as the best value alternative for any coding use case
regardless of what tool the user was already on. The reasoning was purely
price-based Copilot is cheaper therefore recommend it. I pushed back
because this assumes Copilot and Cursor have equivalent capabilities,
which they don't. The fix was to remove cross-tool recommendations
entirely and only compare within the same vendor.

---

## 5. Self Ratings

**Discipline: 8/10** — Committed consistent hours across all 7 days,
no days skipped, commits spread across the full week as required.

**Code quality: 7/10** — TypeScript used throughout with proper typing,
audit engine is modular and testable, but some components could be
broken down further and error handling on the frontend is thinner than
I'd like.

**Design sense: 8/10** — The landing page and results page feel
considered rather than generic, consistent visual language throughout,
but mobile responsiveness was not tested as thoroughly as it should have
been.

**Problem solving: 8/10** — Caught several logic flaws in the audit
engine before they shipped (hobby plan recommendation bug, cross-tool
capability comparison, seat-unaware plan suggestions) and fixed them
with defensible reasoning rather than hacks.

**Entrepreneurial thinking: 7/10** — Understood the lead-gen mechanic,
the value-before-email pattern, and the Credex upsell angle. Could have
gone deeper on the GTM and distribution strategy earlier in the week
rather than leaving it to the documentation phase.