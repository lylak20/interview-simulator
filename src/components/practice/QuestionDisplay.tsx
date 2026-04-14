"use client";

interface Props {
  question: string;
  type: string;
  difficulty: string;
}

const typeLabels: Record<string, string> = {
  behavioral: "BEHAVIORAL",
  case: "CASE STUDY",
  situational: "SITUATIONAL",
};

export default function QuestionDisplay({ question, type, difficulty }: Props) {
  return (
    <div
      className="p-6"
      style={{
        background: "var(--white)",
        border: "1.5px dashed var(--border)",
      }}
    >
      <div className="flex items-center gap-3 mb-4">
        <span
          className="px-3 py-1 text-xs tracking-[0.14em] uppercase"
          style={{
            fontFamily: "var(--font-space-mono)",
            background: "var(--tag-bg)",
            color: "var(--tag-text)",
          }}
        >
          {typeLabels[type] || type}
        </span>
        <span
          className="px-3 py-1 text-xs tracking-[0.14em] uppercase"
          style={{
            fontFamily: "var(--font-space-mono)",
            background: "var(--bg-surface)",
            color: "var(--muted)",
          }}
        >
          {difficulty}
        </span>
      </div>
      <p
        className="text-base leading-relaxed"
        style={{ color: "var(--fg)" }}
      >
        {question}
      </p>
    </div>
  );
}
