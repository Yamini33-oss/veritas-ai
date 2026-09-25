export type AgentRole =
  | "orchestrator"
  | "reasoner"
  | "researcher"
  | "analyzer"
  | "critic"
  | "evidence-verifier"
  | "contradiction-detector"
  | "judge";

export type AgentStatus =
  | "waiting"
  | "running"
  | "completed"
  | "warning"
  | "failed";

export interface Agent {
  id: AgentRole;
  name: string;
  shortLabel: string;
  role: string;
  description: string;
  responsibilities: string[];
  exampleFinding: string;
  status: AgentStatus;
  confidence: number | null;
  currentTask: string;
  sequence: number;
}
