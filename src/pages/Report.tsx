import { Link, useLocation, useParams } from "react-router-dom";
import ReportView from "../components/report/ReportView";
import { findVerification } from "../data/history";
import type { VerificationRecord } from "../types/verification";

export default function Report() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const stateRecord = (location.state as { record?: VerificationRecord } | null)?.record;

  const record = stateRecord ?? (id ? findVerification(id) : undefined);

  if (!record) {
    return (
      <section className="relative z-10 mx-auto max-w-7xl px-6 md:px-10 py-28 md:py-40">
        <p className="font-mono text-xs text-copper mb-6">report</p>
        <h1 className="font-display text-4xl md:text-5xl text-ivory max-w-xl">
          This report isn't available.
        </h1>
        <p className="mt-6 text-ivory-dim max-w-md">
          Live demo reports only persist for the session that generated
          them. Try browsing past sessions instead, or run a new one.
        </p>
        <div className="flex items-center gap-6 mt-8">
          <Link to="/history" className="text-sm text-copper hover:text-amber transition-colors">
            Browse history
          </Link>
          <Link to="/verify" className="text-sm text-ivory-dim hover:text-ivory transition-colors">
            Run a verification
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="relative z-10 mx-auto max-w-7xl px-6 md:px-10 py-16 md:py-20">
      <ReportView record={record} />
    </section>
  );
}
