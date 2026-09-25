export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-chamber-line">
      <div className="mx-auto max-w-7xl px-6 md:px-10 py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <p className="font-display text-lg text-ivory-dim">
          VERITAS <span className="text-copper">AI</span>
        </p>
        <p className="text-xs text-ivory-dim/70 font-mono">
          Demo build — every verification shown is simulated
        </p>
      </div>
    </footer>
  );
}
