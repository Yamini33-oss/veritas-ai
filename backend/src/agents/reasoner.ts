import { askGemini } from "../services/gemini.js";

export interface ReasonerResult {
  conclusion: string;
  reasoning: string;
  confidence: number;
}

export async function runReasoner(
  claim: string
): Promise<ReasonerResult> {
  const prompt = `
You are the Reasoner agent in VERITAS, a multi-agent verification system.

Your job is to independently analyze a claim using first-principles reasoning.

Do NOT rely on what other agents think.
Do NOT simply agree with the claim.
Explain the reasoning clearly.
Identify important assumptions or uncertainty.

Claim:
"${claim}"

Return your answer in exactly this format:

CONCLUSION: <supported, contradicted, or inconclusive>
REASONING: <clear explanation in 2-4 sentences>
CONFIDENCE: <number between 0 and 100>
`;

  const response = await askGemini(prompt);

  const conclusionMatch = response.match(
    /CONCLUSION:\s*(supported|contradicted|inconclusive)/i
  );

  const reasoningMatch = response.match(
    /REASONING:\s*([\s\S]*?)(?=\nCONFIDENCE:)/i
  );

  const confidenceMatch = response.match(
    /CONFIDENCE:\s*(\d+(?:\.\d+)?)/i
  );

  return {
    conclusion: conclusionMatch?.[1]?.toLowerCase() ?? "inconclusive",
    reasoning: reasoningMatch?.[1]?.trim() ?? response,
    confidence: confidenceMatch
      ? Number(confidenceMatch[1]) / 100
      : 0.5,
  };
}