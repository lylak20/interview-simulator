import Hero from "@/components/landing/Hero";
import FeatureGrid from "@/components/landing/FeatureGrid";
import Link from "next/link";

export default function Home() {
  return (
    <main>
      <Hero />
      <FeatureGrid />

      {/* CTA section */}
      <section className="py-20 bg-slate-950 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">
          Ready to practice?
        </h2>
        <p className="text-slate-400 mb-8 max-w-lg mx-auto">
          No login required. Start with a metrics question and work up to IC-level situational judgment.
        </p>
        <Link
          href="/practice"
          className="inline-flex items-center gap-2 px-8 py-4 bg-brand hover:bg-brand-dark text-white font-semibold rounded-xl transition-all duration-150 shadow-lg shadow-brand/25"
        >
          Start Practicing
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </Link>
      </section>
    </main>
  );
}
