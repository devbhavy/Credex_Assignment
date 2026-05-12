export interface RedundancyWarning {
  tools: string[];
  category: string;
  suggestion: string;
  potentialSaving: number;
}

function formatToolName(name: string) {
  return name.replace(/_/g, " ");
}

export function RedundancyCard(props: RedundancyWarning) {
  return (
    <div className="rounded-xl border border-border bg-mint/25 px-5 py-4 shadow-sm">
      <dl className="grid gap-3 text-sm sm:grid-cols-2">
        <div className="sm:col-span-2">
          <dt className="text-xs font-medium uppercase tracking-wide text-muted">Category</dt>
          <dd className="mt-1 font-medium capitalize text-ink">{props.category}</dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="text-xs font-medium uppercase tracking-wide text-muted">Overlapping tools</dt>
          <dd className="mt-1 font-medium text-ink">
            {props.tools.map(formatToolName).join(" · ")}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-muted">Potential monthly saving</dt>
          <dd className="mt-1 font-medium text-ink">${props.potentialSaving}</dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="text-xs font-medium uppercase tracking-wide text-muted">Suggestion</dt>
          <dd className="mt-1 font-medium leading-relaxed text-ink">{props.suggestion}</dd>
        </div>
      </dl>
    </div>
  );
}
