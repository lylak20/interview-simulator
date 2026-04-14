import Link from "next/link";

export default function Hero() {
  return (
    <section className="flex flex-col items-center justify-center px-6 pt-20 pb-12 text-center">
      {/* Wordmark */}
      <p
        className="text-xs tracking-[0.2em] uppercase mb-10"
        style={{ fontFamily: "var(--font-space-mono)", color: "var(--muted)" }}
      >
        SYSTEM 0.1
      </p>

      {/* Illustration — head with speech bubble */}
      <div className="relative mb-10 select-none">
        <svg
          width="220"
          height="220"
          viewBox="0 0 220 220"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Head */}
          <ellipse cx="110" cy="130" rx="68" ry="72" fill="#C4B09A" />
          {/* Ear */}
          <ellipse cx="178" cy="128" rx="10" ry="16" fill="#B89E88" />
          {/* Left eye */}
          <ellipse cx="90" cy="118" rx="5" ry="5.5" fill="#1A1A1A" />
          {/* Right eye */}
          <ellipse cx="128" cy="118" rx="5" ry="5.5" fill="#1A1A1A" />
          {/* Nose */}
          <rect x="107" y="128" width="6" height="10" rx="3" fill="#1A1A1A" opacity="0.5" />
          {/* Mouth */}
          <rect x="97" y="148" width="26" height="5" rx="2.5" fill="#1A1A1A" opacity="0.4" />

          {/* Speech bubble */}
          <rect x="36" y="28" width="148" height="78" rx="12" fill="var(--white)" />
          {/* Bubble tail */}
          <path d="M90 106 L80 118 L104 106Z" fill="var(--white)" />

          {/* Text lines in bubble */}
          <text
            x="110"
            y="60"
            textAnchor="middle"
            fontFamily="Space Mono, monospace"
            fontSize="11"
            fontWeight="700"
            letterSpacing="1"
            fill="#1A1A1A"
          >
            DON&apos;T BELIEVE
          </text>
          <text
            x="110"
            y="78"
            textAnchor="middle"
            fontFamily="Space Mono, monospace"
            fontSize="11"
            fontWeight="700"
            letterSpacing="1"
            fill="#1A1A1A"
          >
            EVERY THOUGHT
          </text>
          <text
            x="110"
            y="96"
            textAnchor="middle"
            fontFamily="Space Mono, monospace"
            fontSize="11"
            fontWeight="700"
            letterSpacing="1"
            fill="#1A1A1A"
          >
            YOU HAVE
          </text>
        </svg>
      </div>

      <h1
        className="text-4xl font-bold tracking-tight mb-3"
        style={{ color: "var(--fg)" }}
      >
        NOGGIN
      </h1>
      <p
        className="text-sm tracking-[0.14em] uppercase mb-2"
        style={{ fontFamily: "var(--font-space-mono)", color: "var(--muted)" }}
      >
        Interview Simulator
      </p>
      <p
        className="max-w-xs text-sm leading-relaxed mb-10"
        style={{ color: "var(--muted)" }}
      >
        Practice behavioral, case &amp; situational questions. Get honest AI
        feedback.
      </p>

      <Link
        href="/practice"
        className="w-full max-w-xs block text-center py-4 text-sm font-bold tracking-[0.2em] uppercase transition-opacity hover:opacity-80"
        style={{
          fontFamily: "var(--font-space-mono)",
          background: "var(--fg)",
          color: "var(--white)",
        }}
      >
        START SESSION
      </Link>

      <a
        href="#features"
        className="mt-4 text-xs tracking-[0.14em] uppercase underline underline-offset-4"
        style={{ fontFamily: "var(--font-space-mono)", color: "var(--muted)" }}
      >
        LEARN MORE
      </a>
    </section>
  );
}
