import { AGENTS } from "../data/agents";
import { SIMULATION_ORDER } from "../data/simulation";
import type { Verdict, VerificationRecord } from "../types/verification";

function agent(id: string) {
  return AGENTS.find((a) => a.id === id)!;
}

/** Deterministic from the claim's own length — no randomness, same input
 *  always produces the same demo result. */
export function buildLiveRecord(claim: string, date: string): VerificationRecord {
  const length = claim.trim().length || 1;
  const mod = length % 3;
  const verdict: Verdict = mod === 0 ? "supported" : mod === 1 ? "contradicted" : "inconclusive";
  const confidence = Math.round((0.58 + (length % 18) / 100) * 100) / 100;

  const reasoner = agent("reasoner");
  const researcher = agent("researcher");
  const critic = agent("critic");
  const contradictionDetector = agent("contradiction-detector");

  const judgeNote =
    verdict === "supported"
      ? "The claim holds up across independent reasoning, sourced evidence and the Critic's challenge."
      : verdict === "contradicted"
        ? "The claim does not hold up once evidence and the Critic's challenge are weighed together."
        : "The council found reasonable support on both sides — treated as inconclusive rather than forcing a verdict.";

  return {
    id: "live",
    date,
    type: "Factual",
    claim,
    verdict,
    confidence,
    agentsUsed: SIMULATION_ORDER,
    contradictions: [contradictionDetector.exampleFinding],
    findings: [
      { agentId: "reasoner", note: reasoner.exampleFinding, confidence: reasoner.confidence ?? 0.7 },
      { agentId: "researcher", note: researcher.exampleFinding, confidence: researcher.confidence ?? 0.7 },
      { agentId: "critic", note: critic.exampleFinding, confidence: critic.confidence ?? 0.5 },
      { agentId: "judge", note: judgeNote, confidence },
    ],
  };
}
