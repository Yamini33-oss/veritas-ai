import type { Agent } from "../types/agent";
import { AGENTS } from "../data/agents";

/**
 * Contract the UI depends on. Swap MockAgentService for a real
 * implementation (e.g. one backed by fetch/websocket calls to the
 * future backend) without touching any component.
 */
export interface AgentService {
  getCouncil(): Promise<Agent[]>;
  getAgent(id: Agent["id"]): Promise<Agent | undefined>;
}

const DEMO_LATENCY_MS = 250;

class MockAgentService implements AgentService {
  async getCouncil(): Promise<Agent[]> {
    await wait(DEMO_LATENCY_MS);
    return AGENTS;
  }

  async getAgent(id: Agent["id"]): Promise<Agent | undefined> {
    await wait(DEMO_LATENCY_MS);
    return AGENTS.find((agent) => agent.id === id);
  }
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const agentService: AgentService = new MockAgentService();
