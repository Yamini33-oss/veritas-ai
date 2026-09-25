import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { AGENTS } from "../../data/agents";

const STATUS_COLOR: Record<string, string> = {
  waiting: "bg-ivory-dim/40",
  running: "bg-amber",
  completed: "bg-verified",
  warning: "bg-coral",
  failed: "bg-coral",
};

export default function CouncilPreview() {
  return (
    <section className="relative z-10 border-t border-chamber-line">
      <div className="mx-auto max-w-7xl px-6 md:px-10 py-20 md:py-28">
        <div className="flex items-baseline justify-between mb-12 flex-wrap gap-4">
          <h2 className="font-display text-3xl md:text-4xl text-ivory">
            The council
          </h2>
          <Link
            to="/agents"
            className="text-sm text-copper hover:text-amber transition-colors"
          >
            View the full chamber
          </Link>
        </div>

        <div className="border-t border-chamber-line">
          {AGENTS.map((agent, i) => (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.04 }}
              className="group grid grid-cols-12 gap-4 items-start py-6 border-b border-chamber-line hover:bg-chamber/40 transition-colors px-2 -mx-2"
            >
              <div className="col-span-2 sm:col-span-1 font-mono text-xs text-ivory-dim/60 pt-1">
                {String(agent.sequence).padStart(2, "0")}
              </div>
              <div className="col-span-10 sm:col-span-3">
                <p className="font-display text-lg text-ivory group-hover:text-amber transition-colors">
                  {agent.name}
                </p>
                <p className="font-mono text-[11px] text-copper mt-1">
                  {agent.role}
                </p>
              </div>
              <div className="col-span-10 col-start-3 sm:col-span-6 sm:col-start-auto mt-2 sm:mt-0">
                <p className="text-sm text-ivory-dim leading-relaxed max-w-md">
                  {agent.description}
                </p>
              </div>
              <div className="col-span-4 sm:col-span-2 flex sm:justify-end mt-2 sm:mt-0">
                <span className="inline-flex items-center gap-2 text-xs text-ivory-dim/70">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${STATUS_COLOR[agent.status]}`}
                  />
                  {agent.status}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
