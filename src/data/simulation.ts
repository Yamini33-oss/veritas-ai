import type { AgentRole } from "../types/agent";

export const SIMULATION_ORDER: AgentRole[] = [
  "orchestrator",
  "reasoner",
  "researcher",
  "analyzer",
  "critic",
  "evidence-verifier",
  "contradiction-detector",
  "judge",
];

/** Logged to the activity feed, and shown as currentTask, while an agent is RUNNING. */
export const RUNNING_ACTION: Record<AgentRole, string> = {
  orchestrator: "Verification initialized.",
  reasoner: "Performing independent reasoning.",
  researcher: "Investigating relevant evidence.",
  analyzer: "Analyzing logic and edge cases.",
  critic: "Challenging preliminary findings.",
  "evidence-verifier": "Evaluating supporting evidence.",
  "contradiction-detector": "Checking for conflicting findings.",
  judge: "Reviewing all findings.",
};

/** Shown as currentTask once an agent reaches COMPLETED. */
export const COMPLETED_TASK: Record<AgentRole, string> = {
  orchestrator: "Council workflow initialized.",
  reasoner: "Independent reasoning complete.",
  researcher: "Research stage complete.",
  analyzer: "Analysis complete.",
  critic: "Critical review complete.",
  "evidence-verifier": "Evidence cross-check complete.",
  "contradiction-detector": "Contradiction check complete.",
  judge: "Final verdict delivered.",
};

export const WAITING_TASK = "Standing by.";