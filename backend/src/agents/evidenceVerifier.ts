import { askGemini } from "../services/gemini.js";

export interface EvidenceVerifierResult {
  verification: string;
  evidenceStrength: "strong" | "moderate" | "weak" | "insufficient";
  unsupportedClaims: string[];
  conclusion: "supported" | "contradicted" | "inconclusive";
  confidence: number;
}

export async function runEvidenceVerifier(
  claim: string,
  researcherResult: unknown
): Promise<EvidenceVerifierResult> {
  const prompt = `
You are the Evidence Verifier agent in VERITAS, a multi-agent verification system.

Your job is to determine whether the Researcher's evidence actually supports the claim.

Do NOT blindly trust the Researcher.

Check:
1. Does the evidence directly address the claim?
2. Do the stated sources logically support the evidence?
3. Is the evidence relevant to the exact wording of the claim?
4. Is there a difference between correlation and direct support?
5. Are there unsupported statements?
6. Is the evidence strong enough to justify the Researcher's conclusion?

CLAIM:
"${claim}"

RESEARCHER RESULT:
${JSON.stringify(researcherResult, null, 2)}

Return your answer in exactly this format:

VERIFICATION: <2-5 sentences explaining whether the evidence actually supports the claim>
EVIDENCE_STRENGTH: <strong, moderate, weak, or insufficient>
UNSUPPORTED_CLAIMS:
- <unsupported statement or "None identified">
CONCLUSION: <supported, contradicted, or inconclusive>
CONFIDENCE: <number between 0 and 100>
`;

  const response = await askGemini(prompt);

  const verificationMatch = response.match(
    /VERIFICATION:\s*([\s\S]*?)(?=\nEVIDENCE_STRENGTH:)/i
  );

  const strengthMatch = response.match(
    /EVIDENCE_STRENGTH:\s*(strong|moderate|weak|insufficient)/i
  );

  const unsupportedMatch = response.match(
    /UNSUPPORTED_CLAIMS:\s*([\s\S]*?)(?=\nCONCLUSION:)/i
  );

  const conclusionMatch = response.match(
    /CONCLUSION:\s*(supported|contradicted|inconclusive)/i
  );

  const confidenceMatch = response.match(
    /CONFIDENCE:\s*(\d+(?:\.\d+)?)/i
  );

  const unsupportedClaims =
    unsupportedMatch?.[1]
      ?.split("\n")
      .map((line) => line.replace(/^[-*]\s*/, "").trim())
      .filter(Boolean) ?? [];

  return {
    verification:
      verificationMatch?.[1]?.trim() ?? response,

    evidenceStrength:
      (strengthMatch?.[1]?.toLowerCase() as
        | "strong"
        | "moderate"
        | "weak"
        | "insufficient") ?? "insufficient",

    unsupportedClaims,

    conclusion:
      (conclusionMatch?.[1]?.toLowerCase() as
        | "supported"
        | "contradicted"
        | "inconclusive") ?? "inconclusive",

    confidence: confidenceMatch
      ? Number(confidenceMatch[1]) / 100
      : 0.5,
  };
}