# METRICS.md — Metrics & Measurement Strategy

## North Star Metric

**Qualified leads generated per week** — defined as email captures where the audit showed ≥ $500/month in potential savings.

### Why this and not something else

This tool has one job: generate warm leads for Credex from people with real overspend. "Audit completions" is too broad someone who completes an audit showing $0 savings is not a lead. "Consultations booked" is too narrow and too downstream to optimize against daily. "Emails captured" includes low-savings users who won't convert.

Qualified leads (high-savings + email) is the metric that directly predicts Credex revenue, is measurable in real time, and is sensitive enough to react to product changes within days. DAU or total visits would be wrong here this is a tool people use once or twice, not daily. Optimizing for engagement would send us in the wrong direction.

**Target at week 4 post-launch: 50 qualified leads/week.**

---

## 3 Input Metrics That Drive the North Star

### 1. Audit Completion Rate
*Visitors who land on the page → complete a full audit (all tools entered, results shown)*

**Target: ≥ 15%**

This is the primary friction metric. If it's low, the form is too long, too confusing, or the perceived payoff isn't clear enough. Levers: reduce fields, add inline value hints ("most teams find savings here"), improve the loading/results animation to feel instant.

### 2. High-Savings Rate
*Completed audits that surface ≥ $200/month in savings*

**Target: ≥ 35%**

This is a function of pricing data accuracy and audit engine quality. If it drops, either our pricing data is stale (vendors updated plans) or we're auditing users who are already optimized. Segment by use case and team size to diagnose. If indie hackers dominate traffic but enterprise is where savings are, we need to adjust distribution targeting.

### 3. Email Capture Rate (of High-Savings Audits)
*Users who see a high-savings result → submit their email to save/share the report*

**Target: ≥ 40%**

This is the conversion metric between "saw value" and "became a lead." Levers: timing of the email gate (show results first, ask after), copy on the capture screen, the quality of what they get in their inbox (the transactional email must feel worth it).

---

## What We'd Instrument First

In priority order:

1. **Funnel drop-off by step** — which form field causes the most abandonment (use field-level blur/focus events, not just page-level). If "monthly spend" causes drop-off, we have a trust problem. If "team size" causes drop-off, it's friction.

2. **Savings distribution histogram** — what percentage of audits land in each savings bucket ($0, $1–99, $100–499, $500+). This tells us if our audit engine is calibrated correctly and whether our traffic is the right audience.

3. **Share URL click-through rate** — are people actually sharing their audit URLs? This is the viral coefficient. Even a 5% share rate with 10% of shared URLs converting to a new audit completion gives meaningful compounding.

4. **Email-to-consultation conversion** — tracked via UTM on the calendar link in the transactional email. This closes the loop between lead and Credex revenue.

We would instrument these with a lightweight setup: PostHog (self-hostable, free tier) for product analytics, plus manual weekly review of the qualified leads spreadsheet for the first 30 days. No need for a complex BI stack until we're past 1,000 audits.

---

## What Number Triggers a Pivot Decision

**If audit completion rate stays below 8% after 2 weeks and 1,000+ visitors:** the core value proposition isn't landing on the page. Pivot the entry point — consider a simpler "quick scan" (just 2 tools, instant result) as the hook, with the full audit as the upsell.

**If high-savings rate drops below 15%:** pricing data is stale or audience fit is wrong. Freeze distribution, audit the pricing data against vendor pages, re-segment the traffic source. Don't pour more visitors into a broken engine.

**If qualified leads/week plateaus below 10 after month 2:** the distribution channels have tapped out. This triggers a channel experiment: try one new channel (a specific Slack community, a cold email sequence to EMs at Series A companies, a Product Hunt relaunch with a new angle) with a 2-week test window before concluding.

**The metric we explicitly will not optimize for:** time-on-site. A good audit should take 3 minutes. If someone spends 15 minutes, that's probably confusion, not delight.