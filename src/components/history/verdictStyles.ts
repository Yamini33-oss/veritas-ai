import type { Verdict } from "../../types/verification";

export const VERDICT_TEXT: Record<Verdict, string> = {
  supported: "text-amber",
  contradicted: "text-coral",
  inconclusive: "text-ivory-dim",
};

export const VERDICT_DOT: Record<Verdict, string> = {
  supported: "bg-amber",
  contradicted: "bg-coral",
  inconclusive: "bg-ivory-dim/50",
};
