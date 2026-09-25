import { Link } from "react-router-dom";
import PipelineTimeline from "../components/how-it-works/PipelineTimeline";

export default function HowItWorksPage() {
  return (
    <div className="relative z-10">
      <section className="mx-auto max-w-7xl px-6 md:px-10 pt-16 md:pt-20 pb-12">
        <p className="font-mono text-xs text-copper mb-6">how it works</p>
        <h1 className="font-display text-4xl md:text-6xl text-ivory max-w-2xl">
          From claim to verdict, in eight stages.
        </h1>
        <p className="mt-6 max-w-lg text-ivory-dim text-sm leading-relaxed">
          Every VERITAS session moves through the same pipeline. Nothing is
          skipped, and nothing is decided by a single agent alone.
        </p>
      </section>

      <section className="mx-auto max-w-4xl px-6 md:px-10 pb-24 md:pb-32">
        <PipelineTimeline />
      </section>

      <section className="border-t border-chamber-line">
        <div className="mx-auto max-w-7xl px-6 md:px-10 py-16 md:py-20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <p className="font-display text-2xl md:text-3xl text-ivory max-w-md">
            See it happen live in the council chamber.
          </p>
          <Link
            to="/agents"
            className="bg-amber text-void font-medium text-sm px-6 py-3 rounded-sm hover:bg-ivory transition-colors whitespace-nowrap"
          >
            Run a demo session
          </Link>
        </div>
      </section>
    </div>
  );
}
