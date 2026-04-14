import Link from "next/link";

export default function Hero() {
  return (
    <section className="flex flex-col items-center justify-center px-6 pt-24 pb-16 text-center">
      <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-4 py-1.5 text-sm font-medium text-indigo-700 mb-6">
        <span className="h-2 w-2 rounded-full bg-indigo-500" />
        AI-Powered Interview Practice
      </div>
      <h1 className="max-w-3xl text-5xl font-bold tracking-tight text-slate-900 sm:text-6xl">
        Ace Your Next Interview with{" "}
        <span className="text-indigo-600">Confidence</span>
      </h1>
      <p className="mt-6 max-w-2xl text-lg text-slate-600 leading-relaxed">
        Practice behavioral, case, and situational interview questions tailored
        to your target role. Get instant AI feedback on your answers with
        actionable insights to improve.
      </p>
      <div className="mt-10 flex gap-4">
        <Link
          href="/practice"
          className="rounded-xl bg-indigo-600 px-8 py-3.5 text-base font-semibold text-white shadow-md hover:bg-indigo-700 transition-colors"
        >
          Start Practicing
        </Link>
        <a
          href="#features"
          className="rounded-xl border border-slate-300 px-8 py-3.5 text-base font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
        >
          Learn More
        </a>
      </div>
    </section>
  );
}
