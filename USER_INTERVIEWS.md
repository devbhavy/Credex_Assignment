# USER_INTERVIEWS.md — User Interview Notes

*Three interviews conducted over the course of the week with potential users in the target demographic. Interviews were 10–15 minutes each, conducted in Hindi/English (Hinglish) over chat/call.*

---

## Interview 1

**Name:** Utsav Gupta
**Role:** B.Tech Student + part-time freelance developer
**Company stage:** Pre-company — working on side projects, learning startup economics through programs like Credex

**Context:** Uses AI tools actively for learning and project work. Has exposure to how startups think about cloud and AI costs through coursework and reading.

**Direct Quotes:**

> "We often subscribe to tools because of the hype but later realize we're not fully using them."

> "Even in startups, companies can end up paying for multiple AI tools with overlapping features or unused cloud credits."

> "An automated platform can quickly spot unnecessary spending but I would still manually check important decisions before making changes."

**Most surprising thing they said:**
He trusted the audit tool concept immediately but only conditionally. The condition was transparency: *"if the platform shows where money is being wasted, which credits are unused, or how costs can be reduced."* He didn't want a black box recommending switches. He wanted to see the reasoning. This was more nuanced than expected from someone who isn't yet paying significant amounts himself.

**What it changed about the design:**
Reinforced the decision to show a one-sentence reason on every audit line item — not just the recommendation. The results page now explicitly surfaces *why* a tool is flagged, not just *what* to do. Also confirmed the "email gate after value shown" approach — he wouldn't have trusted the tool if it asked for details before showing anything.

---

## Interview 2

**Name:** Kaustubh Sharma
**Role:** B.Tech Student + Independent developer
**Company stage:** Solo, self-funded, building projects in AI and ML, paying for tools out of pocket

**Context:** Actively paying for API access and domain infrastructure. Spending roughly ₹1,200/month across tools including GitHub Copilot, Gemini, Google services, and API costs. Ignores monthly billing until something breaks or a charge surprises him.

**Direct Quotes:**

> "Paid around ₹1,200 for API plus domain, didn't really track it until I added it up."

> "Yeah, I ignore the monthly bill mostly."

> "Audit tool as it makes my life easier and I don't want to compare manually."

**Most surprising thing they said:**
He said he ignores the monthly bill but when asked to estimate what he spends, he knew the number (₹1,200) almost immediately. He wasn't unaware; he just hadn't acted on it. The problem isn't visibility, it's activation he knows roughly what he spends but has no trigger to do anything about it. An audit tool needs to create that trigger, not just show a number.

**What it changed about the design:**
The hero savings number on the results page needs to be large and immediate the tool has to manufacture the "oh wait, that much?" moment that converts passive awareness into action. Also flagged that the shareable URL feature matters for solo builders — he'd share it in a dev Discord before booking any consultation.

---

## Interview 3

**Name:** Aditya
**Role:** Student / hobbyist developer
**Company stage:**  Majorly working on personal projects based on Web developement

**Context:** Paying for Gemini Pro at roughly ₹800/year. Only one active paid subscription. Doesn't track monthly spend and hasn't felt like they're overpaying.

**Direct Quotes:**

> "Gemini Pro around ₹800 a year, that's it."

> "No, I don't feel like I'm overpaying."

> "No monthly bill to check it's annual."

**Most surprising thing they said:**
He said he doesn't get a monthly bill because he pays annually. This was a blind spot in the original form design: the spend input defaulted to monthly figures, but a meaningful number of users (especially students and hobbyists) pay annually and think in annual terms. Asking for "monthly spend" would cause them to either skip the field, divide wrong, or enter an annual number in a monthly field all of which break the audit math.

**What it changed about the design:**
Forced me to think to add a billing cadence toggle (monthly / annual) to the spend input form. When "annual" is selected, the field accepts an annual figure and the engine divides by 12 internally. This is a small change that significantly improves accuracy for a real segment of users.
