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
  checkType: string;
}

function formatLabel(id: string) {
  return id.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatToolName(name: string) {
  return name.replace(/_/g, " ");
}

export function RecommendationCard(props: ToolRecommendation) {
  const shell =
    props.isOptimal
      ? "rounded-xl border border-border bg-mint/35 px-5 py-4 shadow-sm"
      : "rounded-xl border border-border bg-blush/35 px-5 py-4 shadow-sm";

  return (
    <div className={shell}>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
            props.isOptimal
              ? "bg-mint/80 text-ink"
              : "bg-accent-muted text-ink"
          }`}
        >
          {props.isOptimal ? "Optimal" : "Action"}
        </span>
        <span className="text-xs font-medium uppercase tracking-wide text-muted">
          {formatLabel(props.checkType)}
        </span>
      </div>
      <dl className="grid gap-3 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-muted">Tool</dt>
          <dd className="mt-1 font-medium capitalize text-ink">{formatToolName(props.tool)}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-muted">Recommended tool</dt>
          <dd className="mt-1 font-medium capitalize text-ink">
            {formatToolName(props.recommendedTool)}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-muted">Current plan</dt>
          <dd className="mt-1 font-medium text-ink">{props.currentPlan}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-muted">Recommended plan</dt>
          <dd className="mt-1 font-medium text-ink">{props.recommendedPlan}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-muted">Current spend</dt>
          <dd className="mt-1 font-medium text-ink">${props.currentSpend}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-muted">Recommended spend</dt>
          <dd className="mt-1 font-medium text-ink">${props.recommendedSpend}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-muted">Monthly saving</dt>
          <dd className="mt-1 font-medium text-ink">${props.monthlySaving}</dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="text-xs font-medium uppercase tracking-wide text-muted">Why</dt>
          <dd className="mt-1 font-medium leading-relaxed text-ink">{props.reason}</dd>
        </div>
      </dl>
    </div>
  );
}
