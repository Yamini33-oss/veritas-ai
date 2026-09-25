export default function ProblemStatement() {
  return (
    <section className="relative z-10 border-t border-chamber-line">
      <div className="mx-auto max-w-7xl px-6 md:px-10 py-20 md:py-28">
        <div className="grid md:grid-cols-12 gap-8">
          <div className="md:col-span-4">
            <p className="font-mono text-xs text-copper">the problem</p>
          </div>
          <div className="md:col-span-8">
            <p className="font-display text-2xl md:text-3xl leading-snug text-ivory-dim max-w-3xl">
              A single model reasons alone, and its confidence tells
              you nothing about whether it's right. It can sound
              certain while being wrong, and there's no second
              opinion in the room to catch it.
            </p>
            <p className="mt-6 font-display text-2xl md:text-3xl leading-snug text-ivory max-w-3xl">
              VERITAS puts the claim through a room full of second
              opinions instead — agents built to research, challenge
              and check each other, so the verdict survives scrutiny
              before you see it.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
