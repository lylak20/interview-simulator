export default function Footer() {
  return (
    <footer
      className="mt-auto px-6 py-8"
      style={{ borderTop: "1.5px dashed var(--border)" }}
    >
      <div className="mx-auto max-w-2xl flex items-center justify-between">
        <p
          className="text-xs tracking-[0.14em] uppercase"
          style={{ fontFamily: "var(--font-space-mono)", color: "var(--muted)" }}
        >
          NOGGIN
        </p>
        <p
          className="text-xs tracking-[0.14em] uppercase"
          style={{ fontFamily: "var(--font-space-mono)", color: "var(--muted)" }}
        >
          BUILT WITH ANTHROPIC
        </p>
      </div>
    </footer>
  );
}
