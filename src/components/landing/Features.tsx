const features = [
  {
    tag: "01",
    title: "QUESTION TYPES",
    description:
      "Behavioral (STAR method), case studies, and situational judgment. Three difficulty levels — easy, medium, hard.",
  },
  {
    tag: "02",
    title: "JOB TAILORING",
    description:
      "Paste a job description and get questions built for that exact role, company, and skill set.",
  },
  {
    tag: "03",
    title: "ANSWER MODES",
    description:
      "Write a free-form answer for deep practice, or pick from multiple-choice options for a quick session.",
  },
  {
    tag: "04",
    title: "AI FEEDBACK",
    description:
      "Strengths, improvement areas, and a STAR framework score — honest, specific, and actionable.",
  },
];

export default function Features() {
  return (
    <section
      id="features"
      className="px-6 py-16"
      style={{ borderTop: "1.5px dashed var(--border)" }}
    >
      <div className="mx-auto max-w-2xl">
        <p
          className="text-xs tracking-[0.2em] uppercase mb-10"
          style={{ fontFamily: "var(--font-space-mono)", color: "var(--muted)" }}
        >
          WHAT IT DOES
        </p>
        <div className="space-y-0">
          {features.map((f, i) => (
            <div
              key={f.tag}
              className="py-6 flex gap-6"
              style={{
                borderTop: i > 0 ? "1.5px dashed var(--border)" : undefined,
              }}
            >
              <span
                className="text-xs pt-0.5 shrink-0 w-6"
                style={{
                  fontFamily: "var(--font-space-mono)",
                  color: "var(--muted)",
                }}
              >
                {f.tag}
              </span>
              <div>
                <p
                  className="text-xs tracking-[0.14em] uppercase font-bold mb-2"
                  style={{
                    fontFamily: "var(--font-space-mono)",
                    color: "var(--fg)",
                  }}
                >
                  {f.title}
                </p>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "var(--muted)" }}
                >
                  {f.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
