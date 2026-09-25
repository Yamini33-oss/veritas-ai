import { useState } from "react";
import CouncilChamber from "../components/visuals/CouncilChamber";
import AgentDetailPanel from "../components/agents/AgentDetailPanel";
import AgentRoster from "../components/agents/AgentRoster";
import SimulationControls from "../components/agents/SimulationControls";
import ActivityFeed from "../components/agents/ActivityFeed";
import { useCouncilSimulation } from "../hooks/useCouncilSimulation";
import type { AgentRole } from "../types/agent";

export default function Agents() {
  const { agents, status, log, run, reset } = useCouncilSimulation();
  const [selectedId, setSelectedId] = useState<AgentRole | null>("orchestrator");

  const selectedAgent =
    agents.find((agent) => agent.id === selectedId) ?? agents[0];

  return (
    <div className="relative z-10">
      <section className="mx-auto max-w-7xl px-6 md:px-10 pt-16 md:pt-20 pb-10">
        <p className="font-mono text-xs text-copper mb-6">the ai council</p>
        <div className="flex flex-wrap items-end justify-between gap-8">
          <h1 className="font-display text-4xl md:text-6xl text-ivory max-w-2xl">
            Eight agents.
            <br />
            One verdict.
          </h1>
          <p className="max-w-sm text-ivory-dim text-sm leading-relaxed">
            Every claim VERITAS handles passes through this room. Hover or
            select any agent below to see what it's responsible for — then
            run a live demo session and watch the council work.
          </p>
        </div>
        <div className="mt-10">
          <SimulationControls status={status} onRun={run} onReset={reset} />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="relative min-h-[520px] md:min-h-[640px] border border-chamber-line rounded-sm overflow-hidden">
          <CouncilChamber
            agents={agents}
            variant="full"
            selectedId={selectedId}
            onSelectAgent={setSelectedId}
          />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 md:px-10 py-16 md:py-20">
        <div className="grid lg:grid-cols-[1fr_320px] gap-8 items-start">
          {selectedAgent && <AgentDetailPanel agent={selectedAgent} />}
          <ActivityFeed log={log} />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 md:px-10 pb-24 md:pb-32">
        <h2 className="font-display text-2xl md:text-3xl text-ivory mb-4">
          Full roster
        </h2>
        <AgentRoster agents={agents} selectedId={selectedId} onSelect={setSelectedId} />
      </section>
    </div>
  );
}
