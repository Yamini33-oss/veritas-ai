import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { AgentLogEntry } from "../../types/verification";
import { AGENTS } from "../../data/agents";

function agentName(id: AgentLogEntry["agentId"]) {
  return AGENTS.find((a) => a.id === id)?.name ?? id;
}

export default function ActivityFeed({ log }: { log: AgentLogEntry[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [log.length]);

  return (
    <div className="verify-feed mt-16 md:mt-24">
      <div className="flex items-center justify-between pb-3 border-b border-chamber-line">
        <p className="font-mono text-[11px] text-copper tracking-[0.18em]">LIVE EVIDENCE STREAM</p>
        <span className="font-mono text-[10px] text-ivory-dim/45">{log.length.toString().padStart(2, "0")} EVENTS</span>
      </div>
      <div ref={scrollRef} className="max-h-64 overflow-y-auto py-5 pl-4 border-l border-amber/30 space-y-3">
        {log.length === 0 ? (
          <p className="font-mono text-xs text-ivory-dim/50">
            Run the simulation to see the council's activity here.
          </p>
        ) : (
          <AnimatePresence initial={false}>
            {log.map((entry, i) => (
              <motion.div
                key={`${entry.agentId}-${i}`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="font-mono text-xs leading-relaxed"
              >
                <span className="text-ivory-dim/60">{entry.timestamp}</span>{" "}
                <span className="text-amber">{agentName(entry.agentId).toUpperCase()}</span>
                <span className="text-ivory-dim"> — {entry.message}</span>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
