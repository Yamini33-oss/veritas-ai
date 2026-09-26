
import type { AgentStatus } from "./agent";
export interface AgentLogEntry {
  agentId: AgentRole;
  status: AgentStatus;
  message: string;
  timestamp: string;
}
export type VerificationType =
  | "Factual"
  | "Scientific"
  | "Historical"
  | "Statistical"
  | "Policy";

export type Verdict =
  | "supported"
  | "contradicted"
  | "inconclusive";

export type AgentRole =
  | "orchestrator"
  | "reasoner"
  | "researcher"
  | "analyzer"
  | "critic"
  | "evidence-verifier"
  | "contradiction-detector"
  | "judge";

export interface VerificationFinding {
  agentId: AgentRole;
  note: string;
  confidence: number;
}

export interface SubclaimVerification {
  subclaim: string;
  verdict: Verdict;
  explanation: string;
  keyFactors: string[];
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

  sources?: string[];

  judgeDetails?: {
    keySupportingFindings: string[];
    keyConcerns: string[];
    contradictionsResolved: boolean;
  };

  decomposition?: {
    isComplex: boolean;
    subclaims: string[];
    reasoning: string;
  };

  subclaimResults?: SubclaimVerification[];
}