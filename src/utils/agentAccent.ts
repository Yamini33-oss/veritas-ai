import { AGENTS } from "../data/agents";
import type { AgentRole } from "../types/agent";

export function accentForAgentId(id: AgentRole): string {
  const agent = AGENTS.find((a) => a.id === id);
  if (agent && (agent.status === "warning" || agent.status === "failed")) {
    return "#c15c46"; // coral
  }
  return "#e2a343"; // amber
}

export function agentNameForId(id: AgentRole): string {
  return AGENTS.find((a) => a.id === id)?.name ?? id;
}
