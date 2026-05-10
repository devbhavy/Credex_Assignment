import {OpenRouter} from "@openrouter/sdk"
import dotenv from "dotenv"
// import type { AuditResult } from "./auditEngine.js";
import type { AuditResult } from "../lib/auditEngine.js";
dotenv.config();

const client = new OpenRouter({
    apiKey : `${process.env.OPENROUTER_API_KEY}`

})



async function generateAiSummary(input:AuditResult):Promise<string>{

    const completion = await client.chat.send({
        chatRequest : {
            model : "openai/gpt-oss-120b:free",
            messages: [
            {
                role: 'system',
                content: 'provided all info generate a 100 words personalined summary paragraph based on the audit.If the reason states that pricing data is not available suggest manual review for that tool',
            },
            {
                role : 'user',
                content : `data : ${JSON.stringify(input)}`
            }
            ]
        }
    });

    return completion.choices[0]?.message.content;
}



export {client,generateAiSummary}


