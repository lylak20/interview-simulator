import { FeedbackResult } from "@/types";
import { cn } from "@/lib/utils";

interface Props {
  metricAccuracy: NonNullable<FeedbackResult["metricAccuracy"]>;
}

const qualityColors: Record<string, string> = {
  excellent: "text-green-700 bg-green-100",
  good: "text-blue-700 bg-blue-100",
  partial: "text-amber-700 bg-amber-100",
  poor: "text-red-700 bg-red-100",
};

const qualityLabels: Record<string, string> = {
  excellent: "Excellent",
  good: "Good",
  partial: "Partial",
  poor: "Needs Work",
};

function CheckBadge({ value, label }: { value: boolean; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={cn(
          "w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0",
          value ? "bg-green-100" : "bg-red-100"
        )}
      >
        {value ? (
          <svg className="w-3 h-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg className="w-3 h-3 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        )}
      </div>
      <span className="text-sm text-slate-700">{label}</span>
    </div>
  );
}

export default function MetricAccuracyBlock({ metricAccuracy }: Props) {
  const { formulaCorrect, interpretationQuality, investmentContextualized, details } = metricAccuracy;

  return (
    <div className="bg-purple-50 border border-purple-200 rounded-xl p-5 space-y-4">
      <h3 className="text-sm font-semibold text-purple-800 flex items-center gap-2">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 11h.01M12 11h.01M15 11h.01M4.929 4.929A10 10 0 1119.07 19.07M4.929 4.929L19.07 19.07" />
        </svg>
        Metric Accuracy Assessment
      </h3>

      <div className="flex flex-wrap gap-4">
        <CheckBadge value={formulaCorrect} label="Formula correct" />
        <CheckBadge value={investmentContextualized} label="Tied to investment thesis" />
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-600">Interpretation:</span>
          <span
            className={cn(
              "text-xs font-semibold px-2.5 py-0.5 rounded-full",
              qualityColors[interpretationQuality]
            )}
          >
            {qualityLabels[interpretationQuality]}
          </span>
        </div>
      </div>

      <p className="text-sm text-slate-700 leading-relaxed border-t border-purple-200 pt-3">
        {details}
      </p>
    </div>
  );
}
