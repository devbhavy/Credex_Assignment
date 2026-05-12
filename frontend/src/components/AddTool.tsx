import { useState } from "react";

const TOOL_PLANS: Record<string, { label: string; value: string }[]> = {
  cursor: [
    { label: "Hobby (Free)", value: "hobby" },
    { label: "Pro ($20/seat)", value: "pro" },
    { label: "Pro+ ($60/seat)", value: "pro_plus" },
    { label: "Ultra ($200/seat)", value: "ultra" },
    { label: "Teams ($40/seat)", value: "teams" },
    { label: "Enterprise (Custom)", value: "enterprise" },
  ],
  github_copilot: [
    { label: "Free", value: "free" },
    { label: "Pro ($10/seat)", value: "pro" },
    { label: "Pro+ ($39/seat)", value: "pro_plus" },
    { label: "Business ($19/seat)", value: "business" },
    { label: "Enterprise ($39/seat)", value: "enterprise" },
  ],
  claude: [
    { label: "Free", value: "free" },
    { label: "Pro ($20/seat)", value: "pro" },
    { label: "Max 5x ($100/seat)", value: "max_5x" },
    { label: "Max 20x ($200/seat)", value: "max_20x" },
    { label: "Team Standard ($25/seat)", value: "team_standard" },
    { label: "Team Premium ($100/seat)", value: "team_premium" },
    { label: "Enterprise (Custom)", value: "enterprise" },
  ],
  chatgpt: [
    { label: "Free", value: "free" },
    { label: "Plus ($20/seat)", value: "plus" },
    { label: "Team ($25/seat)", value: "team" },
    { label: "Enterprise (Custom)", value: "enterprise" },
  ],
  anthropic_api: [
    { label: "Pay as you go", value: "pay_as_you_go" },
  ],
  openai_api: [
    { label: "Pay as you go", value: "pay_as_you_go" },
  ],
  gemini: [
    { label: "Free", value: "free" },
    { label: "Pro ($19.99/seat)", value: "pro" },
    { label: "Ultra (Custom)", value: "ultra" },
  ],
  v0: [
    { label: "Free", value: "free" },
    { label: "Premium ($20/seat)", value: "premium" },
    { label: "Team ($30/seat)", value: "team" },
    { label: "Business ($100/seat)", value: "business" },
    { label: "Enterprise (Custom)", value: "enterprise" },
  ],
  windsurf: [
    { label: "Free", value: "free" },
    { label: "Pro ($15/seat)", value: "pro" },
    { label: "Teams ($35/seat)", value: "teams" },
  ],
};

// fixed price per seat — used to auto-calculate monthly spend
const PLAN_PRICING: Record<string, Record<string, number>> = {
  cursor:         { hobby: 0, pro: 20, pro_plus: 60, ultra: 200, teams: 40 },
  github_copilot: { free: 0, pro: 10, pro_plus: 39, business: 19, enterprise: 39 },
  claude:         { free: 0, pro: 20, max_5x: 100, max_20x: 200, team_standard: 25, team_premium: 100 },
  chatgpt:        { free: 0, plus: 20, team: 25 },
  anthropic_api:  { pay_as_you_go: 0 },
  openai_api:     { pay_as_you_go: 0 },
  gemini:         { free: 0, pro: 19.99 },
  v0:             { free: 0, premium: 20, team: 30, business: 100 },
  windsurf:       { free: 0, pro: 15, teams: 35 },
};

const TOOL_LABELS: Record<string, string> = {
  cursor: "Cursor",
  github_copilot: "GitHub Copilot",
  claude: "Claude",
  chatgpt: "ChatGPT",
  anthropic_api: "Anthropic API",
  openai_api: "OpenAI API",
  gemini: "Gemini",
  v0: "v0",
  windsurf: "Windsurf",
};

// these tools have no fixed price — user must enter spend manually
const API_TOOLS = new Set(["anthropic_api", "openai_api"]);

export interface ToolEntry {
  tool: string;
  plan: string;
  seats: number;
  monthlySpend: number;
  usageFrequency: "never" | "sometimes" | "frequently";
}

interface AddToolProps {
  setVisibility: (v: boolean) => void;
  onAdd: (entry: ToolEntry) => void;
}

export function AddTool({ setVisibility, onAdd }: AddToolProps) {
  const [selectedTool, setSelectedTool] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("");
  const [seats, setSeats] = useState(1);
  const [apiSpend, setApiSpend] = useState(0); // only for API tools
  const [usageFrequency, setUsageFrequency] = useState<"never" | "sometimes" | "frequently">("never");
  const [error, setError] = useState("");

  const plans = selectedTool ? TOOL_PLANS[selectedTool] ?? [] : [];
  const isApiTool = API_TOOLS.has(selectedTool);

  // auto-calculate for fixed-price tools
  const pricePerSeat = selectedTool && selectedPlan
    ? PLAN_PRICING[selectedTool]?.[selectedPlan] ?? 0
    : 0;
  const calculatedSpend = isApiTool ? apiSpend : pricePerSeat * seats;

  const handleToolChange = (tool: string) => {
    setSelectedTool(tool);
    setSelectedPlan("");
    setApiSpend(0);
    setError("");
  };

  const handleAdd = () => {
    if (!selectedTool) return setError("Please select a tool.");
    if (!selectedPlan) return setError("Please select a plan.");
    if (seats < 1) return setError("Seats must be at least 1.");
    if (isApiTool && apiSpend < 0) return setError("Spend cannot be negative.");

    onAdd({
      tool: selectedTool,
      plan: selectedPlan,
      seats,
      monthlySpend: calculatedSpend,
      usageFrequency,
    });
    setVisibility(false);
  };

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-overlay backdrop-blur-sm">
      <div className="flex w-full max-w-md flex-col gap-4 rounded-2xl border border-border bg-surface-raised p-6 shadow-xl">

        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-ink">Add AI tool</h2>
          <button
            type="button"
            onClick={() => setVisibility(false)}
            className="rounded-full border border-border px-2.5 py-1 text-lg leading-none text-muted transition-colors hover:bg-canvas hover:text-ink"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Tool Select */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-ink">Tool</label>
          <select
            value={selectedTool}
            onChange={(e) => handleToolChange(e.target.value)}
            className="rounded-xl border border-border bg-canvas px-3 py-2.5 text-sm text-ink focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
          >
            <option value="">Select a tool...</option>
            {Object.entries(TOOL_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>

        {/* Plan Select */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-ink">Plan</label>
          <select
            value={selectedPlan}
            onChange={(e) => setSelectedPlan(e.target.value)}
            disabled={!selectedTool}
            className="rounded-xl border border-border bg-canvas px-3 py-2.5 text-sm text-ink focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 disabled:cursor-not-allowed disabled:opacity-45"
          >
            <option value="">
              {selectedTool ? "Select a plan..." : "Select a tool first"}
            </option>
            {plans.map((p) => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>
        </div>

        {/* Seats */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-ink">Seats</label>
          <input
            type="number"
            min={1}
            value={seats}
            onChange={(e) => setSeats(Number(e.target.value))}
            className="rounded-xl border border-border bg-canvas px-3 py-2.5 text-sm text-ink focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
        </div>

        {isApiTool ? (

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-ink">
              Avg monthly spend ($)
            </label>
            <input
              type="number"
              min={0}
              value={apiSpend}
              onChange={(e) => setApiSpend(Number(e.target.value))}
              placeholder="Your average monthly API bill"
              className="rounded-xl border border-border bg-canvas px-3 py-2.5 text-sm text-ink placeholder:text-muted/70 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
            />
            <p className="text-xs text-muted">
              Pay-as-you-go pricing — enter your actual monthly bill
            </p>
          </div>
        ) : (
          // Fixed price tools — auto calculated, read only
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-ink">Monthly spend</label>
            <div className="flex items-center justify-between rounded-xl border border-border bg-accent-muted/50 px-3 py-2.5 text-sm text-ink">
              <span className="font-medium">${calculatedSpend.toFixed(2)}/mo</span>
              {selectedPlan && (
                <span className="text-xs text-muted">
                  ${pricePerSeat} × {seats} seat{seats > 1 ? "s" : ""}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Usage Frequency */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-ink">
            How often does your team hit usage limits?
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(["never", "sometimes", "frequently"] as const).map((f) => (
              <button
                type="button"
                key={f}
                onClick={() => setUsageFrequency(f)}
                className={`rounded-xl border py-2 text-sm font-medium capitalize transition-colors
                  ${usageFrequency === f
                    ? "border-accent bg-accent text-ink shadow-sm"
                    : "border-border bg-canvas text-muted hover:border-accent/60 hover:text-ink"
                  }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Error */}
        {error && <p className="text-sm text-rose-400">{error}</p>}

        {/* Actions */}
        <div className="flex gap-2 pt-1">
          <button
            type="button"
            onClick={handleAdd}
            className="flex-1 rounded-xl bg-accent py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-accent-hover"
          >
            Add tool
          </button>
          <button
            type="button"
            onClick={() => setVisibility(false)}
            className="flex-1 rounded-xl border border-border bg-canvas py-2.5 text-sm font-medium text-muted transition-colors hover:bg-blush/40 hover:text-ink"
          >
            Cancel
          </button>
        </div>

      </div>
    </div>
  );
}

export default AddTool;