import type { SimulationStatus } from "../../hooks/useCouncilSimulation";

interface SimulationControlsProps {
  status: SimulationStatus;
  onRun: () => void;
  onReset: () => void;
}

const STATUS_LABEL: Record<SimulationStatus, string> = {
  idle: "Demo simulation — ready",
  running: "Simulation running",
  complete: "Simulation complete",
};

export default function SimulationControls({ status, onRun, onReset }: SimulationControlsProps) {
  return (
    <div className="flex flex-wrap items-center gap-5">
      {status !== "complete" ? (
        <button
          type="button"
          onClick={onRun}
          disabled={status === "running"}
          className="bg-amber text-void font-medium text-sm px-6 py-3 rounded-sm hover:bg-ivory transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {status === "running" ? "Council in session…" : "Run council simulation"}
        </button>
      ) : (
        <button
          type="button"
          onClick={onRun}
          className="border border-chamber-line hover:border-amber/60 text-ivory hover:text-amber transition-colors text-sm px-6 py-3 rounded-sm"
        >
          Run again
        </button>
      )}
      {status !== "idle" && (
        <button
          type="button"
          onClick={onReset}
          className="text-sm text-ivory-dim hover:text-ivory transition-colors"
        >
          Reset
        </button>
      )}
      <span className="inline-flex items-center gap-2 font-mono text-xs text-ivory-dim/70">
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            status === "running" ? "bg-amber animate-pulse" : "bg-ivory-dim/40"
          }`}
        />
        {STATUS_LABEL[status]}
      </span>
    </div>
  );
}
