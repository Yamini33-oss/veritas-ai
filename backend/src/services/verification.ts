import { runReasoner } from "../agents/reasoner.js";
import { runResearcher } from "../agents/researcher.js";
import { runAnalyzer } from "../agents/analyzer.js";
import { runCritic } from "../agents/critic.js";
import { runEvidenceVerifier } from "../agents/evidenceVerifier.js";
import { runContradictionDetector } from "../agents/contradictionDetector.js";
import { runJudge } from "../agents/judge.js";

export interface VerificationPipelineResult {
  claim: string;

  agents: {
    reasoner: Awaited<ReturnType<typeof runReasoner>>;
    researcher: Awaited<ReturnType<typeof runResearcher>>;
    analyzer: Awaited<ReturnType<typeof runAnalyzer>>;
    critic: Awaited<ReturnType<typeof runCritic>>;
    evidenceVerifier: Awaited<ReturnType<typeof runEvidenceVerifier>>;
    contradictionDetector: Awaited<
      ReturnType<typeof runContradictionDetector>
    >;
    judge: Awaited<ReturnType<typeof runJudge>>;
  };

  finalVerdict: "supported" | "contradicted" | "inconclusive";
  confidence: number;
}

export async function runVerificationPipeline(
  claim: string
): Promise<VerificationPipelineResult> {
  // --------------------------------------------------
  // STEP 1: Independent reasoning
  // --------------------------------------------------

  const reasonerResult = await runReasoner(claim);

  // --------------------------------------------------
  // STEP 2: Research
  // --------------------------------------------------

  const researcherResult = await runResearcher(claim);

  // --------------------------------------------------
  // STEP 3: Logical analysis
  // --------------------------------------------------

  const analyzerResult = await runAnalyzer(claim);

  // --------------------------------------------------
  // STEP 4: Critic challenges the first findings
  // --------------------------------------------------

  const criticResult = await runCritic(
    claim,
    reasonerResult,
    researcherResult,
    analyzerResult
  );

  // --------------------------------------------------
  // STEP 5: Verify the researcher's evidence
  // --------------------------------------------------

  const evidenceVerifierResult = await runEvidenceVerifier(
    claim,
    researcherResult
  );

  // --------------------------------------------------
  // STEP 6: Look for contradictions
  // --------------------------------------------------

  const contradictionResult = await runContradictionDetector(
    claim,
    reasonerResult,
    researcherResult,
    analyzerResult,
    criticResult,
    evidenceVerifierResult
  );

  // --------------------------------------------------
  // STEP 7: Judge makes the final decision
  // --------------------------------------------------

  const judgeResult = await runJudge(
    claim,
    reasonerResult,
    researcherResult,
    analyzerResult,
    criticResult,
    evidenceVerifierResult,
    contradictionResult
  );

  // --------------------------------------------------
  // FINAL RESULT
  // --------------------------------------------------

  return {
    claim,

    agents: {
      reasoner: reasonerResult,
      researcher: researcherResult,
      analyzer: analyzerResult,
      critic: criticResult,
      evidenceVerifier: evidenceVerifierResult,
      contradictionDetector: contradictionResult,
      judge: judgeResult,
    },

    finalVerdict: judgeResult.verdict,
    confidence: judgeResult.confidence,
  };
}