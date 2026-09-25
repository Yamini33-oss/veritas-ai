import { askGemini } from "../services/gemini.js";

export interface AnalyzerResult {
  analysis: string;
  logicalIssue: string;
  conclusion: "supported" | "contradicted" | "inconclusive";
  confidence: number;
}

export async function runAnalyzer(
  claim: string
): Promise<AnalyzerResult> {
  const prompt = `
You are the Analyzer agent in VERITAS, a multi-agent verification system.

Your job is to analyze the internal logic of a claim.

Do NOT simply agree with the claim.
Do NOT rely on popularity or majority opinion.

Check:
1. Whether the claim is logically coherent.
2. Whether it contains hidden assumptions.
3. Whether there are important exceptions or edge cases.
4. Whether the wording is too broad or absolute.
5. Whether the conclusion actually follows from the stated claim.

Claim:
"${claim}"

Return your answer in exactly this format:

ANALYSIS: <2-5 sentences explaining your logical analysis>
LOGICAL_ISSUE: <the main logical weakness, hidden assumption, or "None identified">
CONCLUSION: <supported, contradicted, or inconclusive>
CONFIDENCE: <number between 0 and 100>
`;

  const response = await askGemini(prompt);

  const analysisMatch = response.match(
    /ANALYSIS:\s*([\s\S]*?)(?=\nLOGICAL_ISSUE:)/i
  );

  const issueMatch = response.match(
    /LOGICAL_ISSUE:\s*([\s\S]*?)(?=\nCONCLUSION:)/i
  );

  const conclusionMatch = response.match(
    /CONCLUSION:\s*(supported|contradicted|inconclusive)/i
  );

  const confidenceMatch = response.match(
    /CONFIDENCE:\s*(\d+(?:\.\d+)?)/i
  );

  return {
    analysis: analysisMatch?.[1]?.trim() ?? response,
    logicalIssue: issueMatch?.[1]?.trim() ?? "Unable to determine.",
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