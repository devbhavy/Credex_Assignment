# Prompts — CredLens

## AI Summary Generation

### Where It's Used
`backend/src/services/openrouter.ts` — called once per audit after the rule-based engine runs. The output is stored in the `summary` column of the audits table and displayed at the top of the results page.

### Model
`openai/gpt-oss-120b:free` via OpenRouter

### System Prompt
```
provided all info generate a 100 words personalized summary paragraph based on the audit. If the reason states that pricing data is not available suggest manual review for that tool. Avoid using em dashes and ** to bold the text just give simple plain text as response.
```

### User Prompt
```
data : {stringified AuditResult JSON}
```

The full AuditResult object is passed including recommendations,
redundancies, totalMonthlySaving, totalAnnualSaving, and isAlreadyOptimal.

### Why I Wrote It This Way

**"100 words"** — without a word limit the model rambles. 100 words is enough for a meaningful paragraph that fits cleanly on the results page without dominating it.

**"personalized summary paragraph"** — early versions returned bullet points which duplicated what the recommendations section already showed. Specifying "paragraph" forces prose that adds context rather than repeating data.

**"If pricing data is not available suggest manual review"** — the audit engine returns a specific reason string for unknown tools. Without this instruction the model would either ignore those tools or hallucinate pricing data.

**"Avoid em dashes and bold"** — the results page renders plain text.Markdown formatting was leaking into the output and appearing as raw symbols in the UI.

### What I Tried That Didn't Work

- Asking for bullet points — duplicated the recommendations UI
- Not specifying word count — responses were 40 words or 300 words
  with no consistency
- Passing only totalMonthlySaving without full context — summary was
  too generic, no mention of specific tools or reasons

### Failure Handling

If the OpenRouter API call fails for any reason (rate limit, network error, model unavailable), the function catches the error and returns a templated fallback summary generated from the audit data directly.The audit is still saved and returned to the user the summary field shows the fallback text instead. No audit is lost due to an AI failure.