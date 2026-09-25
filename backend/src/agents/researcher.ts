import { askGeminiWithSearch } from "../services/gemini.js";

export interface ResearcherResult {
  evidence: string;
  sources: string[];
  support: "supported" | "contradicted" | "inconclusive";
  confidence: number;
  usedWebSearch: boolean;
}

export async function runResearcher(
  claim: string
): Promise<ResearcherResult> {
  const prompt = `
You are the Researcher agent in VERITAS, a multi-agent verification system.

Your job is to investigate the claim and identify factual evidence relevant to it.

Important:
- When web search is available, use it to investigate the claim.
- Prefer authoritative and primary sources when available.
- Look for evidence that supports AND challenges the claim when relevant.
- Do not invent URLs, studies, organizations, statistics, or quotations.
- Only describe live retrieved web evidence when web search was actually available.
- Clearly distinguish established facts from uncertainty.
- Do not make the final system verdict. Your job is evidence gathering and assessment.

Claim:
"${claim}"

Return your answer in exactly this format:

EVIDENCE: <2-5 sentences explaining what the available evidence establishes>

SUPPORT: <supported, contradicted, or inconclusive>

CONFIDENCE: <number between 0 and 100>
`;

  const result = await askGeminiWithSearch(prompt);

  const evidenceMatch = result.text.match(
    /EVIDENCE:\s*([\s\S]*?)(?=\nSUPPORT:)/i
  );

  const supportMatch = result.text.match(
    /SUPPORT:\s*(supported|contradicted|inconclusive)/i
  );

  const confidenceMatch = result.text.match(
    /CONFIDENCE:\s*(\d+(?:\.\d+)?)/i
  );

  const sources = result.sources.map(
    (source) => `${source.title} — ${source.url}`
  );

  return {
    evidence:
      evidenceMatch?.[1]?.trim() ?? result.text,

    sources,

    support:
      (supportMatch?.[1]?.toLowerCase() as
        | "supported"
        | "contradicted"
        | "inconclusive") ??
      "inconclusive",

    confidence: confidenceMatch
      ? Number(confidenceMatch[1]) / 100
      : 0.5,

    usedWebSearch: !result.usedFallback,
  };
}