import { askGemini } from "../services/gemini.js";

export interface SubclaimVerifierResult {
  subclaim: string;
  verdict: "supported" | "contradicted" | "inconclusive";
  explanation: string;
  keyFactors: string[];
  confidence: number;
}

export async function runSubclaimVerifier(
  subclaim: string
): Promise<SubclaimVerifierResult> {
  const prompt = `
You are the SUBCLAIM VERIFIER agent in VERITAS.

Your job is to independently assess ONE atomic factual subclaim.

Do not evaluate any larger claim.
Do not invent sources, URLs, studies, statistics, quotations, or retrieved evidence.
Use general model knowledge and reasoning only.
Be careful with absolute wording, hidden assumptions, and context.
If the answer depends on important conditions, use "inconclusive" rather than forcing a binary answer.

SUBCLAIM:
"${subclaim}"

Return EXACTLY this format:

VERDICT: <supported, contradicted, or inconclusive>

EXPLANATION:
<2-4 sentences explaining why>

KEY_FACTORS:
- <important factor>
- <another important factor>
- <another factor if needed>

CONFIDENCE: <number between 0 and 100>
`;

  const response = await askGemini(prompt);

  const verdictMatch = response.match(
    /VERDICT:\s*(supported|contradicted|inconclusive)/i
  );

  const explanationMatch = response.match(
    /EXPLANATION:\s*([\s\S]*?)(?=\nKEY_FACTORS:)/i
  );

  const factorsMatch = response.match(
    /KEY_FACTORS:\s*([\s\S]*?)(?=\nCONFIDENCE:)/i
  );

  const confidenceMatch = response.match(
    /CONFIDENCE:\s*(\d+(?:\.\d+)?)/i
  );

  const keyFactors = factorsMatch?.[1]
    ? factorsMatch[1]
        .split("\n")
        .map((line) =>
          line.replace(/^[-*]\s*/, "").trim()
        )
        .filter(Boolean)
    : [];

  return {
    subclaim,

    verdict:
      (verdictMatch?.[1]?.toLowerCase() as
        | "supported"
        | "contradicted"
        | "inconclusive") ??
      "inconclusive",

    explanation:
      explanationMatch?.[1]?.trim() ??
      response,

    keyFactors,

    confidence: confidenceMatch
      ? Number(confidenceMatch[1]) / 100
      : 0.5,
  };
}