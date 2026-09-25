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
  reasoner: "Generated independent conclusion.",
  researcher: "Gathering supporting sources.",
  analyzer: "Found edge case.",
  critic: "Challenging preliminary conclusion.",
  "evidence-verifier": "Evaluating supporting evidence.",
  "contradiction-detector": "Conflict detected.",
  judge: "Reviewing all findings.",
};

/** Shown as currentTask once an agent reaches COMPLETED. */
export const COMPLETED_TASK: Record<AgentRole, string> = {
  orchestrator: "Session handed to the council.",
  reasoner: "Independent conclusion filed.",
  researcher: "Sources compiled.",
  analyzer: "Analysis complete.",
  critic: "Challenge filed.",
  "evidence-verifier": "Evidence cross-checked.",
  "contradiction-detector": "Conflicts flagged for re-analysis.",
  judge: "Verdict delivered.",
};

export const WAITING_TASK = "Standing by.";
