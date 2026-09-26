import { runDecomposer } from "../agents/decomposer.js";
import { runSubclaimVerifier } from "../agents/subclaimVerifier.js";
import { runReasoner } from "../agents/reasoner.js";
import { runResearcher } from "../agents/researcher.js";
import { runAnalyzer } from "../agents/analyzer.js";
import { runCritic } from "../agents/critic.js";
import { runEvidenceVerifier } from "../agents/evidenceVerifier.js";
import { runContradictionDetector } from "../agents/contradictionDetector.js";
import { runJudge } from "../agents/judge.js";

export interface VerificationPipelineResult {
  claim: string;

  decomposition: Awaited<
    ReturnType<typeof runDecomposer>
  >;

  subclaimResults: Awaited<
    ReturnType<typeof runSubclaimVerifier>
  >[];

  agents: {
    reasoner: Awaited<ReturnType<typeof runReasoner>>;
    researcher: Awaited<ReturnType<typeof runResearcher>>;
    analyzer: Awaited<ReturnType<typeof runAnalyzer>>;
    critic: Awaited<ReturnType<typeof runCritic>>;
    evidenceVerifier: Awaited<
      ReturnType<typeof runEvidenceVerifier>
    >;
    contradictionDetector: Awaited<
      ReturnType<typeof runContradictionDetector>
    >;
    judge: Awaited<ReturnType<typeof runJudge>>;
  };

  finalVerdict:
    | "supported"
    | "contradicted"
    | "inconclusive";

  confidence: number;
}

export async function runVerificationPipeline(
  claim: string
): Promise<VerificationPipelineResult> {
  // --------------------------------------------------
  // STEP 0: Decompose the claim
  // --------------------------------------------------

  const decompositionResult =
    await runDecomposer(claim);

  // --------------------------------------------------
  // STEP 1: Verify individual subclaims
  //
  // Only run separate subclaim verification when the
  // original claim actually contains multiple claims.
  // --------------------------------------------------

  let subclaimResults: Awaited<
    ReturnType<typeof runSubclaimVerifier>
  >[] = [];

  if (decompositionResult.isComplex) {
    for (const subclaim of decompositionResult.subclaims) {
      try {
        const result =
          await runSubclaimVerifier(subclaim);

        subclaimResults.push(result);
      } catch (error) {
        console.error(
          `Subclaim verification failed for "${subclaim}":`,
          error
        );

        subclaimResults.push({
          subclaim,
          verdict: "inconclusive",
          explanation:
            "The subclaim verifier was temporarily unavailable.",
          keyFactors: [
            "Independent subclaim verification could not be completed.",
          ],
          confidence: 0,
        });
      }
    }
  } else {
    // For a simple claim, we do not spend another Gemini
    // request on a duplicate verification.
    subclaimResults = [];
  }

  // --------------------------------------------------
  // STEP 2: Independent reasoning
  // --------------------------------------------------

  const reasonerResult = await runReasoner(claim);

  // --------------------------------------------------
  // STEP 3: Research
  // --------------------------------------------------

  const researcherResult = await runResearcher(claim);

  // --------------------------------------------------
  // STEP 4: Logical analysis
  // --------------------------------------------------

  const analyzerResult = await runAnalyzer(claim);

  // --------------------------------------------------
  // STEP 5: Critic challenges the first findings
  // --------------------------------------------------

  const criticResult = await runCritic(
    claim,
    reasonerResult,
    researcherResult,
    analyzerResult
  );

  // --------------------------------------------------
  // STEP 6: Verify the researcher's evidence
  // --------------------------------------------------

  const evidenceVerifierResult =
    await runEvidenceVerifier(
      claim,
      researcherResult
    );

  // --------------------------------------------------
  // STEP 7: Look for contradictions
  // --------------------------------------------------

  const contradictionResult =
    await runContradictionDetector(
      claim,
      reasonerResult,
      researcherResult,
      analyzerResult,
      criticResult,
      evidenceVerifierResult
    );

  // --------------------------------------------------
  // STEP 8: Judge makes the final decision
  // --------------------------------------------------

  const judgeResult = await runJudge(
    claim,
    reasonerResult,
    researcherResult,
    analyzerResult,
    criticResult,
    evidenceVerifierResult,
    contradictionResult,
    subclaimResults
  );

  // --------------------------------------------------
  // FINAL RESULT
  // --------------------------------------------------

  return {
    claim,

    decomposition: decompositionResult,

    subclaimResults,

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