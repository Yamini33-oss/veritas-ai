import { useCallback, useEffect, useRef, useState } from "react";
import type { Agent, AgentRole } from "../types/agent";
import type { AgentLogEntry } from "../types/verification";
import { AGENTS } from "../data/agents";
import {
  SIMULATION_ORDER,
  RUNNING_ACTION,
  COMPLETED_TASK,
  WAITING_TASK,
} from "../data/simulation";

export type SimulationStatus = "idle" | "running" | "complete";

const RUNNING_DURATION_MS = 1100;
const STAGE_GAP_MS = 260;

function formatTimestamp(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function useCouncilSimulation() {
  const [agents, setAgents] = useState<Agent[]>(AGENTS);
  const [status, setStatus] = useState<SimulationStatus>("idle");
  const [log, setLog] = useState<AgentLogEntry[]>([]);
  const runIdRef = useRef(0);

  const setAgentField = useCallback((id: AgentRole, patch: Partial<Agent>) => {
    setAgents((current) =>
      current.map((agent) => (agent.id === id ? { ...agent, ...patch } : agent))
    );
  }, []);

  const run = useCallback(async () => {
    const runId = ++runIdRef.current;
    setStatus("running");
    setLog([]);
    setAgents(
      AGENTS.map((agent) => ({
        ...agent,
        status: "waiting",
        confidence: null,
        currentTask: WAITING_TASK,
      }))
    );

    await delay(STAGE_GAP_MS);

    for (const id of SIMULATION_ORDER) {
      if (runIdRef.current !== runId) return;

      setAgentField(id, { status: "running", currentTask: RUNNING_ACTION[id] });
      setLog((current) => [
        ...current,
        {
          agentId: id,
          status: "running",
          message: RUNNING_ACTION[id],
          timestamp: formatTimestamp(new Date()),
        },
      ]);

      await delay(RUNNING_DURATION_MS);
      if (runIdRef.current !== runId) return;

      const original = AGENTS.find((agent) => agent.id === id);
      const finalStatus = original?.status === "warning" ? "warning" : "completed";
      setAgentField(id, {
        status: finalStatus,
        confidence: original?.confidence ?? null,
        currentTask: COMPLETED_TASK[id],
      });

      await delay(STAGE_GAP_MS);
    }

    if (runIdRef.current === runId) {
      setStatus("complete");
    }
  }, [setAgentField]);

  const reset = useCallback(() => {
    runIdRef.current += 1;
    setAgents(AGENTS);
    setStatus("idle");
    setLog([]);
  }, []);

  useEffect(() => {
    return () => {
      runIdRef.current += 1;
    };
  }, []);

  return { agents, status, log, run, reset };
}
