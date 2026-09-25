import type { AgentRole, AgentStatus } from "./agent";

export interface AgentLogEntry {
  agentId: AgentRole;
  status: AgentStatus;
  message: string;
  timestamp: string;
}

export type Verdict = "supported" | "contradicted" | "inconclusive";

export type VerificationType =
  | "Factual"
  | "Statistical"
  | "Historical"
  | "Scientific"
  | "Policy";

export interface VerificationFinding {
  agentId: AgentRole;
  note: string;
  confidence: number;
}

export interface VerificationRecord {
  id: string;
  date: string;
  type: VerificationType;
  claim: string;
  verdict: Verdict;
  confidence: number;
  agentsUsed: AgentRole[];
  contradictions: string[];
  findings: VerificationFinding[];
}
