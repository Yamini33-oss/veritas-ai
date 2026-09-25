import { askGemini } from "../services/gemini.js";

export interface ContradictionDetectorResult {
  hasContradiction: boolean;
  contradictions: string[];
  analysis: string;
  resolutionNeeded: boolean;
  confidence: number;
}

export async function runContradictionDetector(
  claim: string,
  reasonerResult: unknown,
  researcherResult: unknown,
  analyzerResult: unknown,
  criticResult: unknown,
  evidenceVerifierResult: unknown
): Promise<ContradictionDetectorResult> {
  const prompt = `
You are the Contradiction Detector agent in VERITAS.

Your job is to compare the findings of multiple verification agents.

Do NOT assume that different wording means contradiction.

A genuine contradiction exists when:
- One agent supports the claim while another directly rejects it.
- Two agents make logically incompatible conclusions.
- Evidence directly conflicts with another agent's evidence.
- One finding invalidates a key conclusion made by another agent.

A difference in emphasis, confidence, or explanation is NOT automatically a contradiction.

CLAIM:
"${claim}"

REASONER:
${JSON.stringify(reasonerResult, null, 2)}

RESEARCHER:
${JSON.stringify(researcherResult, null, 2)}

ANALYZER:
${JSON.stringify(analyzerResult, null, 2)}

CRITIC:
${JSON.stringify(criticResult, null, 2)}

EVIDENCE VERIFIER:
${JSON.stringify(evidenceVerifierResult, null, 2)}

Compare all findings carefully.

Return your answer in exactly this format:

HAS_CONTRADICTION: <true or false>

CONTRADICTIONS:
- <specific contradiction>
- <another contradiction, or "None identified">

ANALYSIS:
<2-5 sentences explaining whether the disagreements are genuine contradictions or merely differences in framing>

RESOLUTION_NEEDED: <true or false>

CONFIDENCE: <number between 0 and 100>
`;

  const response = await askGemini(prompt);

  const contradictionMatch = response.match(
    /HAS_CONTRADICTION:\s*(true|false)/i
  );

  const contradictionsMatch = response.match(
    /CONTRADICTIONS:\s*([\s\S]*?)(?=\nANALYSIS:)/i
  );

  const analysisMatch = response.match(
    /ANALYSIS:\s*([\s\S]*?)(?=\nRESOLUTION_NEEDED:)/i
  );

  const resolutionMatch = response.match(
    /RESOLUTION_NEEDED:\s*(true|false)/i
  );

  const confidenceMatch = response.match(
    /CONFIDENCE:\s*(\d+(?:\.\d+)?)/i
  );

  const contradictions =
    contradictionsMatch?.[1]
      ?.split("\n")
      .map((line) => line.replace(/^[-*]\s*/, "").trim())
      .filter(
        (line) =>
          line.length > 0 &&
          !line.toLowerCase().startsWith("none identified")
      ) ?? [];

  return {
    hasContradiction:
      contradictionMatch?.[1]?.toLowerCase() === "true",

    contradictions,

    analysis:
      analysisMatch?.[1]?.trim() ?? response,

    resolutionNeeded:
      resolutionMatch?.[1]?.toLowerCase() === "true",

    confidence: confidenceMatch
      ? Number(confidenceMatch[1]) / 100
      : 0.5,
  };
}