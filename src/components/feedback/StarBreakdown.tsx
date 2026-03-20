import { STARScore } from "@/types";
import { cn } from "@/lib/utils";

interface Props {
  scores: STARScore[];
}

function DotRating({ score }: { score: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "w-2.5 h-2.5 rounded-full",
            i < score ? "bg-brand" : "bg-slate-200"
          )}
        />
      ))}
    </div>
  );
}

const componentColors: Record<string, string> = {
  Situation: "bg-blue-50 border-blue-200",
  Task: "bg-purple-50 border-purple-200",
  Action: "bg-amber-50 border-amber-200",
  Result: "bg-green-50 border-green-200",
};

export default function StarBreakdown({ scores }: Props) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
        <span className="text-brand">★</span>
        STAR Framework Breakdown
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {scores.map((s) => (
          <div
            key={s.component}
            className={cn(
              "rounded-xl border p-4 space-y-2",
              componentColors[s.component] || "bg-slate-50 border-slate-200"
            )}
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold text-sm text-slate-700">{s.component}</span>
              <div className="flex items-center gap-2">
                <DotRating score={s.score} />
                <span className="text-xs text-slate-500 font-medium">{s.score}/5</span>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">{s.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
