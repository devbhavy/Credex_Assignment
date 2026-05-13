# ECONOMICS.md — Unit Economics for Credex AI Spend Audit Tool

## What Is a Converted Lead Worth to Credex?

Credex sells discounted AI infrastructure credits. Based on publicly known pricing for tools like Cursor Business ($40/user/month), Claude Team ($30/user/month), and ChatGPT Enterprise (~$60/user/month), a mid-sized engineering team of 20 spending $8,000/month on AI tools is a plausible customer.

Credex's value proposition is a discount — let's conservatively estimate 20–30% off retail. If a customer spends $8,000/month at retail, they might spend $6,000/month through Credex, meaning Credex intermediates ~$72,000/year per customer.

If Credex's margin on credits is 8–12% (a reasonable estimate for a reseller/arbitrage model), that's **$5,760–$8,640 gross profit per customer per year.**

For a high-savings audit (>$500/mo identified), the average customer likely has a larger footprint. I'll use **$7,000/year LTV** as the working estimate for a converted enterprise-adjacent customer, and **$1,200/year** for a small team or indie hacker customer.

**Blended LTV estimate: ~$4,000** (weighted toward the smaller customer being more common at top of funnel).

---

## Customer Acquisition Cost (CAC) by Channel

| Channel | Estimated CAC | Notes |
|---|---|---|
| Hacker News Show HN post | ~$0 direct / $200 time cost | One post, organic — if it hits front page, 2,000–8,000 visitors |
| X/Twitter thread by founder | ~$0 direct / $150 time cost | Credex already in AI space, has relevant network |
| Reddit (r/ExperiencedDevs, r/startups) | ~$0 direct / $100 time cost | Genuinely useful tool posts perform well; no paid |
| Indie Hackers feature/post | ~$0 | High-intent audience, strong fit |
| Cold email to EMs at Series A cos | ~$50–80/lead (tools + time) | Lower conversion, higher volume |
| Paid search ("AI tool cost comparison") | ~$150–300/lead | CPC for B2B SaaS tooling terms is high |

For the organic channels, the real cost is founder/team time. At $0 paid budget, CAC is effectively the opportunity cost of ~2 hours per channel activation. At scale, if 1 in 40 audit completions converts to a Credex consultation, and 1 in 4 consultations converts to a purchase:

- **Audit → Consultation conversion: 2.5%**
- **Consultation → Purchase conversion: 25%**
- **Overall audit → purchase: ~0.625%**

To acquire 1 customer organically: need ~160 completed audits. If a HN front page drives 5,000 visitors → 15% complete audit → 750 completions → ~4–5 customers. At $4,000 LTV, that's **$16,000–$20,000 revenue from one organic push**, with near-zero CAC. Payback is immediate.

Blended CAC across channels (early stage, mostly organic): **~$200–400 per converted customer.**

**LTV:CAC ratio: ~10:1 to 20:1** — strong for a B2B SaaS lead-gen tool at this stage.

---

## Conversion Funnel That Makes This Profitable

```
Landing page visit
    → Audit started         (target: 30% of visitors)
    → Audit completed       (target: 50% of started = 15% of visitors)
    → Email captured        (target: 40% of completed = 6% of visitors)
    → High-savings flagged  (target: 30% of captured leads)
    → Consultation booked   (target: 25% of high-savings = ~0.45% of visitors)
    → Credit purchase        (target: 25% of consultations)
```

For this to be profitable at the unit level, we need:

- Average order value ≥ $500 (one month of credits)
- Consultation-to-close ≥ 20%
- CAC ≤ $500

All three are achievable with the organic channels above. The tool is profitable from the **first converted customer** given ~$0 direct spend on distribution.

---

## What Would Have to Be True to Drive $1M ARR in 18 Months

$1M ARR = ~$83,333/month in recurring credit GMR at ~10% margin, or more realistically, **250 active customers averaging $4,000/year LTV.**

To get 250 customers in 18 months:

**Month 1–3:** Launch on HN, Product Hunt, Indie Hackers. Target 10,000 total audit completions. At 0.625% conversion → ~62 customers. Revenue: ~$248K ARR.

**Month 4–9:** Double down on what worked. Add one paid channel (retargeting visitors who completed audits but didn't book). Target 30,000 cumulative completions → additional 125 customers. Revenue: ~$748K ARR.

**Month 10–18:** SEO compounds (comparison pages rank). Add referral loop (share your audit, get a discount code). Target 64 more customers. Revenue: **$1.0M ARR.**

**Key assumptions that must hold:**
1. Audit completion rate ≥ 15% of visitors (tool must be fast and feel valuable)
2. At least 30% of completed audits show ≥ $200/mo savings (pricing data must stay current)
3. Credex can actually deliver the credits at the promised discount (supply-side must not be the bottleneck)
4. Retention: customers re-purchase credits quarterly — LTV is multi-transaction, not one-shot

**The biggest risk:** if pricing data goes stale (vendors update plans), the audit becomes untrustworthy and word-of-mouth turns negative. The tool needs a lightweight quarterly pricing refresh process baked in from day one.

---

## Summary Table

| Metric | Estimate |
|---|---|
| Blended LTV | $4,000/customer/year |
| Blended CAC (early, organic) | $200–400 |
| LTV:CAC | ~10–20x |
| Audit → purchase conversion | ~0.625% |
| Break-even customers needed | 1 (near-zero fixed cost) |
| Customers needed for $1M ARR | ~250 |
| Time to $1M ARR (if funnel holds) | 15–18 months |