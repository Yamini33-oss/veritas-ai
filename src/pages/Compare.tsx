import { useState } from "react";
import type { Verdict } from "../types/verification";
import { VERDICT_TEXT } from "../components/history/verdictStyles";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ?? "";

interface AgentResult {
  conclusion?: Verdict;
  confidence?: number;
  reasoning?: string;
  analysis?: string;
  evidence?: string;
  challenge?: string;
}

interface VerificationResponse {
  success: boolean;
  result?: {
    claim: string;
    finalVerdict: Verdict;
    confidence: number;
    agents: {
      reasoner: AgentResult;
      researcher: AgentResult;
      analyzer: AgentResult;
      critic: AgentResult;
      evidenceVerifier: AgentResult;
      contradictionDetector: AgentResult;
      judge: AgentResult;
    };
  };
  error?: string;
}

interface ComparisonResult {
  claim: string;
  finalVerdict: Verdict;
  confidence: number;
  agents: {
    reasoner: AgentResult;
    researcher: AgentResult;
    analyzer: AgentResult;
    critic: AgentResult;
    evidenceVerifier: AgentResult;
    contradictionDetector: AgentResult;
    judge: AgentResult;
  };
}

function verdictLabel(verdict: Verdict) {
  if (verdict === "contradicted") return "REFUTED";
  if (verdict === "inconclusive") return "UNCERTAIN";
  return "SUPPORTED";
}

function getVerdictClass(verdict: Verdict) {
  return VERDICT_TEXT[verdict];
}

export default function Compare() {
  const [claimA, setClaimA] = useState("");
  const [claimB, setClaimB] = useState("");

  const [resultA, setResultA] =
    useState<ComparisonResult | null>(null);

  const [resultB, setResultB] =
    useState<ComparisonResult | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const verifyClaim = async (
    claim: string
  ): Promise<ComparisonResult> => {
    const response = await fetch(
      `${API_BASE_URL}/api/verify`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ claim }),
      }
    );

    const data =
      (await response.json()) as VerificationResponse;

    if (!response.ok || !data.success || !data.result) {
      throw new Error(
        data.error ?? "Verification failed."
      );
    }

    return data.result;
  };

  const handleCompare = async () => {
    const cleanA = claimA.trim();
    const cleanB = claimB.trim();

    if (!cleanA || !cleanB || loading) return;

    setLoading(true);
    setError(null);
    setResultA(null);
    setResultB(null);

    try {
      // Run sequentially so we don't fire two large
      // multi-agent pipelines at the same time.
      const first = await verifyClaim(cleanA);
      setResultA(first);

      const second = await verifyClaim(cleanB);
      setResultB(second);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to compare the claims."
      );
    } finally {
      setLoading(false);
    }
  };

  const renderAgentSummary = (
    label: string,
    agent?: AgentResult
  ) => {
    if (!agent) return null;

    const confidence =
      typeof agent.confidence === "number"
        ? Math.round(agent.confidence * 100)
        : null;

    const conclusion = agent.conclusion;

    return (
      <div className="border-t border-chamber-line pt-3 mt-3">
        <div className="flex items-center justify-between gap-4">
          <span className="font-mono text-[10px] text-ivory-dim/60 tracking-wide">
            {label}
          </span>

          {confidence !== null && (
            <span className="font-mono text-[10px] text-copper">
              {confidence}%
            </span>
          )}
        </div>

        {conclusion && (
          <p
            className={`mt-1 font-mono text-[10px] ${getVerdictClass(
              conclusion
            )}`}
          >
            {verdictLabel(conclusion)}
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="relative z-10">
      <section className="mx-auto max-w-7xl px-6 md:px-10 pt-16 md:pt-20 pb-10">
        <p className="font-mono text-xs text-copper mb-6">
          comparative verification
        </p>

        <h1 className="font-display text-4xl md:text-6xl text-ivory max-w-3xl leading-tight">
          Put two claims before the council.
        </h1>

        <p className="mt-6 max-w-2xl text-ivory-dim text-sm leading-relaxed">
          Run two independent VERITAS investigations and compare
          their verdicts, confidence, and agent-level findings
          side by side.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-6 md:px-10 pb-14">
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="border border-chamber-line p-6">
            <p className="font-mono text-[10px] text-copper tracking-[0.16em] mb-4">
              CLAIM A
            </p>

            <textarea
              value={claimA}
              onChange={(event) =>
                setClaimA(event.target.value)
              }
              placeholder="Enter the first claim..."
              rows={6}
              className="w-full resize-none bg-transparent border border-chamber-line px-4 py-4 text-sm text-ivory placeholder:text-ivory-dim/40 outline-none focus:border-amber transition-colors"
            />
          </div>

          <div className="border border-chamber-line p-6">
            <p className="font-mono text-[10px] text-copper tracking-[0.16em] mb-4">
              CLAIM B
            </p>

            <textarea
              value={claimB}
              onChange={(event) =>
                setClaimB(event.target.value)
              }
              placeholder="Enter the second claim..."
              rows={6}
              className="w-full resize-none bg-transparent border border-chamber-line px-4 py-4 text-sm text-ivory placeholder:text-ivory-dim/40 outline-none focus:border-amber transition-colors"
            />
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={handleCompare}
            disabled={
              loading ||
              !claimA.trim() ||
              !claimB.trim()
            }
            className="px-8 py-3 border border-amber text-amber font-mono text-xs tracking-[0.16em] hover:bg-amber hover:text-black transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? "COMPARING..." : "COMPARE CLAIMS"}
          </button>
        </div>

        {error && (
          <div className="mt-8 max-w-3xl mx-auto border border-coral/40 px-4 py-4 text-sm text-coral">
            <p className="font-mono text-[10px] tracking-[0.18em] mb-2">
              COMPARISON UNAVAILABLE
            </p>
            <p>
              The verification service is temporarily
              unavailable. Please try again when the AI service
              is available.
            </p>
          </div>
        )}
      </section>

      {loading && (
        <section className="mx-auto max-w-7xl px-6 md:px-10 pb-12">
          <div className="border border-chamber-line p-6 text-center">
            <p className="font-mono text-xs text-copper tracking-[0.16em]">
              VERITAS IS RUNNING TWO COUNCIL INVESTIGATIONS
            </p>
            <p className="mt-3 text-sm text-ivory-dim">
              The first claim is being processed, followed by
              the second.
            </p>
          </div>
        </section>
      )}

      {(resultA || resultB) && (
        <section className="mx-auto max-w-7xl px-6 md:px-10 pb-24">
          <div className="grid lg:grid-cols-2 gap-8">
            {[resultA, resultB].map((result, index) => (
              <div
                key={index}
                className="border border-chamber-line p-6 md:p-8"
              >
                <p className="font-mono text-[10px] text-copper tracking-[0.16em] mb-4">
                  CLAIM {index === 0 ? "A" : "B"}
                </p>

                <p className="font-display text-2xl text-ivory leading-tight">
                  {result?.claim ??
                    (index === 0 ? claimA : claimB)}
                </p>

                {result ? (
                  <>
                    <div className="mt-8">
                      <p className="font-mono text-[10px] text-ivory-dim/50 tracking-[0.16em]">
                        FINAL VERDICT
                      </p>

                      <p
                        className={`font-display text-5xl md:text-6xl mt-2 ${getVerdictClass(
                          result.finalVerdict
                        )}`}
                      >
                        {verdictLabel(
                          result.finalVerdict
                        )}
                      </p>

                      <p className="mt-3 font-mono text-sm text-ivory-dim">
                        {Math.round(
                          result.confidence * 100
                        )}
                        % confidence
                      </p>
                    </div>

                    <div className="mt-8">
                      <p className="font-mono text-[10px] text-ivory-dim/50 tracking-[0.16em]">
                        AGENT COMPARISON
                      </p>

                      {renderAgentSummary(
                        "REASONER",
                        result.agents.reasoner
                      )}

                      {renderAgentSummary(
                        "RESEARCHER",
                        result.agents.researcher
                      )}

                      {renderAgentSummary(
                        "ANALYZER",
                        result.agents.analyzer
                      )}

                      {renderAgentSummary(
                        "CRITIC",
                        result.agents.critic
                      )}

                      {renderAgentSummary(
                        "EVIDENCE VERIFIER",
                        result.agents.evidenceVerifier
                      )}

                      {renderAgentSummary(
                        "CONTRADICTION DETECTOR",
                        result.agents.contradictionDetector
                      )}

                      {renderAgentSummary(
                        "JUDGE",
                        result.agents.judge
                      )}
                    </div>
                  </>
                ) : (
                  <p className="mt-8 font-mono text-xs text-ivory-dim/50">
                    Waiting for this claim...
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}