import { motion, AnimatePresence } from "framer-motion";
import type { Agent } from "../../types/agent";
import { STATUS_DOT, STATUS_TEXT } from "./statusStyles";

export default function AgentDetailPanel({ agent }: { agent: Agent }) {
  return (
    <div className="border border-chamber-line rounded-sm bg-chamber/60 px-6 py-8 md:px-10 md:py-10">
      <AnimatePresence mode="wait">
        <motion.div
          key={agent.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
        >
          <div className="flex flex-wrap items-start justify-between gap-6 mb-8">
            <div>
              <p className="font-mono text-xs text-copper mb-2">
                {String(agent.sequence).padStart(2, "0")} · {agent.role}
              </p>
              <h2 className="font-display text-3xl md:text-4xl text-ivory">
                {agent.name}
              </h2>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className={`inline-flex items-center gap-2 text-xs font-mono ${STATUS_TEXT[agent.status]}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[agent.status]}`} />
                {agent.status.toUpperCase()}
              </span>
              {agent.confidence !== null ? (
                <div className="flex items-center gap-2">
                  <div className="w-24 h-1 bg-chamber-line rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber"
                      style={{ width: `${Math.round(agent.confidence * 100)}%` }}
                    />
                  </div>
                  <span className="font-mono text-xs text-ivory-dim">
                    {Math.round(agent.confidence * 100)}%
                  </span>
                </div>
              ) : (
                <span className="font-mono text-xs text-ivory-dim/50">— %</span>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-10">
            <div>
              <p className="font-mono text-[11px] text-ivory-dim/60 mb-3 tracking-wide">
                RESPONSIBILITIES
              </p>
              <ul className="space-y-2">
                {agent.responsibilities.map((item) => (
                  <li key={item} className="text-sm text-ivory-dim leading-relaxed flex gap-2">
                    <span className="text-copper mt-1">·</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <p className="font-mono text-[11px] text-ivory-dim/60 mt-6 mb-2 tracking-wide">
                CURRENT TASK
              </p>
              <p className="text-sm text-ivory">{agent.currentTask}</p>
            </div>

            <div>
              <p className="font-mono text-[11px] text-ivory-dim/60 mb-3 tracking-wide">
                EXAMPLE FINDING
              </p>
              <blockquote className="border-l-2 border-amber/50 pl-4 font-display text-lg text-ivory leading-snug">
                {agent.exampleFinding}
              </blockquote>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
