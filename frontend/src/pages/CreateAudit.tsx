import { useState, type ChangeEvent, type FormEvent } from "react"
import { ToolCard } from "../components/card/ToolCard";
import { AddTool } from "../components/AddTool";
import axios from "axios";
import { useNavigate } from "react-router";
import { CloseButton } from "../components/button/CloseButton";
import { PendingPanel, Spinner } from "../components/InlineLoader";

export interface toolType {
  tool: string;
  plan: string;
  seats: number;
  monthlySpend: number;
  usageFrequency: string;
}

type UseCase = "coding" | "writing" | "research" | "data" | "mixed";

interface additionalInfoType{
  teamSize:number;
  useCase : UseCase,
  needsAdminControls : boolean
}



export default function CreateAudit() {
  const [input, setInput] = useState<toolType[]>([]);
  const [additionalInfo,setAdditonalInfo] = useState<additionalInfoType>({
    teamSize : 0,
    useCase : 'coding',
    needsAdminControls : false
  })
  const [visibility, setVisibility] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate()

  const onAdd = (entry: toolType) => {
    setInput((prev) => [...prev, entry]);
  };

  async function handleSubmit(e: FormEvent<HTMLFormElement>){
    e.preventDefault();
    const auditInput ={...additionalInfo,tools:input}
    console.log(auditInput);
    setIsSubmitting(true);
    try{
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/app/audit/create`,auditInput);
      navigate(`/audit/${response.data.auditId}?new=true`,{
        replace : true
      })
    }catch(err){
      setIsSubmitting(false);
      alert("failed to generate audit some error occurred!")
    }
  }

  function handleAdditionalInfoChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;

    let parsed: string | number | boolean = value;
    if (name === "teamSize") parsed = Number(value);
    if (name === "needsAdminControls") parsed = value === "true";

    setAdditonalInfo({
      ...additionalInfo,
      [name]: parsed
    });
  }

  return (
    <div className="mx-auto max-w-2xl px-5 py-12 pb-24">
      {isSubmitting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-overlay/50 p-6 backdrop-blur-[2px]">
          <PendingPanel message="Creating your audit…" />
        </div>
      )}

      
      <CloseButton/>

      <header className="mb-10">
        <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
          New audit
        </h1>
        <p className="mt-2 max-w-lg text-muted leading-relaxed">
          Add the AI tools your team pays for, then tell us how you work—we&apos;ll build the picture.
        </p>
      </header>

      <section className="mb-10 rounded-2xl border border-border bg-surface p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-sm font-semibold text-ink">Tools</h2>
            <p className="mt-1 text-sm text-muted">
              {input.length === 0
                ? "No tools yet—add what you use today."
                : `${input.length} tool${input.length === 1 ? "" : "s"} listed.`}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setVisibility(true)}
            className="shrink-0 rounded-full border border-border bg-mint/80 px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-mint"
          >
            Add a tool
          </button>
        </div>

        {visibility && (
          <AddTool setVisibility={setVisibility} onAdd={onAdd} />
        )}

        <div className="mt-6 flex min-h-16 flex-col gap-3 rounded-xl border border-dashed border-border/80 bg-canvas/50 p-4">
          {input.length === 0 ? (
            <p className="self-center py-6 text-center text-sm text-muted">
              Your tools will appear here as cards.
            </p>
          ) : (
            input.map((data, index) => (
              <div key={index}>
                <ToolCard {...data} />
              </div>
            ))
          )}
        </div>
      </section>

      <form
        onSubmit={handleSubmit}
        aria-busy={isSubmitting}
        className="space-y-8 rounded-2xl border border-border bg-surface-raised p-6 shadow-sm"
      >
        <div>
          <h2 className="text-sm font-semibold text-ink">Use case</h2>
          <p className="mt-1 text-sm text-muted">What best describes the team?</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {(
              [
                ["coding", "Coding"],
                ["writing", "Writing"],
                ["research", "Research"],
                ["data", "Data"],
                ["mixed", "Mixed"],
              ] as const
            ).map(([value, label]) => (
              <label
                key={value}
                className={`inline-flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors ${
                  additionalInfo.useCase === value
                    ? "border-accent bg-accent-muted text-ink"
                    : "border-border bg-canvas text-muted hover:border-accent/50"
                }`}
              >
                <input
                  type="radio"
                  name="useCase"
                  className="sr-only"
                  onChange={handleAdditionalInfoChange}
                  value={value}
                  checked={additionalInfo.useCase === value}
                />
                {label}
              </label>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-ink">Admin controls</h2>
          <p className="mt-1 text-sm text-muted">Do you need enterprise-style controls?</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <label
              className={`inline-flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors ${
                additionalInfo.needsAdminControls === true
                  ? "border-accent bg-accent-muted text-ink"
                  : "border-border bg-canvas text-muted hover:border-accent/50"
              }`}
            >
              <input
                type="radio"
                name="needsAdminControls"
                className="sr-only"
                onChange={handleAdditionalInfoChange}
                value="true"
                checked={additionalInfo.needsAdminControls === true}
              />
              Yes
            </label>
            <label
              className={`inline-flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors ${
                additionalInfo.needsAdminControls === false
                  ? "border-accent bg-accent-muted text-ink"
                  : "border-border bg-canvas text-muted hover:border-accent/50"
              }`}
            >
              <input
                type="radio"
                name="needsAdminControls"
                className="sr-only"
                onChange={handleAdditionalInfoChange}
                value="false"
                checked={additionalInfo.needsAdminControls === false}
              />
              No
            </label>
          </div>
        </div>

        <div>
          <label htmlFor="teamSize" className="text-sm font-semibold text-ink">
            Team size
          </label>
          <p className="mt-1 text-sm text-muted">Rough headcount using these tools.</p>
          <input
            id="teamSize"
            type="number"
            name="teamSize"
            min={1}
            max={100}
            onChange={handleAdditionalInfoChange}
            value={additionalInfo.teamSize}
            placeholder="e.g. 12"
            className="mt-3 w-full max-w-xs rounded-xl border border-border bg-canvas px-4 py-3 text-ink placeholder:text-muted/70 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent py-3.5 text-sm font-semibold text-ink shadow-sm transition-colors hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent enabled:cursor-pointer disabled:cursor-wait disabled:opacity-90 sm:w-auto sm:px-10"
          >
            {isSubmitting ? (
              <>
                <Spinner size="sm" />
                Generating…
              </>
            ) : (
              "Generate audit"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}