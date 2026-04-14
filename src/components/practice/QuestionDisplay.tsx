"use client";

interface Props {
  question: string;
  type: string;
  difficulty: string;
}

const typeLabels: Record<string, string> = {
  behavioral: "Behavioral (STAR)",
  case: "Case Study",
  situational: "Situational Judgment",
};

const difficultyColors: Record<string, string> = {
  easy: "bg-green-100 text-green-700",
  medium: "bg-yellow-100 text-yellow-700",
  hard: "bg-red-100 text-red-700",
};

export default function QuestionDisplay({ question, type, difficulty }: Props) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <span className="inline-flex items-center rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-700">
          {typeLabels[type] || type}
        </span>
        <span
          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium capitalize ${difficultyColors[difficulty] || ""}`}
        >
          {difficulty}
        </span>
      </div>
      <p className="text-lg font-medium text-slate-900 leading-relaxed">
        {question}
      </p>
    </div>
  );
}
