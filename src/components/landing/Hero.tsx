import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-950">
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #6366f1 1px, transparent 1px), linear-gradient(to bottom, #6366f1 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      {/* Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand/10 border border-brand/20 mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
          <span className="text-brand text-sm font-medium">VC &amp; Growth Equity Interview Prep</span>
        </div>

        <h1 className="text-5xl sm:text-6xl font-bold text-white leading-tight tracking-tight mb-6">
          Interview prep that thinks
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-light to-brand">
            like an investor.
          </span>
        </h1>

        <p className="text-slate-400 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
          Generate real VC and growth equity interview questions — from NRR and Sales Magic Number
          to IC-level judgment calls. Get AI feedback that's specific, not generic.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/practice"
            className="inline-flex items-center gap-2 px-8 py-4 bg-brand hover:bg-brand-dark text-white font-semibold rounded-xl transition-all duration-150 shadow-lg shadow-brand/25 hover:shadow-brand/40 text-base"
          >
            Start Practicing
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
          <a
            href="#features"
            className="inline-flex items-center gap-2 px-8 py-4 text-slate-300 hover:text-white font-medium rounded-xl transition-colors duration-150 text-base"
          >
            See how it works
          </a>
        </div>

        {/* Metric chips */}
        <div className="mt-16 flex flex-wrap justify-center gap-2">
          {[
            "ARR / MRR",
            "NRR",
            "Sales Magic Number",
            "Rule of 40",
            "CAC Payback",
            "LTV:CAC",
            "Burn Multiple",
            "Quick Ratio",
            "STAR Behavioral",
            "IC Judgment",
          ].map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-400 text-xs font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
