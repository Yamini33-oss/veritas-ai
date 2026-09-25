import { askGemini } from "../services/gemini.js";

export interface CriticResult {
  challenge: string;
  weaknesses: string[];
  conclusion: "supported" | "contradicted" | "inconclusive";
  confidence: number;
}

export async function runCritic(
  claim: string,
  reasonerResult: unknown,
  researcherResult: unknown,
  analyzerResult: unknown
): Promise<CriticResult> {
  const prompt = `
You are the Critic agent in VERITAS, a multi-agent verification system.

Your job is to CHALLENGE the work of the other agents.

Do not simply agree with them.
Look specifically for:
1. Unsupported assumptions.
2. Weak or incomplete reasoning.
3. Evidence that does not actually prove the claim.
4. Logical gaps.
5. Exceptions or alternative interpretations.
6. Conflicts between the agents.

CLAIM:
"${claim}"

REASONER FINDING:
${JSON.stringify(reasonerResult, null, 2)}

RESEARCHER FINDING:
${JSON.stringify(researcherResult, null, 2)}

ANALYZER FINDING:
${JSON.stringify(analyzerResult, null, 2)}

Return your answer in exactly this format:

CHALLENGE: <2-5 sentences explaining what the other agents may have missed>
WEAKNESSES:
- <weakness 1>
- <weakness 2>
CONCLUSION: <supported, contradicted, or inconclusive>
CONFIDENCE: <number between 0 and 100>
`;

  const response = await askGemini(prompt);

  const challengeMatch = response.match(
    /CHALLENGE:\s*([\s\S]*?)(?=\nWEAKNESSES:)/i
  );

  const weaknessesMatch = response.match(
    /WEAKNESSES:\s*([\s\S]*?)(?=\nCONCLUSION:)/i
  );

  const conclusionMatch = response.match(
    /CONCLUSION:\s*(supported|contradicted|inconclusive)/i
  );

  const confidenceMatch = response.match(
    /CONFIDENCE:\s*(\d+(?:\.\d+)?)/i
  );

  const weaknesses = weaknessesMatch?.[1]
    ?.split("\n")
    .map((line) => line.replace(/^[-*]\s*/, "").trim())
    .filter(Boolean) ?? [];

  return {
    challenge: challengeMatch?.[1]?.trim() ?? response,
    weaknesses,
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