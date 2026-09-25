import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ClaimForm from "../components/verify/ClaimForm";
import CouncilChamber from "../components/visuals/CouncilChamber";
import ActivityFeed from "../components/agents/ActivityFeed";
import { useCouncilSimulation } from "../hooks/useCouncilSimulation";
import { SIMULATION_ORDER } from "../data/simulation";
import type { VerificationRecord, Verdict } from "../types/verification";
import { VERDICT_TEXT } from "../components/history/verdictStyles";
import { detectClaimType } from "../utils/detectClaimType";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ?? "";

interface BackendResult {
  claim: string;

  agents: {
    reasoner: {
      conclusion: Verdict;
      reasoning: string;
      confidence: number;
    };

    researcher: {
      evidence: string;
      sources: string[];
      support: Verdict;
      confidence: number;
    };

    analyzer: {
      analysis: string;
      logicalIssue: string;
      conclusion: Verdict;
      confidence: number;
    };

    critic: {
      challenge: string;
      weaknesses: string[];
      conclusion: Verdict;
      confidence: number;
    };

    evidenceVerifier: {
      verification: string;
      evidenceStrength: string;
      unsupportedClaims: string[];
      conclusion: Verdict;
      confidence: number;
    };

    contradictionDetector: {
      hasContradiction: boolean;
      contradictions: string[];
      analysis: string;
      resolutionNeeded: boolean;
      confidence: number;
    };

    judge: {
      verdict: Verdict;
      finalReasoning: string;
      confidence: number;
      keySupportingFindings: string[];
      keyConcerns: string[];
      contradictionsResolved: boolean;
    };
  };

  finalVerdict: Verdict;
  confidence: number;
}

interface BackendResponse {
  success: boolean;
  result?: BackendResult;
  error?: string;
}

function buildRecordFromBackend(
  result: BackendResult
): VerificationRecord {
  const agents = result.agents;

  return {
    id: "live",
    date: new Date().toISOString().slice(0, 10),
    type: detectClaimType(result.claim),
    claim: result.claim,
    verdict: result.finalVerdict,
    confidence: result.confidence,
    agentsUsed: SIMULATION_ORDER,

    contradictions:
      agents.contradictionDetector.contradictions,

    sources: agents.researcher.sources,

    judgeDetails: {
      keySupportingFindings:
        agents.judge.keySupportingFindings,
      keyConcerns:
        agents.judge.keyConcerns,
      contradictionsResolved:
        agents.judge.contradictionsResolved,
    },

    findings: [
      {
        agentId: "reasoner",
        note: agents.reasoner.reasoning,
        confidence: agents.reasoner.confidence,
      },

      {
        agentId: "researcher",
        note: agents.researcher.evidence,
        confidence: agents.researcher.confidence,
      },

      {
        agentId: "analyzer",
        note:
          `${agents.analyzer.analysis} ` +
          `Logical issue: ${agents.analyzer.logicalIssue}`,
        confidence: agents.analyzer.confidence,
      },

      {
        agentId: "critic",
        note:
          `${agents.critic.challenge} ` +
          `Weaknesses: ${agents.critic.weaknesses.join("; ")}`,
        confidence: agents.critic.confidence,
      },

      {
        agentId: "evidence-verifier",
        note:
          `${agents.evidenceVerifier.verification} ` +
          `Evidence strength: ${agents.evidenceVerifier.evidenceStrength}.`,
        confidence: agents.evidenceVerifier.confidence,
      },

      {
        agentId: "contradiction-detector",
        note: agents.contradictionDetector.analysis,
        confidence: agents.contradictionDetector.confidence,
      },

      {
        agentId: "judge",
        note: agents.judge.finalReasoning,
        confidence: agents.judge.confidence,
      },
    ],
  };
}

export default function Verify() {
  const navigate = useNavigate();

  const { agents, log, run } = useCouncilSimulation();

  const [claim, setClaim] = useState("");
  const [submittedClaim, setSubmittedClaim] =
    useState<string | null>(null);

  const [record, setRecord] =
    useState<VerificationRecord | null>(null);

  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [verificationState, setVerificationState] = useState<
    "idle" | "running" | "success" | "error"
  >("idle");

  const handleSubmit = async () => {
    const cleanClaim = claim.trim();

    if (!cleanClaim || isVerifying) return;

    setSubmittedClaim(cleanClaim);
    setRecord(null);
    setError(null);
    setIsVerifying(true);
    setVerificationState("running");

    // Keep the cinematic council animation running
    // while the real backend performs verification.
    run();

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/verify`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            claim: cleanClaim,
          }),
        }
      );

      const data =
        (await response.json()) as BackendResponse;

      if (!response.ok || !data.success || !data.result) {
        throw new Error(
          data.error ?? "VERITAS verification failed."
        );
      }

      const liveRecord =
        buildRecordFromBackend(data.result);

      setRecord(liveRecord);
      setVerificationState("success");
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Unable to connect to the VERITAS backend.";

      setError(message);
      setVerificationState("error");
    } finally {
      setIsVerifying(false);
    }
  };

  const processing =
    verificationState === "running";

  return (
    <div className="verify-page relative z-10">
      <section className="mx-auto max-w-7xl px-6 md:px-10 pt-14 md:pt-20 pb-10">
        <div className="verify-kicker font-mono text-xs text-copper mb-6">
          verification chamber / live council
        </div>

        <h1 className="font-display text-5xl md:text-7xl leading-[0.95] text-ivory max-w-3xl">
          Bring a claim to the council.
        </h1>

        <p className="mt-6 max-w-xl text-ivory-dim text-sm leading-relaxed">
          State something you want checked. VERITAS sends the
          claim to the live multi-agent backend for independent
          reasoning, analysis, challenge, evidence verification,
          contradiction detection, and final judgment.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-6 md:px-10 pb-10">
        <div className="verify-form max-w-3xl">
          <ClaimForm
            claim={claim}
            onChange={setClaim}
            onSubmit={handleSubmit}
            disabled={processing}
          />
        </div>

        {error && (
          <div className="mt-6 max-w-3xl border border-coral/40 px-4 py-4 text-sm text-coral">
            <p className="font-mono text-[10px] tracking-[0.18em] mb-2">
              VERIFICATION UNAVAILABLE
            </p>

            <p>
              The AI verification service is temporarily
              unavailable. Please try again after the service
              becomes available.
            </p>
          </div>
        )}
      </section>

      {verificationState !== "idle" && (
        <>
          <section className="verify-chamber-wrap mx-auto max-w-[1440px] px-0 md:px-6">
            <div className="verify-chamber relative min-h-[540px] md:min-h-[700px] overflow-hidden">
              <CouncilChamber agents={agents} variant="full" />

              <div className="verify-chamber-label absolute left-6 top-6 md:left-10 md:top-8 font-mono text-[10px] text-ivory-dim/60 tracking-[0.18em]">
                COUNCIL / 08 NODES /{" "}
                {verificationState === "running"
                  ? "PROCESSING"
                  : verificationState === "success"
                    ? "SESSION COMPLETE"
                    : "VERIFICATION FAILED"}
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
  <div className="mt-5">
    <span className="inline-flex items-center border border-chamber-line px-3 py-1 font-mono text-[10px] tracking-[0.16em] text-copper">
      CLAIM TYPE · {record.type.toUpperCase()}
    </span>
  </div>
)}

{processing && !record && (
              <div className="mt-12 font-mono text-xs text-copper tracking-[0.16em]">
                VERITAS COUNCIL IS ANALYZING THE CLAIM...
              </div>
            )}

            {record && (
              <div className="verify-verdict mt-12 md:mt-16 grid md:grid-cols-[1fr_auto] gap-8 md:gap-16 items-end">
                <div>
                  <p className="font-mono text-[10px] text-ivory-dim/60 tracking-[0.2em] mb-3">
                    VERDICT
                  </p>

                  <div
                    className={`verify-verdict-word font-display text-7xl sm:text-8xl md:text-[10rem] leading-[0.78] ${VERDICT_TEXT[record.verdict]}`}
                  >
                    {record.verdict === "contradicted"
                      ? "REFUTED"
                      : record.verdict === "inconclusive"
                        ? "UNCERTAIN"
                        : "SUPPORTED"}
                  </div>
                </div>

                <div className="verify-confidence md:text-right">
                  <p className="font-mono text-[10px] text-ivory-dim/60 tracking-[0.2em]">
                    CONFIDENCE
                  </p>

                  <p
                    className={`font-display text-6xl md:text-8xl leading-none mt-2 ${VERDICT_TEXT[record.verdict]}`}
                  >
                    {Math.round(record.confidence * 100)}
                    <span className="text-3xl md:text-5xl">
                      %
                    </span>
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      navigate("/report/live", {
                        state: { record },
                      })
                    }
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