export type UseCase = "coding" | "writing" | "research" | "data" | "mixed";

export interface ToolInput {
  tool: string;
  plan: string;
  seats: number;
  monthlySpend: number;
}

export interface AuditInput {
  tools: ToolInput[];
  teamSize: number;
  useCase: UseCase;
}

export interface ToolRecommendation {
  tool: string;
  currentPlan: string;
  currentSpend: number;
  recommendedPlan: string;
  recommendedTool: string;
  recommendedSpend: number;
  monthlySaving: number;
  reason: string;
  isOptimal: boolean;
  checkType: "plan_downsize" | "capability_warning" | "api_to_flat" | "optimal" | "unknown_tool" | "enterprise";
}

export interface RedundancyWarning {
  tools: string[];
  category: string;
  suggestion: string;
  potentialSaving: number;
}

export interface AuditResult {
  recommendations: ToolRecommendation[];
  redundancies: RedundancyWarning[];
  totalMonthlySaving: number;
  totalAnnualSaving: number;
  isAlreadyOptimal: boolean;
}

const PRICING: Record<string, Record<string, number>> = {
  cursor: {
    hobby: 0,
    pro: 20,
    pro_plus: 60,
    ultra: 200,
    teams: 40,
  },
  github_copilot: {
    free: 0,
    pro: 10,
    pro_plus: 39,
    business: 19,
  },
  claude: {
    free: 0,
    pro: 20,
    max_5x: 100,
    max_20x: 200,
    team_standard: 25,
    team_premium: 100,
  },
  chatgpt: {
    free: 0,
    plus: 20,
    team: 25,
  },
  anthropic_api: {
    pay_as_you_go: 0,
  },
  openai_api: {
    pay_as_you_go: 0,
  },
  gemini: {
    free: 0,
    pro: 19.99,
  },
  v0: {
    free: 0,
    premium: 20,
    team: 30,
    business: 100,
  },
};



const MAX_CAPABILITY_DROP = 1;

const CAPABILITY: Record<string, Record<string, number>> = {
  cursor: {
    hobby: 6,
    pro: 9,
    pro_plus: 10,
    ultra: 10,
    teams: 9,
  },
  github_copilot: {
    free: 6,
    pro: 8,
    pro_plus: 9,
    business: 9,
  },
  claude: {
    free: 7,
    pro: 9,
    max_5x: 10,
    max_20x: 10,
    team_standard: 9,
    team_premium: 10,
  },
  chatgpt: {
    free: 6,
    plus: 9,
    team: 9,
  },
  gemini: {
    free: 7,
    pro: 9,
  },
  v0: {
    free: 7,
    premium: 8,
    team: 8,
    business: 9,
  },
};


const PLAN_SEAT_RULES: Record<string, { plan: string; maxSeatsBeforeOverkill: number }[]> = {
  cursor: [
    { plan: "pro", maxSeatsBeforeOverkill: 4 },
    { plan: "teams", maxSeatsBeforeOverkill: 999 },
    { plan: "pro_plus", maxSeatsBeforeOverkill: 2 },
    { plan: "ultra", maxSeatsBeforeOverkill: 1 },
  ],
  github_copilot: [
    { plan: "pro", maxSeatsBeforeOverkill: 4 },
    { plan: "business", maxSeatsBeforeOverkill: 999 },
    { plan: "pro_plus", maxSeatsBeforeOverkill: 2 },
  ],
  claude: [
    { plan: "pro", maxSeatsBeforeOverkill: 4 },
    { plan: "team_standard", maxSeatsBeforeOverkill: 999 },
    { plan: "max_5x", maxSeatsBeforeOverkill: 2 },
    { plan: "max_20x", maxSeatsBeforeOverkill: 1 },
  ],
  chatgpt: [
    { plan: "plus", maxSeatsBeforeOverkill: 4 },
    { plan: "team", maxSeatsBeforeOverkill: 999 },
  ],
};



const REDUNDANCY_GROUPS: { category: string; tools: string[] }[] = [
  {
    category: "AI Coding Assistant",
    tools: ["cursor", "github_copilot", "v0"],
  },
  {
    category: "AI Chat / Writing Assistant",
    tools: ["claude", "chatgpt", "gemini"],
  },
  {
    category: "Anthropic ecosystem (API + subscription)",
    tools: ["anthropic_api", "claude"],
  },
  {
    category: "OpenAI ecosystem (API + subscription)",
    tools: ["openai_api", "chatgpt"],
  },
];



const SKIP_PLANS = new Set(["enterprise", "custom"]);
const FREE_PLANS = new Set(["hobby", "free", "pay_as_you_go"]);



function getCapability(tool: string, plan: string): number | null {
  return CAPABILITY[tool]?.[plan] ?? null;
}

function getCapabilityDrop(tool: string, fromPlan: string, toPlan: string): number {
  const from = getCapability(tool, fromPlan);
  const to = getCapability(tool, toPlan);
  if (from === null || to === null) return 0;
  return from - to;
}

function findBestDowngrade(
  tool: string,
  currentPlan: string,
  seats: number,
  monthlySpend: number
): { plan: string; pricePerSeat: number; capabilityDrop: number } | null {
  const plans = PRICING[tool];
  if (!plans) return null;

  const currentPrice = plans[currentPlan];
  if (currentPrice === undefined) return null;

  const isPaying = monthlySpend > 0;
  const rules = PLAN_SEAT_RULES[tool] ?? [];

  let best: { plan: string; pricePerSeat: number; capabilityDrop: number } | null = null;

  for (const [plan, price] of Object.entries(plans)) {
    if (plan === currentPlan) continue;
    if (SKIP_PLANS.has(plan)) continue;


    if (isPaying && FREE_PLANS.has(plan)) continue;

    if (seats > 1 && price === 0) continue;

  
    if (price >= currentPrice) continue;

    const rule = rules.find((r) => r.plan === plan);
    if (rule && seats > rule.maxSeatsBeforeOverkill) continue;

    const capabilityDrop = getCapabilityDrop(tool, currentPlan, plan);

    if (!best || price < best.pricePerSeat) {
      best = { plan, pricePerSeat: price, capabilityDrop };
    }
  }

  return best;
}


function checkPlanDownsize(input: ToolInput): ToolRecommendation | null {
  const { tool, plan, seats, monthlySpend } = input;

  const plans = PRICING[tool];
  if (!plans) return null;
  if (SKIP_PLANS.has(plan)) return null;

  const planPrice = plans[plan] ?? monthlySpend / Math.max(seats, 1);
  const calculatedSpend = planPrice * seats;

  const best = findBestDowngrade(tool, plan, seats, monthlySpend);
  if (!best) return null;

  const newSpend = best.pricePerSeat * seats;
  const saving = calculatedSpend - newSpend;
  if (saving <= 0) return null;

  const currentScore = getCapability(tool, plan);
  const recommendedScore = getCapability(tool, best.plan);
  const capabilityNote =
    currentScore !== null && recommendedScore !== null
      ? ` Capability: ${currentScore}/10 → ${recommendedScore}/10 (drop of ${best.capabilityDrop} point${best.capabilityDrop !== 1 ? "s" : ""}).`
      : "";

 
  if (best.capabilityDrop > MAX_CAPABILITY_DROP) {
    return {
      tool,
      currentPlan: plan,
      currentSpend: monthlySpend,
      recommendedPlan: best.plan,
      recommendedTool: tool,
      recommendedSpend: newSpend,
      monthlySaving: saving,
      reason: `${tool} ${best.plan} ($${best.pricePerSeat}/seat) would save $${saving}/mo vs ${plan} ($${planPrice}/seat), but involves a ${best.capabilityDrop}-point capability drop (${currentScore}/10 → ${recommendedScore}/10).${capabilityNote} Only switch if your team doesn't rely on the higher-tier features.`,
      isOptimal: false,
      checkType: "capability_warning",
    };
  }

 
  return {
    tool,
    currentPlan: plan,
    currentSpend: monthlySpend,
    recommendedPlan: best.plan,
    recommendedTool: tool,
    recommendedSpend: newSpend,
    monthlySaving: saving,
    reason: `${seats} seat(s) on ${plan} ($${planPrice}/seat) = $${calculatedSpend}/mo. Downgrade to ${best.plan} ($${best.pricePerSeat}/seat) = $${newSpend}/mo.${capabilityNote} Same vendor, minimal capability difference — saves $${saving}/mo ($${saving * 12}/yr).`,
    isOptimal: false,
    checkType: "plan_downsize",
  };
}


function checkApiToFlat(input: ToolInput): ToolRecommendation | null {
  const { tool, plan, seats, monthlySpend } = input;

  if (tool !== "anthropic_api" && tool !== "openai_api") return null;

  const suggestTool = tool === "anthropic_api" ? "claude" : "chatgpt";

  if (monthlySpend >= 100) {
    const flatPlan = suggestTool === "claude" ? "max_5x" : "team";
    const flatPrice = PRICING[suggestTool]?.[flatPlan] ?? 100;
    const flatSpend = flatPrice * seats;
    const saving = monthlySpend - flatSpend;
    if (saving > 0) {
      return {
        tool,
        currentPlan: plan,
        currentSpend: monthlySpend,
        recommendedTool: suggestTool,
        recommendedPlan: flatPlan,
        recommendedSpend: flatSpend,
        monthlySaving: saving,
        reason: `Your ${tool} spend is $${monthlySpend}/mo. A flat ${suggestTool} ${flatPlan} plan costs $${flatSpend}/mo for ${seats} seat(s) — same vendor, predictable billing, saves $${saving}/mo ($${saving * 12}/yr).`,
        isOptimal: false,
        checkType: "api_to_flat",
      };
    }
  }

  if (monthlySpend >= 20) {
    const flatPlan = suggestTool === "claude" ? "pro" : "plus";
    const flatPrice = PRICING[suggestTool]?.[flatPlan] ?? 20;
    const flatSpend = flatPrice * seats;
    const saving = monthlySpend - flatSpend;
    if (saving > 0) {
      return {
        tool,
        currentPlan: plan,
        currentSpend: monthlySpend,
        recommendedTool: suggestTool,
        recommendedPlan: flatPlan,
        recommendedSpend: flatSpend,
        monthlySaving: saving,
        reason: `Your ${tool} spend is $${monthlySpend}/mo. A flat ${suggestTool} ${flatPlan} plan costs $${flatSpend}/mo for ${seats} seat(s) — same vendor, predictable billing, saves $${saving}/mo ($${saving * 12}/yr).`,
        isOptimal: false,
        checkType: "api_to_flat",
      };
    }
  }

  return null;
}


function getPrimaryScore(input: ToolInput): number {
  const capScore = getCapability(input.tool, input.plan) ?? 5;
  const spendPerSeat = input.monthlySpend / Math.max(input.seats, 1);

  return (
    input.seats * 2 +       
    spendPerSeat * 0.5 +    
    capScore                 
  );
}

function checkRedundancies(inputs: ToolInput[]): RedundancyWarning[] {
  const warnings: RedundancyWarning[] = [];
  const toolNames = inputs.map((t) => t.tool);

  for (const group of REDUNDANCY_GROUPS) {
    const overlap = group.tools.filter((t) => toolNames.includes(t));
    if (overlap.length < 2) continue;

    const overlapInputs = inputs.filter((i) => overlap.includes(i.tool));

    const scored = overlapInputs
      .map((i) => ({ input: i, score: getPrimaryScore(i) }))
      .sort((a, b) => b.score - a.score);

    const keepTool = scored[0]!.input;
    const dropTools = scored.slice(1).map((s) => s.input);
    const potentialSaving = dropTools.reduce((sum, t) => sum + t.monthlySpend, 0);

    const keepSpendPerSeat = keepTool.monthlySpend / Math.max(keepTool.seats, 1);
    const keepCap = getCapability(keepTool.tool, keepTool.plan);
    const keepReason = [
      keepTool.seats + " seat(s)",
      "$" + keepSpendPerSeat.toFixed(0) + "/seat",
      keepCap !== null ? "capability " + keepCap + "/10" : null,
    ]
      .filter(Boolean)
      .join(", ");

    warnings.push({
      tools: overlap,
      category: group.category,
      suggestion: "You are paying for " + overlap.join(" and ") + " -- both serve as " + group.category + ". Based on usage signals (" + keepReason + "), " + keepTool.tool + " appears to be your primary tool. Consider dropping " + dropTools.map((t) => t.tool).join(", ") + " to save $" + potentialSaving + "/mo ($" + (potentialSaving * 12) + "/yr).",
      potentialSaving,
    });
  }

  return warnings;
}

function auditSingleTool(input: ToolInput): ToolRecommendation {
  const { tool, plan, seats, monthlySpend } = input;

  if (!PRICING[tool]) {
    return {
      tool,
      currentPlan: plan,
      currentSpend: monthlySpend,
      recommendedPlan: plan,
      recommendedTool: tool,
      recommendedSpend: monthlySpend,
      monthlySaving: 0,
      reason: "No pricing data available for this tool — review manually.",
      isOptimal: true,
      checkType: "unknown_tool",
    };
  }

  if (SKIP_PLANS.has(plan)) {
    return {
      tool,
      currentPlan: plan,
      currentSpend: monthlySpend,
      recommendedPlan: plan,
      recommendedTool: tool,
      recommendedSpend: monthlySpend,
      monthlySaving: 0,
      reason: "Enterprise plan with custom pricing — negotiate directly with your vendor or benchmark against alternatives manually.",
      isOptimal: true,
      checkType: "enterprise",
    };
  }

  const apiCheck = checkApiToFlat(input);
  if (apiCheck) return apiCheck;

  const downsizeCheck = checkPlanDownsize(input);
  if (downsizeCheck) return downsizeCheck;

  const planPrice = PRICING[tool]?.[plan] ?? monthlySpend / Math.max(seats, 1);
  const capScore = getCapability(tool, plan);
  return {
    tool,
    currentPlan: plan,
    currentSpend: monthlySpend,
    recommendedPlan: plan,
    recommendedTool: tool,
    recommendedSpend: planPrice * seats,
    monthlySaving: 0,
    reason: `${tool} ${plan} is right-sized for ${seats} seat(s).${capScore !== null ? ` Capability score: ${capScore}/10.` : ""} No cheaper plan on the same tool fits without a significant capability drop.`,
    isOptimal: true,
    checkType: "optimal",
  };
}

export function runAudit(input: AuditInput): AuditResult {
  const recommendations = input.tools.map((t) => auditSingleTool(t));
  const redundancies = checkRedundancies(input.tools);

  const totalMonthlySaving = recommendations.reduce((sum, r) => sum + r.monthlySaving, 0);
  const totalAnnualSaving = totalMonthlySaving * 12;
  const isAlreadyOptimal =
    recommendations.every((r) => r.isOptimal) && redundancies.length === 0;

  return {
    recommendations,
    redundancies,
    totalMonthlySaving,
    totalAnnualSaving,
    isAlreadyOptimal,
  };
}

// const input: AuditInput = {
//     tools: [
//       { tool: "anthropic_api", plan: "pay_as_you_go", seats: 2, monthlySpend: 180 }
//     ],
//     teamSize: 2,
//     useCase: "research"
//   }


// console.log(runAudit(input))