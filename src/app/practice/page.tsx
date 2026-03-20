import PracticeOrchestrator from "@/components/practice/PracticeOrchestrator";
import Link from "next/link";

export default function PracticePage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Nav */}
      <nav className="border-b border-slate-200 bg-white sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="font-bold text-slate-900 hover:text-brand transition-colors">
            Interview Sim
          </Link>
          <span className="text-xs text-slate-400 font-medium">
            VC &amp; Growth Equity
          </span>
        </div>
      </nav>

      <PracticeOrchestrator />
    </div>
  );
}
