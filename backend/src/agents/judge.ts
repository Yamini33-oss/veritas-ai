import { askGemini } from "../services/gemini.js";

export interface JudgeResult {
  verdict: "supported" | "contradicted" | "inconclusive";
  finalReasoning: string;
  confidence: number;
  keySupportingFindings: string[];
  keyConcerns: string[];
  contradictionsResolved: boolean;
}

export async function runJudge(
  claim: string,
  reasonerResult: unknown,
  researcherResult: unknown,
  analyzerResult: unknown,
  criticResult: unknown,
  evidenceVerifierResult: unknown,
  contradictionResult: unknown
): Promise<JudgeResult> {
  const prompt = `
You are the JUDGE agent in VERITAS, a multi-agent reasoning and verification system.

Your job is to make the final evidence-based judgment about the claim after reviewing ALL previous agents.

You must NOT simply count votes.

Evaluate:
1. The Reasoner's independent reasoning.
2. The Researcher's evidence.
3. The Analyzer's logical analysis.
4. The Critic's challenges.
5. The Evidence Verifier's assessment of evidence quality.
6. The Contradiction Detector's findings.

IMPORTANT:
- Strong evidence should matter more than unsupported assertions.
- A minor ambiguity does not automatically make a claim false.
- A genuine contradiction must be considered seriously.
- If the evidence is insufficient or unresolved contradictions remain, use "inconclusive".
- Do not invent evidence that is not present in the agent results.

CLAIM:
"${claim}"

REASONER RESULT:
${JSON.stringify(reasonerResult, null, 2)}

RESEARCHER RESULT:
${JSON.stringify(researcherResult, null, 2)}

ANALYZER RESULT:
${JSON.stringify(analyzerResult, null, 2)}

CRITIC RESULT:
${JSON.stringify(criticResult, null, 2)}

EVIDENCE VERIFIER RESULT:
${JSON.stringify(evidenceVerifierResult, null, 2)}

CONTRADICTION DETECTOR RESULT:
${JSON.stringify(contradictionResult, null, 2)}

Return your answer in exactly this format:

VERDICT: <supported, contradicted, or inconclusive>

FINAL_REASONING:
<3-6 sentences explaining how the evidence and agent findings led to the final verdict>

CONFIDENCE: <number between 0 and 100>

KEY_SUPPORTING_FINDINGS:
- <important supporting finding>
- <another important supporting finding>

KEY_CONCERNS:
- <important concern>
- <another concern, or "None identified">

CONTRADICTIONS_RESOLVED: <true or false>
`;

  const response = await askGemini(prompt);

  const verdictMatch = response.match(
    /VERDICT:\s*(supported|contradicted|inconclusive)/i
  );

  const reasoningMatch = response.match(
    /FINAL_REASONING:\s*([\s\S]*?)(?=\nCONFIDENCE:)/i
  );

  const confidenceMatch = response.match(
    /CONFIDENCE:\s*(\d+(?:\.\d+)?)/i
  );

  const supportingMatch = response.match(
    /KEY_SUPPORTING_FINDINGS:\s*([\s\S]*?)(?=\nKEY_CONCERNS:)/i
  );

  const concernsMatch = response.match(
    /KEY_CONCERNS:\s*([\s\S]*?)(?=\nCONTRADICTIONS_RESOLVED:)/i
  );

  const resolvedMatch = response.match(
    /CONTRADICTIONS_RESOLVED:\s*(true|false)/i
  );

  const parseList = (text: string | undefined): string[] => {
    if (!text) return [];

    return text
      .split("\n")
      .map((line) => line.replace(/^[-*]\s*/, "").trim())
      .filter(Boolean)
      .filter(
        (line) =>
          !line.toLowerCase().startsWith("none identified")
      );
  };

  return {
    verdict:
      (verdictMatch?.[1]?.toLowerCase() as
        | "supported"
        | "contradicted"
        | "inconclusive") ?? "inconclusive",

    finalReasoning:
      reasoningMatch?.[1]?.trim() ?? response,

    confidence: confidenceMatch
      ? Number(confidenceMatch[1]) / 100
      : 0.5,

    keySupportingFindings: parseList(
      supportingMatch?.[1]
    ),

    keyConcerns: parseList(
      concernsMatch?.[1]
    ),

    contradictionsResolved:
      resolvedMatch?.[1]?.toLowerCase() === "true",
  };
}