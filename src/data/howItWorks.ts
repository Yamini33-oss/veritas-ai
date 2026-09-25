import type { AgentRole } from "../types/agent";

export interface PipelineStage {
  n: string;
  title: string;
  description: string;
  agentIds: AgentRole[];
}

export const PIPELINE_STAGES: PipelineStage[] = [
  {
    n: "01",
    title: "Submit",
    description:
      "You state a claim in plain language. No formatting or evidence required up front — the council does that work.",
    agentIds: [],
  },
  {
    n: "02",
    title: "Orchestrate",
    description:
      "The Orchestrator opens a session, briefs the council on the claim, and sequences who runs next.",
    agentIds: ["orchestrator"],
  },
  {
    n: "03",
    title: "Independent Reasoning",
    description:
      "The Reasoner builds a first-principles read on the claim before seeing any other agent's conclusion.",
    agentIds: ["reasoner"],
  },
  {
    n: "04",
    title: "Research & Evidence",
    description:
      "The Researcher locates primary sources; the Evidence Verifier checks that they actually support the claim.",
    agentIds: ["researcher", "evidence-verifier"],
  },
  {
    n: "05",
    title: "Technical Analysis",
    description:
      "The Analyzer tests the reasoning chain for structural weaknesses and edge cases that don't generalize.",
    agentIds: ["analyzer"],
  },
  {
    n: "06",
    title: "Critic Challenge",
    description:
      "The Critic actively argues against the Reasoner's position — it does not simply agree with the majority.",
    agentIds: ["critic"],
  },
  {
    n: "07",
    title: "Contradiction Detection",
    description:
      "The Contradiction Detector scans every agent's output for direct conflicts and flags them for re-analysis.",
    agentIds: ["contradiction-detector"],
  },
  {
    n: "08",
    title: "Judge & Final Verdict",
    description:
      "The Judge weighs every finding on its merits — not a vote count — and produces the final, confidence-weighted report.",
    agentIds: ["judge"],
  },
];
