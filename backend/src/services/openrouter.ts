import {OpenRouter} from "@openrouter/sdk"
import dotenv from "dotenv"
import type { AuditResult } from "../lib/auditEngine.js";
dotenv.config();

const client = new OpenRouter({
    apiKey : `${process.env.OPENROUTER_API_KEY}`

})



async function generateAiSummary(input: AuditResult): Promise<string> {
    try {
      const completion = await client.chat.send({
        chatRequest: {
          model: "openai/gpt-oss-120b:free",
          messages: [
            {
              role: "system",
              content: "provided all info generate a 100 words personalized summary paragraph based on the audit. If the reason states that pricing data is not available suggest manual review for that tool. Avoid using '-' dashes and ** to bold the text just give simple plain text as response.",
            },
            {
              role: "user",
              content: `data : ${JSON.stringify(input)}`,
            },
          ],
        },
      });
  
      return completion.choices[0]?.message.content ?? generateFallbackSummary(input);
  
    } catch (err) {
      console.error("OpenRouter failed:", err);
      return generateFallbackSummary(input);
    }
  }
  
  
  function generateFallbackSummary(input: AuditResult): string {
    if (input.isAlreadyOptimal) {
      return `Your AI stack looks well-optimised. Across all tools reviewed, no significant savings opportunities were found. Your plans are appropriately sized for your team and use case. Continue monitoring your usage as your team grows, as plan requirements may change over time.`;
    }
  
    const saving = input.totalMonthlySaving;
    const annual = input.totalAnnualSaving;
    const count = input.recommendations.filter(r => !r.isOptimal).length;
    const redundancies = input.redundancies.length;
  
    return `Your audit found $${saving}/mo ($${annual}/yr) in potential savings across ${count} tool${count !== 1 ? "s" : ""}${redundancies > 0 ? ` and ${redundancies} redundant tool overlap${redundancies !== 1 ? "s" : ""}` : ""}. Review the recommendations above and consider acting on the highest-saving items first. For any tools marked as unavailable, a manual pricing review is recommended.`;
}


export {client,generateAiSummary}


