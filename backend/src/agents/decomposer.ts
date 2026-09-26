import { askGemini } from "../services/gemini.js";

export interface DecomposerResult {
  isComplex: boolean;
  subclaims: string[];
  reasoning: string;
}

export async function runDecomposer(
  claim: string
): Promise<DecomposerResult> {
  const prompt = `
You are the Claim Decomposer agent in VERITAS, a multi-agent claim verification system.

Your job is to determine whether the user's claim contains multiple independently testable factual assertions.

Rules:
- If the claim contains multiple factual assertions, split it into separate atomic subclaims.
- Each subclaim must be independently verifiable.
- Preserve important conditions, comparisons, quantities, time periods, and context from the original claim.
- Do not change the meaning of the original claim.
- Do not invent information.
- Do not explain whether the claim is true or false.
- If the claim is already a single simple factual assertion, return it as one subclaim.
- Return between 1 and 5 subclaims.
- Make each subclaim a complete sentence.

Original claim:
"${claim}"

Return EXACTLY this format:

IS_COMPLEX: <true or false>

SUBCLAIMS:
1. <subclaim>
2. <subclaim>
3. <subclaim>

REASONING: <one short sentence explaining why the claim was or was not decomposed>
`;

  const result = await askGemini(prompt);

  const isComplexMatch = result.match(
    /IS_COMPLEX:\s*(true|false)/i
  );

  const reasoningMatch = result.match(
    /REASONING:\s*([\s\S]*)$/i
  );

  const subclaimsSectionMatch = result.match(
    /SUBCLAIMS:\s*([\s\S]*?)(?=\nREASONING:)/i
  );

  const subclaims: string[] = [];

  if (subclaimsSectionMatch) {
    const lines = subclaimsSectionMatch[1]
      .split("\n")
      .map((line) =>
        line
          .trim()
          .replace(/^\d+\.\s*/, "")
      )
      .filter(Boolean);

    for (const line of lines) {
      if (!subclaims.includes(line)) {
        subclaims.push(line);
      }
    }
  }

  // Safety fallback:
  // If the model fails to return the expected format,
  // keep the original claim as one subclaim.
  if (subclaims.length === 0) {
    subclaims.push(claim);
  }

  return {
    isComplex:
      isComplexMatch?.[1]?.toLowerCase() === "true" ||
      subclaims.length > 1,

    subclaims: subclaims.slice(0, 5),

    reasoning:
      reasoningMatch?.[1]?.trim() ??
      "The claim was treated as a single independently testable statement.",
  };
}