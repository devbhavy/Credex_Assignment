import { useNavigate } from "react-router"
import { useState } from "react"
import logo from "../assets/logo.png"

export default function Landing() {
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const scrollTo = (id: string) => {
    setMenuOpen(false)
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-canvas px-6 py-35">


      <div className="fixed top-5 left-5 right-5 py-3 px-5 bg-surface-raised/80 rounded-full z-10 backdrop-blur-md flex items-center justify-between">
        <div>
          <img className="h-[60px] w-[100px]" src={logo} alt="CredLens" />
        </div>

        <div className="relative">
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="flex flex-col gap-1.5 p-2 rounded-lg hover:bg-surface-raised transition-colors"
            aria-label="Toggle menu"
          >
            <span className={`block h-0.5 w-5 bg-ink transition-transform duration-200 ${menuOpen ? "translate-y-2 rotate-45" : ""}`} />
            <span className={`block h-0.5 w-5 bg-ink transition-opacity duration-200 ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`block h-0.5 w-5 bg-ink transition-transform duration-200 ${menuOpen ? "-translate-y-2 -rotate-45" : ""}`} />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-12 bg-surface-raised/95 backdrop-blur-md border border-border rounded-2xl shadow-lg py-2 w-44 flex flex-col">
              <button
                onClick={() => scrollTo("about")}
                className="px-5 py-2.5 text-sm text-ink hover:bg-canvas text-left transition-colors"
              >
                About
              </button>
              <button
                onClick={() => scrollTo("features")}
                className="px-5 py-2.5 text-sm text-ink hover:bg-canvas text-left transition-colors"
              >
                Features
              </button>
              <div className="mx-4 my-1 border-t border-border" />
              <button
                onClick={() => navigate("/audit/create")}
                className="px-5 py-2.5 text-sm font-semibold text-blue-700 hover:bg-canvas text-left transition-colors"
              >
                Start Audit →
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="pointer-events-none absolute -left-24 top-24 h-72 w-72 rounded-full bg-lavender/60 blur-3xl" aria-hidden />
      <div className="pointer-events-none absolute -right-16 bottom-16 h-80 w-80 rounded-full bg-mint/50 blur-3xl" aria-hidden />


      <div className="relative mx-auto flex max-w-lg flex-col items-center text-center">
        <p className="mb-4 rounded-full border border-border bg-surface-raised/80 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-blue-700">
          AI stack audit
        </p>
        <h1 className="text-balance font-semibold tracking-tight text-ink text-4xl sm:text-5xl">
          Trim overlap. Clarify spend.
        </h1>
        <p className="mt-5 max-w-md text-pretty text-lg leading-relaxed text-muted">
          A calm place to map your team&apos;s AI tools and surface savings—without the noise.
        </p>
        <button
          type="button"
          onClick={() => navigate("/audit/create", { replace: true })}
          className="mt-10 rounded-full bg-accent px-8 py-3 text-sm font-semibold text-ink shadow-sm transition-colors hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          Start an audit
        </button>
      </div>

      <section id="about" className="relative mx-auto mt-20 max-w-2xl text-center">
        <p className="mb-4 rounded-full border border-border bg-surface-raised/80 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-blue-700 inline-block">
          About
        </p>
        <h2 className="text-balance font-semibold tracking-tight text-ink text-3xl sm:text-4xl">
          Most teams don't know they're overspending.
        </h2>
        <p className="mt-5 text-pretty text-lg leading-relaxed text-muted">
          You look at the monthly bill, sigh, and pay it. There's no benchmark,
          no second opinion, no obvious alternative surfaced. CredLens is the
          missing layer — a free audit that tells you exactly where your AI
          spend is misaligned, overlapping, or just plain wrong for your team size.
        </p>
        <p className="mt-4 text-pretty text-lg leading-relaxed text-muted">
          No login. No fluff. Just an honest look at your stack.
        </p>
      </section>

      <section id="features" className="relative mx-auto mt-20 max-w-3xl">
        <div className="text-center mb-10">
          <p className="mb-4 rounded-full border border-border bg-surface-raised/80 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-blue-700 inline-block">
            Features
          </p>
          <h2 className="text-balance font-semibold tracking-tight text-ink text-3xl sm:text-4xl">
            What CredLens checks for you
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {[
            {
              title: "Plan right-sizing",
              desc: "Are you on a team plan with 2 people? Paying for Ultra when Pro is enough? We flag it.",
            },
            {
              title: "Redundant tool detection",
              desc: "Paying for Cursor and GitHub Copilot at the same time? We surface the overlap and tell you what to drop.",
            },
            {
              title: "Use case mismatch",
              desc: "Using a coding tool for writing? We flag misaligned tools and suggest a better fit at the same price.",
            },
            {
              title: "API vs flat plan",
              desc: "If your monthly API bill exceeds a flat plan — we tell you. Predictable billing, same capability.",
            },
            {
              title: "Shareable report",
              desc: "Every audit gets a unique public URL. Screenshot it, share it, send it to your finance team.",
            },
            {
              title: "AI summary",
              desc: "A plain-English paragraph summarising your audit — generated fresh for every report.",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-border bg-surface-raised/80 backdrop-blur-sm p-6 flex flex-col gap-2"
            >
              <h3 className="font-semibold text-ink text-base">{f.title}</h3>
              <p className="text-sm leading-relaxed text-muted">{f.desc}</p>
            </div>
          ))}
        </div>


        <div className="mt-12 text-center">
          <button
            type="button"
            onClick={() => navigate("/audit/create")}
            className="rounded-full bg-accent px-8 py-3 text-sm font-semibold text-ink shadow-sm transition-colors hover:bg-accent-hover"
          >
            Start an audit — it's free
          </button>
        </div>
      </section>

      <footer className="relative mt-20 text-center text-xs text-muted">
        <p>© {new Date().getFullYear()} CredLens · Built by <a href="https://github.com/devbhavy">@devbhavy</a></p>
      </footer>

    </div>
  )
}