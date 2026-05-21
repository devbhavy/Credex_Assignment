import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { CloseButton } from "../components/button/CloseButton";
import { ArrowRight, TrendingDown, TrendingUp, Minus } from "lucide-react";


interface ToolRecommendation {
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

interface DiffEntry {
  status: "unchanged" | "changed" | "new" | "removed";
  tool: string;
  rec: ToolRecommendation;
  oldRec?: ToolRecommendation;
}

interface AuditSnapshot {
  recommendations: ToolRecommendation[];
  totalMonthlySaving: number;
  totalAnnualSaving: number;
  summary: string | null;
}

interface DiffResponse {
  newAuditId: string;
  newShareToken: string;
  savingsDelta: number;
  diff: DiffEntry[];
  original: AuditSnapshot;
  updated: AuditSnapshot;
}

function statusBadge(status: DiffEntry["status"]) {
  const map = {
    unchanged: {
      label: "Unchanged",
      className: "bg-mint/30 text-green-700 border-mint",
    },
    changed: {
      label: "Changed",
      className: "bg-peach/40 text-orange-700 border-peach",
    },
    new: {
      label: "New",
      className: "bg-lavender/40 text-purple-700 border-lavender",
    },
    removed: {
      label: "Removed",
      className: "bg-blush/40 text-red-700 border-blush",
    },
  };
  const s = map[status];
  return (
    <span
      className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${s.className}`}
    >
      {s.label}
    </span>
  );
}

function SavingsDeltaBadge({ delta }: { delta: number }) {
  if (delta === 0)
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-border bg-canvas px-3 py-1 text-sm font-medium text-muted">
        <Minus className="h-3.5 w-3.5" />
        No change in savings
      </span>
    );
  if (delta > 0)
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-mint bg-mint/20 px-3 py-1 text-sm font-medium text-green-700">
        <TrendingDown className="h-3.5 w-3.5" />
        +${delta}/mo more savings
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-peach bg-peach/20 px-3 py-1 text-sm font-medium text-orange-700">
      <TrendingUp className="h-3.5 w-3.5" />
      ${Math.abs(delta)}/mo less savings
    </span>
  );
}

function MiniRec({
  rec,
  label,
  bgClass,
}: {
  rec: ToolRecommendation;
  label: string;
  bgClass: string;
}) {
  return (
    <div className={`rounded-xl border border-border ${bgClass} p-4 flex-1`}>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">
        {label}
      </p>
      <p className="text-sm font-medium text-ink capitalize">{rec.tool}</p>
      <p className="mt-0.5 text-xs text-muted">
        {rec.currentPlan} → {rec.recommendedPlan}
      </p>
      <p className="mt-2 text-lg font-semibold text-ink">
        ${rec.monthlySaving}
        <span className="text-xs font-normal text-muted">/mo saved</span>
      </p>
      <p className="mt-2 text-xs leading-relaxed text-muted line-clamp-3">
        {rec.reason}
      </p>
    </div>
  );
}


function DiffRow({ entry }: { entry: DiffEntry }) {
  const [expanded, setExpanded] = useState(entry.status !== "unchanged");

  return (
    <div className="rounded-2xl border border-border bg-surface shadow-sm overflow-hidden">

      <button
        onClick={() => setExpanded((p) => !p)}
        className="flex w-full items-center justify-between px-5 py-4 text-left hover:bg-canvas/60 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium capitalize text-ink">
            {entry.tool}
          </span>
          {statusBadge(entry.status)}
        </div>
        <div className="flex items-center gap-3">
          {entry.status !== "unchanged" && (
            <span className="text-sm font-semibold text-ink">
              ${entry.rec.monthlySaving}/mo
            </span>
          )}
          <span className="text-xs text-muted">
            {expanded ? "▲" : "▼"}
          </span>
        </div>
      </button>

      {expanded && (
        <div className="border-t border-border px-5 py-4">
          {entry.status === "unchanged" ? (
 
            <div className="rounded-xl border border-dashed border-border/80 bg-canvas/50 p-4">
              <p className="text-xs text-muted uppercase tracking-wider font-medium mb-1">
                Recommendation
              </p>
              <p className="text-sm text-ink">
                {entry.rec.currentPlan} → {entry.rec.recommendedPlan}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-muted">
                {entry.rec.reason}
              </p>
            </div>
          ) : entry.status === "changed" && entry.oldRec ? (
            <div className="flex flex-col gap-3 sm:flex-row">
              <MiniRec
                rec={entry.oldRec}
                label="Previous"
                bgClass="bg-blush/20"
              />
              <div className="flex items-center justify-center">
                <ArrowRight className="h-4 w-4 text-muted rotate-90 sm:rotate-0" />
              </div>
              <MiniRec
                rec={entry.rec}
                label="Updated"
                bgClass="bg-mint/20"
              />
            </div>
          ) : (
            
            <MiniRec
              rec={entry.rec}
              label={entry.status === "new" ? "New finding" : "No longer applicable"}
              bgClass={
                entry.status === "new" ? "bg-lavender/20" : "bg-canvas/50"
              }
            />
          )}
        </div>
      )}
    </div>
  );
}

export default function DiffView() {
  const { shareToken } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState<DiffResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get<DiffResponse>(
          `${import.meta.env.VITE_BACKEND_URL}/app/audit/${shareToken}/rerun`
        );
        setData(response.data);
      } catch (err) {
        console.error(err);
        alert("Could not load diff. Please try again.");
        navigate(-1);
      } finally {
        setLoading(false);
      }
    })();
  }, [shareToken, navigate]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 px-6">
        <div
          className="h-9 w-9 animate-spin rounded-full border-2 border-border border-t-accent"
          aria-hidden
        />
        <p className="text-sm text-muted">Running updated audit...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="mx-auto max-w-lg px-6 py-16 text-center">
        <p className="text-muted">Could not load audit diff.</p>
      </div>
    );
  }

  const changedCount = data.diff.filter((d) => d.status !== "unchanged").length;
  const unchangedCount = data.diff.filter((d) => d.status === "unchanged").length;

  return (
    <div className="mx-auto max-w-3xl px-5 py-12 pb-24">
      <CloseButton />

      <header className="mb-10">
        <p className="mb-2 rounded-full border border-border bg-surface-raised/80 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-blue-700 inline-block">
          Re-audit
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
          What changed in your audit
        </h1>
        <p className="mt-2 text-sm text-muted">
          Pricing data has been updated. Here is how your recommendations
          changed.
        </p>
      </header>

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-peach/40 p-5 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wider text-muted">
            Previous Saving
          </p>
          <p className="mt-2 text-2xl font-semibold text-ink">
            ${data.original.totalMonthlySaving}/mo
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-mint/50 p-5 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wider text-muted">
            Updated Saving
          </p>
          <p className="mt-2 text-2xl font-semibold text-ink">
            ${data.updated.totalMonthlySaving}/mo
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-lavender/40 p-5 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wider text-muted">
            Savings Delta
          </p>
          <div className="mt-2">
            <SavingsDeltaBadge delta={data.savingsDelta} />
          </div>
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-3">
        <span className="rounded-full border border-border bg-surface px-3 py-1 text-xs text-muted">
          {changedCount} tool{changedCount !== 1 ? "s" : ""} changed
        </span>
        <span className="rounded-full border border-border bg-surface px-3 py-1 text-xs text-muted">
          {unchangedCount} unchanged
        </span>
      </div>

      {/* Diff list */}
      <div className="space-y-3">
        {/* Changed entries first */}
        {data.diff
          .filter((d) => d.status !== "unchanged")
          .map((entry, i) => (
            <DiffRow key={`changed-${i}`} entry={entry} />
          ))}

        {/* Unchanged — collapsed by default */}
        {unchangedCount > 0 && (
          <>
            <p className="pt-2 text-xs font-medium uppercase tracking-wider text-muted">
              Unchanged
            </p>
            {data.diff
              .filter((d) => d.status === "unchanged")
              .map((entry, i) => (
                <DiffRow key={`unchanged-${i}`} entry={entry} />
              ))}
          </>
        )}
      </div>

      <div className="mt-10 space-y-4 rounded-2xl border border-border bg-surface p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-ink">Updated Summary</h2>
        <p className="text-sm leading-relaxed text-muted">
          {data.updated.summary ?? "No summary available."}
        </p>

        {data.original.summary && (
          <>
            <div className="border-t border-border pt-4">
              <h2 className="text-sm font-semibold text-muted">
                Previous Summary
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted/70 italic">
                {data.original.summary}
              </p>
            </div>
          </>
        )}
      </div>

      <div className="mt-10 flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={() =>
            navigate(`/audit/${data.newShareToken}`)
          }
          className="rounded-full bg-accent px-8 py-3 text-sm font-semibold text-ink shadow-sm transition-colors hover:bg-accent-hover cursor-pointer"
        >
          View Full Updated Audit
        </button>
      </div>
    </div>
  );
}