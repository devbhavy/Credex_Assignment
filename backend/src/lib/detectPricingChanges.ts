


export function detectPricingChanges(
    oldPricing: Record<string, Record<string, number>>,
    newPricing: Record<string, Record<string, number>>
  ): { tool: string; plan: string; oldPrice: number; newPrice: number }[] {



    const changes: { tool: string; plan: string; oldPrice: number; newPrice: number }[] = [];
  
    for (const tool of Object.keys(newPricing)) {
      const oldToolPricing = oldPricing[tool] ?? {};
      const newToolPricing = newPricing[tool];
  
      for (const plan of Object.keys(newToolPricing!)) {
        const oldPrice = oldToolPricing[plan];
        const newPrice = newToolPricing![plan]!;
  
        
        if (oldPrice === undefined || oldPrice !== newPrice) {
          changes.push({ tool, plan, oldPrice: oldPrice ?? -1, newPrice });
        }
      }
  
      for (const plan of Object.keys(oldToolPricing)) {
        if (newToolPricing![plan] === undefined) {
          changes.push({ tool, plan, oldPrice: oldToolPricing[plan]!, newPrice: -1 });
        }
      }
    }
  
    return changes;
}
  


// const oldPricing = {
//     cursor: {
//       hobby: 0,
//       pro: 20,
//       pro_plus: 60,
//       ultra: 200,
//       teams: 40,
//     },
//     github_copilot: {
//       free: 0,
//       pro: 10,
//       pro_plus: 39,
//       business: 19,
//     },
//     claude: {
//       free: 0,
//       pro: 20,
//       max_5x: 100,
//       max_20x: 200,
//       team_standard: 25,
//       team_premium: 100,
//     },
//     chatgpt: {
//       free: 0,
//       plus: 20,
//       team: 25,
//     },
//     anthropic_api: {
//       pay_as_you_go: 0,
//     },
//     openai_api: {
//       pay_as_you_go: 0,
//     },
//     gemini: {
//       free: 0,
//       pro: 19.99,
//     },
//     v0: {
//       free: 0,
//       premium: 20,
//       team: 30,
//       business: 100,
//     },
// };


// const newPricing = {
//     cursor: {
//       hobby: 0,
//       pro: 20,
//       pro_plus: 60,
//       ultra: 200,
//       teams: 40,
//     },
//     github_copilot: {
//       free: 0,
//       pro: 10,
//       pro_plus: 39,
//       business: 19,
//     },
//     claude: {
//       free: 0,
//       pro: 20,
//       max_5x: 100,
//       max_20x: 200,
//       team_standard: 25,
//       team_premium: 100,
//     },
//     chatgpt: {
//       free: 0,
//       plus: 20,
//       team: 25,
//     },
//     anthropic_api: {
//       pay_as_you_go: 0,
//     },
//     openai_api: {
//       pay_as_you_go: 0,
//     },
//     gemini: {
//       free: 0,
//       pro: 19.99,
//     },
//     v0: {
//       free: 10,
//       premium: 15,
//       team: 30,
//       business: 100,
//     },
// };


//console.log(detectPricingChanges(oldPricing,newPricing));