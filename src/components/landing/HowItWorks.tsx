const STAGES = [
  {
    n: "01",
    title: "Submit a claim",
    copy: "State what needs checking. The Orchestrator opens a session and briefs the council.",
  },
  {
    n: "02",
    title: "The council investigates",
    copy: "Reasoner, Researcher and Analyzer work the claim independently, in parallel.",
  },
  {
    n: "03",
    title: "Agents debate",
    copy: "The Critic challenges the findings; the Contradiction Detector flags where agents disagree.",
  },
  {
    n: "04",
    title: "Re-analysis",
    copy: "Flagged conflicts get sent back through the council before anything is finalized.",
  },
  {
    n: "05",
    title: "The Judge decides",
    copy: "Every finding is weighed on its merits, not tallied, into one final report.",
  },
];

export default function HowItWorks() {
  return (
    <section className="relative z-10 border-t border-chamber-line">
      <div className="mx-auto max-w-7xl px-6 md:px-10 py-20 md:py-28">
        <h2 className="font-display text-3xl md:text-4xl text-ivory mb-14">
          How a verification runs
        </h2>

        <div className="grid md:grid-cols-5 gap-x-6 gap-y-10">
          {STAGES.map((stage) => (
            <div key={stage.n} className="relative">
              <p className="font-display text-4xl text-copper/70 mb-4">
                {stage.n}
              </p>
              <p className="text-ivory text-base font-medium mb-2">
                {stage.title}
              </p>
              <p className="text-sm text-ivory-dim leading-relaxed">
                {stage.copy}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
