import type { toolType } from "../../pages/CreateAudit";

export function ToolCard(props:toolType){
    return(
        <div className="rounded-xl border border-border bg-blush/35 px-5 py-4 shadow-sm">
            <dl className="grid gap-3 text-sm sm:grid-cols-2">
                <div>
                    <dt className="text-xs font-medium uppercase tracking-wide text-muted">Tool</dt>
                    <dd className="mt-1 font-medium text-ink capitalize">{props.tool.replace(/_/g, " ")}</dd>
                </div>
                <div>
                    <dt className="text-xs font-medium uppercase tracking-wide text-muted">Plan</dt>
                    <dd className="mt-1 font-medium text-ink">{props.plan}</dd>
                </div>
                <div>
                    <dt className="text-xs font-medium uppercase tracking-wide text-muted">Seats</dt>
                    <dd className="mt-1 font-medium text-ink">{props.seats}</dd>
                </div>
                <div>
                    <dt className="text-xs font-medium uppercase tracking-wide text-muted">Monthly spend</dt>
                    <dd className="mt-1 font-medium text-ink">${props.monthlySpend}</dd>
                </div>
                <div className="sm:col-span-2">
                    <dt className="text-xs font-medium uppercase tracking-wide text-muted">Usage limits</dt>
                    <dd className="mt-1 font-medium capitalize text-ink">{props.usageFrequency}</dd>
                </div>
            </dl>
        </div>
    )
}
