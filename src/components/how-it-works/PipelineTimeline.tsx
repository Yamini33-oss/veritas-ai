import { motion } from "framer-motion";
import { PIPELINE_STAGES } from "../../data/howItWorks";
import { accentForAgentId, agentNameForId } from "../../utils/agentAccent";

export default function PipelineTimeline() {
  return (
    <div className="relative">
      {/* rail */}
      <div className="absolute left-[19px] top-2 bottom-2 w-px bg-chamber-line" />
      <motion.div
        className="absolute left-[19px] w-px bg-amber"
        style={{ top: "2%", height: "10%" }}
        animate={{ top: ["2%", "88%"], height: ["10%", "10%"] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="space-y-12">
        {PIPELINE_STAGES.map((stage, i) => (
          <motion.div
            key={stage.n}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: i * 0.05 }}
            className="relative pl-14"
          >
            <div className="absolute left-0 top-0 w-10 h-10 rounded-full border border-chamber-line bg-chamber flex items-center justify-center">
              <span className="font-mono text-[11px] text-copper">{stage.n}</span>
            </div>

            <p className="font-display text-2xl md:text-3xl text-ivory mb-2">
              {stage.title}
            </p>
            <p className="text-sm text-ivory-dim leading-relaxed max-w-xl">
              {stage.description}
            </p>

            {stage.agentIds.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {stage.agentIds.map((id) => (
                  <span
                    key={id}
                    className="inline-flex items-center gap-1.5 font-mono text-[10px] px-2.5 py-1 border rounded-full"
                    style={{ borderColor: `${accentForAgentId(id)}55`, color: accentForAgentId(id) }}
                  >
                    <span
                      className="w-1 h-1 rounded-full"
                      style={{ backgroundColor: accentForAgentId(id) }}
                    />
                    {agentNameForId(id).toUpperCase()}
                  </span>
                ))}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
