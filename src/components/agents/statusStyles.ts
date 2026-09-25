import type { AgentStatus } from "../../types/agent";

export const STATUS_DOT: Record<AgentStatus, string> = {
  waiting: "bg-ivory-dim/40",
  running: "bg-amber",
  completed: "bg-amber",
  warning: "bg-coral",
  failed: "bg-coral",
};

export const STATUS_TEXT: Record<AgentStatus, string> = {
  waiting: "text-ivory-dim/70",
  running: "text-amber",
  completed: "text-ivory-dim",
  warning: "text-coral",
  failed: "text-coral",
};
