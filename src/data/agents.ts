import type { Agent } from "../types/agent";

export const AGENTS: Agent[] = [
  {
    id: "orchestrator",
    name: "Orchestrator",
    shortLabel: "ORC",
    role: "Coordinates the workflow",
    description:
      "Routes the claim through the council, sequencing every other agent and holding the session together.",
    responsibilities: [
      "Opens the verification session and briefs every agent on the claim",
      "Sequences which agent runs next and passes context between them",
      "Escalates unresolved conflicts back through the council",
    ],
    exampleFinding:
      "Session opened. Claim routed to the Reasoner and Researcher in parallel.",
    status: "completed",
    confidence: null,
    currentTask: "Idle — session complete",
    sequence: 1,
  },
  {
    id: "reasoner",
    name: "Reasoner",
    shortLabel: "RSN",
    role: "Independent reasoning",
    description:
      "Builds a first-principles read on the claim before seeing what anyone else concludes.",
    responsibilities: [
      "Builds a first-principles read on the claim before seeing other agents' work",
      "States its reasoning chain explicitly, step by step",
      "Flags where its own conclusion is uncertain",
    ],
    exampleFinding:
      "The claim holds under direct reasoning, but rests on one unverified assumption.",
    status: "completed",
    confidence: 0.81,
    currentTask: "Idle — session complete",
    sequence: 2,
  },
  {
    id: "researcher",
    name: "Researcher",
    shortLabel: "RES",
    role: "Evidence & source investigation",
    description:
      "Goes out to find primary sources and surfaces what the wider record actually says.",
    responsibilities: [
      "Locates primary sources relevant to the claim",
      "Cross-references multiple independent sources",
      "Reports what the wider record says, not just what supports the claim",
    ],
    exampleFinding:
      "Three independent sources corroborate the core claim; one source is out of date.",
    status: "completed",
    confidence: 0.74,
    currentTask: "Idle — session complete",
    sequence: 3,
  },
  {
    id: "analyzer",
    name: "Analyzer",
    shortLabel: "ANL",
    role: "Technical & logical analysis",
    description:
      "Checks the internal logic of the claim and the reasoning chain for structural weak points.",
    responsibilities: [
      "Checks the internal logic of the claim for structural weaknesses",
      "Tests the reasoning chain against edge cases and exceptions",
      "Flags where the logic doesn't generalize",
    ],
    exampleFinding:
      "Logic holds in the general case but breaks down under one identified edge case.",
    status: "completed",
    confidence: 0.79,
    currentTask: "Idle — session complete",
    sequence: 4,
  },
  {
    id: "critic",
    name: "Critic",
    shortLabel: "CRT",
    role: "Challenges the reasoning",
    description:
      "Actively argues against the Reasoner's position and pressure-tests every weak assumption.",
    responsibilities: [
      "Actively argues against the Reasoner's position",
      "Pressure-tests every assumption for hidden weaknesses",
      "Refuses to simply agree with the majority",
    ],
    exampleFinding:
      "The Reasoner's conclusion understates a key risk that changes the overall verdict.",
    status: "warning",
    confidence: 0.42,
    currentTask: "Idle — session complete",
    sequence: 5,
  },
  {
    id: "evidence-verifier",
    name: "Evidence Verifier",
    shortLabel: "EVR",
    role: "Checks evidence against claims",
    description:
      "Confirms whether the evidence the Researcher found actually supports what's being claimed.",
    responsibilities: [
      "Confirms the evidence the Researcher found actually supports the claim",
      "Distinguishes correlation from direct support",
      "Scores how strongly each piece of evidence backs the claim",
    ],
    exampleFinding:
      "Two of four cited sources directly support the claim; the rest are only tangential.",
    status: "completed",
    confidence: 0.68,
    currentTask: "Idle — session complete",
    sequence: 6,
  },
  {
    id: "contradiction-detector",
    name: "Contradiction Detector",
    shortLabel: "CTD",
    role: "Finds disagreement between agents",
    description:
      "Scans every agent's output for outright conflicts and flags them for re-analysis.",
    responsibilities: [
      "Scans every agent's output for direct conflicts",
      "Flags disagreements for re-analysis before a verdict is reached",
      "Distinguishes genuine contradictions from differences in framing",
    ],
    exampleFinding:
      "The Critic and Evidence Verifier disagree on how much the outdated source matters.",
    status: "warning",
    confidence: 0.63,
    currentTask: "Idle — session complete",
    sequence: 7,
  },
  {
    id: "judge",
    name: "Judge",
    shortLabel: "JDG",
    role: "Final verdict",
    description:
      "Weighs the full council's findings — not a vote count — and produces the final report.",
    responsibilities: [
      "Weighs every agent's findings on their merits, not a vote count",
      "Resolves flagged contradictions before finalizing a verdict",
      "Produces the final report with a confidence-weighted verdict",
    ],
    exampleFinding:
      "Verdict: largely supported, with one flagged caveat carried into the final report.",
    status: "completed",
    confidence: 0.77,
    currentTask: "Idle — session complete",
    sequence: 8,
  },
];
