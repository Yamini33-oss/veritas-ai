import { Link } from "react-router-dom";

export default function CTASection() {
  return (
    <section className="relative z-10 border-t border-chamber-line">
      <div className="mx-auto max-w-7xl px-6 md:px-10 py-24 md:py-32">
        <div className="max-w-2xl">
          <h2 className="font-display text-3xl md:text-5xl text-ivory leading-tight">
            Bring the council a claim and watch it get taken apart —
            <span className="text-amber"> carefully.</span>
          </h2>
          <p className="mt-6 text-ivory-dim text-base max-w-lg">
            This build runs on demo data while the backend is under
            construction. Every session is clearly marked as a
            simulation.
          </p>
          <Link
            to="/verify"
            className="mt-9 inline-block bg-amber text-void font-medium text-sm px-6 py-3 rounded-sm hover:bg-ivory transition-colors"
          >
            Begin a verification
          </Link>
        </div>
      </div>
    </section>
  );
}
