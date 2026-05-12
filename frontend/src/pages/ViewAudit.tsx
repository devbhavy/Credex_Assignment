import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router";
import { AddLead } from "../components/AddLead";
import {
    RecommendationCard,
    type ToolRecommendation,
} from "../components/card/RecommendationCard";
import {
    RedundancyCard,
    type RedundancyWarning,
} from "../components/card/RedundancyCard";
import { Check, Link as LinkIcon } from "lucide-react";
import { CloseButton } from "../components/button/CloseButton";

interface ResponseType {
    id: string;
    share_token: string | null;
    team_size: number;
    use_case: string;
    tools: string;
    recommendations: string;
    redundancies: string;
    total_monthly_saving: number;
    total_annual_saving: number;
    is_already_optimal: boolean | null;
    summary: string | null;
    created_at: string | null;
    needs_admin_controls: boolean | null;
}

function parseRecommendations(raw: string): ToolRecommendation[] | null {
    try {
        const parsed = JSON.parse(raw) as unknown;

        if (!Array.isArray(parsed)) {
            return null;
        }

        return parsed as ToolRecommendation[];
    } catch {
        return null;
    }
}

function parseRedundancies(raw: string): RedundancyWarning[] | null {
    try {
        const parsed = JSON.parse(raw) as unknown;

        if (!Array.isArray(parsed)) {
            return null;
        }

        return parsed as RedundancyWarning[];
    } catch {
        return null;
    }
}

export default function ViewAudit() {
    const { token } = useParams();

    const [searchParams] = useSearchParams();

    const navigate = useNavigate();

    const [data, setData] = useState<ResponseType | null>(null);

    const [loading, setLoading] = useState(true);

    const [visibility, setVisibility] = useState(false);

    const [linkCopied, setLinkCopied] = useState(false);

    const isNew = searchParams.get("new") === "true";

    useEffect(() => {
        (async () => {
            try {
                let response;

                if (isNew) {
                    response = await axios.get<ResponseType>(
                        `${import.meta.env.VITE_BACKEND_URL}/app/audit/${token}`
                    );
                } else {
                    response = await axios.get<ResponseType>(
                        `${import.meta.env.VITE_BACKEND_URL}/app/audit/${token}/public`
                    );
                }

                setData(response.data);
            } catch (err) {
                console.error(err);

                setData(null);

                alert("Some error occurred fetching the data from the backend");

                navigate("/audit/create");
            } finally {
                setLoading(false);
            }
        })();
    }, [token, navigate, isNew]);

    const recommendationList = useMemo(() => {
        if (!data) {
            return null;
        }

        return parseRecommendations(data.recommendations);
    }, [data]);

    const redundancyList = useMemo(() => {
        if (!data) {
            return null;
        }

        return parseRedundancies(data.redundancies);
    }, [data]);

    async function copyShareableLink() {
        if (!data?.share_token) {
            return;
        }

        const url = `${window.location.origin}/audit/${data.share_token}`;

        try {
            await navigator.clipboard.writeText(url);

            setLinkCopied(true);

            window.setTimeout(() => {
                setLinkCopied(false);
            }, 2000);
        } catch {
            alert("Could not copy link. Try copying manually.");
        }
    }

    if (loading) {
        return (
            <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 px-6">
                <div
                    className="h-9 w-9 animate-spin rounded-full border-2 border-border border-t-accent"
                    aria-hidden
                />

                <p className="text-sm text-muted">
                    Loading your audit...
                </p>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="mx-auto max-w-lg px-6 py-16 text-center">
                <p className="text-muted">
                    No audit data found.
                </p>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-3xl px-5 py-12 pb-24">
            <CloseButton/>

            <header className="mb-10">
                <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
                    Audit Results
                </h1>

                <p className="mt-2 text-sm text-muted">
                    Created{" "}
                    {data.created_at
                        ? new Date(data.created_at).toLocaleString()
                        : "—"}
                </p>
            </header>

            <div className="mb-8 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-border bg-peach/40 p-5 shadow-sm">
                    <p className="text-xs font-medium uppercase tracking-wider text-muted">
                        Monthly Saving
                    </p>

                    <p className="mt-2 text-2xl font-semibold text-ink">
                        ${data.total_monthly_saving}
                    </p>
                </div>

                <div className="rounded-2xl border border-border bg-mint/50 p-5 shadow-sm">
                    <p className="text-xs font-medium uppercase tracking-wider text-muted">
                        Annual Saving
                    </p>

                    <p className="mt-2 text-2xl font-semibold text-ink">
                        ${data.total_annual_saving}
                    </p>
                </div>

                <div className="rounded-2xl border border-border bg-lavender/40 p-5 shadow-sm">
                    <p className="text-xs font-medium uppercase tracking-wider text-muted">
                        Stack Status
                    </p>

                    <p className="mt-2 text-lg font-semibold text-ink">
                        {data.is_already_optimal
                            ? "Looks Optimal"
                            : "Room to Improve"}
                    </p>
                </div>
            </div>

            <div className="space-y-6 rounded-2xl border border-border bg-surface p-6 shadow-sm">
                <div className="flex flex-wrap gap-x-8 gap-y-3 border-b border-border pb-6 text-sm">
                    <div>
                        <span className="text-muted">
                            Team Size
                        </span>

                        <p className="mt-1 font-medium text-ink">
                            {data.team_size}
                        </p>
                    </div>

                    <div>
                        <span className="text-muted">
                            Use Case
                        </span>

                        <p className="mt-1 font-medium capitalize text-ink">
                            {data.use_case}
                        </p>
                    </div>
                </div>

                <section>
                    <h2 className="text-sm font-semibold text-ink">
                        Recommendations
                    </h2>

                    <p className="mt-1 text-sm text-muted">
                        Per-tool guidance from your audit.
                    </p>

                    {recommendationList &&
                    recommendationList.length > 0 ? (
                        <div className="mt-4 flex min-h-16 flex-col gap-3 rounded-xl border border-dashed border-border/80 bg-canvas/50 p-4">
                            {recommendationList.map((rec, index) => (
                                <div key={index}>
                                    <RecommendationCard {...rec} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <pre className="mt-3 overflow-x-auto rounded-xl border border-border bg-blush/30 p-4 text-sm leading-relaxed whitespace-pre-wrap font-sans text-ink">
                            {data.recommendations}
                        </pre>
                    )}
                </section>

                <section>
                    <h2 className="text-sm font-semibold text-ink">
                        Redundancies
                    </h2>

                    <p className="mt-1 text-sm text-muted">
                        Overlapping tools and possible consolidation.
                    </p>

                    {redundancyList &&
                    redundancyList.length > 0 ? (
                        <div className="mt-4 flex min-h-16 flex-col gap-3 rounded-xl border border-dashed border-border/80 bg-canvas/50 p-4">
                            {redundancyList.map((row, index) => (
                                <div key={index}>
                                    <RedundancyCard {...row} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <pre className="mt-3 overflow-x-auto rounded-xl border border-border bg-mint/25 p-4 text-sm leading-relaxed whitespace-pre-wrap font-sans text-ink">
                            {data.redundancies}
                        </pre>
                    )}
                </section>

                <section className="border-t border-border pt-6">
                    <h2 className="text-sm font-semibold text-ink">
                        Summary
                    </h2>

                    <p className="mt-3 text-sm leading-relaxed text-muted">
                        {data.summary || "No summary available"}
                    </p>
                </section>
            </div>

            {isNew && (
                <div className="mt-10 flex items-center justify-center gap-x-3">
                    <button
                        type="button"
                        onClick={() => {
                            setVisibility(true);
                        }}
                        className="rounded-full bg-accent px-8 py-3 text-sm font-semibold text-ink shadow-sm transition-colors hover:bg-accent-hover cursor-pointer"
                    >
                        Email Me This Audit
                    </button>

                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => {
                                void copyShareableLink();
                            }}
                            disabled={!data.share_token}
                            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-surface text-ink shadow-sm transition-colors hover:bg-canvas/80 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {linkCopied ? (
                                <Check className="h-5 w-5" />
                            ) : (
                                <LinkIcon className="h-5 w-5" />
                            )}
                        </button>

                        {linkCopied && (
                            <div className="absolute left-1/2 top-14 -translate-x-1/2 whitespace-nowrap rounded-lg bg-ink px-3 py-2 text-xs font-medium text-white shadow-lg">
                                Link copied
                            </div>
                        )}
                    </div>
                </div>
            )}

            {visibility && (
                <AddLead
                    setVisibility={setVisibility}
                    auditId={data.id}
                />
            )}
        </div>
    );
}