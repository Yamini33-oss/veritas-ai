import { motion } from "framer-motion";
import type { Agent, AgentRole } from "../../types/agent";
import { STATUS_DOT } from "./statusStyles";

interface AgentRosterProps {
  agents: Agent[];
  selectedId: AgentRole | null;
  onSelect: (id: AgentRole) => void;
}

export default function AgentRoster({ agents, selectedId, onSelect }: AgentRosterProps) {
  return (
    <div className="border-t border-chamber-line">
      {agents.map((agent, i) => {
        const isSelected = agent.id === selectedId;
        return (
          <motion.button
            key={agent.id}
            type="button"
            onClick={() => onSelect(agent.id)}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: i * 0.04 }}
            className={`w-full text-left grid grid-cols-12 gap-4 items-start py-6 border-b border-chamber-line transition-colors px-3 -mx-3 ${
              isSelected ? "bg-chamber" : "hover:bg-chamber/40"
            }`}
          >
            <div className="col-span-2 sm:col-span-1 font-mono text-xs text-ivory-dim/60 pt-1">
              {String(agent.sequence).padStart(2, "0")}
            </div>
            <div className="col-span-10 sm:col-span-3">
              <p
                className={`font-display text-lg transition-colors ${
                  isSelected ? "text-amber" : "text-ivory"
                }`}
              >
                {agent.name}
              </p>
              <p className="font-mono text-[11px] text-copper mt-1">{agent.role}</p>
            </div>
            <div className="col-span-10 col-start-3 sm:col-span-6 sm:col-start-auto mt-2 sm:mt-0">
              <p className="text-sm text-ivory-dim leading-relaxed max-w-md">
                {agent.description}
              </p>
            </div>
            <div className="col-span-4 sm:col-span-2 flex sm:justify-end mt-2 sm:mt-0">
              <span className="inline-flex items-center gap-2 text-xs text-ivory-dim/70">
                <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[agent.status]}`} />
                {agent.status}
              </span>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
