import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ClaimForm from "../components/verify/ClaimForm";
import CouncilChamber from "../components/visuals/CouncilChamber";
import ActivityFeed from "../components/agents/ActivityFeed";
import { useCouncilSimulation } from "../hooks/useCouncilSimulation";
import { buildLiveRecord } from "../utils/buildLiveRecord";
import type { VerificationRecord } from "../types/verification";
import { VERDICT_TEXT } from "../components/history/verdictStyles";

export default function Verify() {
  const navigate = useNavigate();
  const { agents, status, log, run } = useCouncilSimulation();
  const [claim, setClaim] = useState("");
  const [submittedClaim, setSubmittedClaim] = useState<string | null>(null);
  const [record, setRecord] = useState<VerificationRecord | null>(null);

  const handleSubmit = () => {
    if (claim.trim().length === 0) return;
    setSubmittedClaim(claim);
    setRecord(null);
    run();
  };

  useEffect(() => {
    if (status === "complete" && submittedClaim && !record) {
      setRecord(buildLiveRecord(submittedClaim, new Date().toISOString().slice(0, 10)));
    }
  }, [status, submittedClaim, record]);

  return (
    <div className="verify-page relative z-10">
      <section className="mx-auto max-w-7xl px-6 md:px-10 pt-14 md:pt-20 pb-10">
        <div className="verify-kicker font-mono text-xs text-copper mb-6">verification chamber / live simulation</div>
        <h1 className="font-display text-5xl md:text-7xl leading-[0.95] text-ivory max-w-3xl">
          Bring a claim to the council.
        </h1>
        <p className="mt-6 max-w-xl text-ivory-dim text-sm leading-relaxed">
          State something you want checked. This demo runs the full
          eight-agent pipeline on mock data — labeled clearly as a
          simulation throughout.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-6 md:px-10 pb-10">
        <div className="verify-form max-w-3xl">
          <ClaimForm
            claim={claim}
            onChange={setClaim}
            onSubmit={handleSubmit}
            disabled={status === "running"}
          />
        </div>
      </section>

      {status !== "idle" && (
        <>
          <section className="verify-chamber-wrap mx-auto max-w-[1440px] px-0 md:px-6">
            <div className="verify-chamber relative min-h-[540px] md:min-h-[700px] overflow-hidden">
              <CouncilChamber agents={agents} variant="full" />
              <div className="verify-chamber-label absolute left-6 top-6 md:left-10 md:top-8 font-mono text-[10px] text-ivory-dim/60 tracking-[0.18em]">
                COUNCIL / 08 NODES / {status === "running" ? "PROCESSING" : "SESSION COMPLETE"}
              </div>
            </div>
          </section>

          <section className="mx-auto max-w-7xl px-6 md:px-10 pt-14 md:pt-20 pb-16 md:pb-24">
            <div className="verify-result-head font-mono text-[10px] text-copper tracking-[0.2em]">
              FINAL COUNCIL READOUT
            </div>
            <div className="mt-6 max-w-5xl">
              <p className="font-display text-2xl md:text-4xl leading-tight text-ivory">
                “{submittedClaim}”
              </p>
            </div>
            {record && (
              <div className="verify-verdict mt-12 md:mt-16 grid md:grid-cols-[1fr_auto] gap-8 md:gap-16 items-end">
                <div>
                  <p className="font-mono text-[10px] text-ivory-dim/60 tracking-[0.2em] mb-3">VERDICT</p>
                  <div className={`verify-verdict-word font-display text-7xl sm:text-8xl md:text-[10rem] leading-[0.78] ${VERDICT_TEXT[record.verdict]}`}>
                    {record.verdict === "contradicted" ? "REFUTED" : record.verdict === "inconclusive" ? "UNCERTAIN" : "SUPPORTED"}
                  </div>
                </div>
                <div className="verify-confidence md:text-right">
                  <p className="font-mono text-[10px] text-ivory-dim/60 tracking-[0.2em]">CONFIDENCE</p>
                  <p className={`font-display text-6xl md:text-8xl leading-none mt-2 ${VERDICT_TEXT[record.verdict]}`}>
                    {Math.round(record.confidence * 100)}<span className="text-3xl md:text-5xl">%</span>
                  </p>
                  <button
                    type="button"
                    onClick={() => navigate("/report/live", { state: { record } })}
                    className="mt-7 border-b border-amber text-amber font-mono text-xs tracking-wide pb-2 hover:text-ivory hover:border-ivory transition-colors"
                  >
                    OPEN FULL REPORT →
                  </button>
                </div>
              </div>
            )}
            <ActivityFeed log={log} />
          </section>
        </>
      )}
    </div>
  );
}
