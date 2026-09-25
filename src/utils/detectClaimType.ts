import type { VerificationType } from "../types/verification";

export function detectClaimType(
  claim: string
): VerificationType {
  const text = claim.toLowerCase();

  const policyKeywords = [
    "government",
    "law",
    "policy",
    "regulation",
    "ban",
    "tax",
    "election",
    "minister",
    "parliament",
    "legislation",
    "should",
    "must",
  ];

  const historicalKeywords = [
    "in ",
    "year",
    "century",
    "war",
    "empire",
    "king",
    "queen",
    "president",
    "founded",
    "established",
    "independence",
    "history",
  ];

  const scientificKeywords = [
    "scientific",
    "science",
    "chemical",
    "physics",
    "biology",
    "species",
    "planet",
    "earth",
    "climate",
    "temperature",
    "medicine",
    "health",
    "dna",
    "cell",
    "energy",
    "gravity",
    "water",
    "oxygen",
    "carbon",
  ];

  const statisticalKeywords = [
    "%",
    "percent",
    "percentage",
    "average",
    "median",
    "mean",
    "rate",
    "ratio",
    "population",
    "million",
    "billion",
    "number of",
    "amount of",
    "statistics",
    "adoption",
    "growth",
    "decline",
  ];

  if (
    policyKeywords.some((keyword) =>
      text.includes(keyword)
    )
  ) {
    return "Policy";
  }

  if (
    historicalKeywords.some((keyword) =>
      text.includes(keyword)
    )
  ) {
    return "Historical";
  }

  if (
    statisticalKeywords.some((keyword) =>
      text.includes(keyword)
    )
  ) {
    return "Statistical";
  }

  if (
    scientificKeywords.some((keyword) =>
      text.includes(keyword)
    )
  ) {
    return "Scientific";
  }

  return "Factual";
}