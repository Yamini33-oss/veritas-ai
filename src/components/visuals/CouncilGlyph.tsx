import { motion } from "framer-motion";
import { AGENTS } from "../../data/agents";

/**
 * Abstract render of the council table: eight agent nodes arranged
 * around a rotating core, connected by faint signal lines. Purely
 * decorative on the landing page — the real, interactive version
 * lives on /agents.
 */
export default function CouncilGlyph() {
  const radius = 168;
  const center = 200;

  const nodes = AGENTS.map((agent, i) => {
    const angle = (i / AGENTS.length) * Math.PI * 2 - Math.PI / 2;
    return {
      agent,
      x: center + radius * Math.cos(angle),
      y: center + radius * Math.sin(angle),
    };
  });

  return (
    <div className="relative w-full max-w-[440px] mx-auto aspect-square">
      <svg
        viewBox="0 0 400 400"
        className="w-full h-full overflow-visible"
        aria-hidden="true"
      >
        <defs>
          <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#e2a343" stopOpacity="0.55" />
            <stop offset="60%" stopColor="#b96b3f" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#b96b3f" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="tableGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#1d1a15" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#1d1a15" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* table surface */}
        <circle cx={center} cy={center} r={radius + 16} fill="url(#tableGrad)" />
        <circle
          cx={center}
          cy={center}
          r={radius + 16}
          fill="none"
          stroke="#2c2720"
          strokeWidth="1"
        />

        {/* connecting lines from each node to the core */}
        {nodes.map(({ agent, x, y }) => (
          <line
            key={`line-${agent.id}`}
            x1={center}
            y1={center}
            x2={x}
            y2={y}
            stroke={agent.status === "warning" ? "#c15c46" : "#a97a34"}
            strokeWidth="0.6"
            strokeOpacity="0.35"
          />
        ))}

        {/* rotating outer ring of tick marks */}
        <motion.g
          animate={{ rotate: 360 }}
          transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: `${center}px ${center}px` }}
        >
          {Array.from({ length: 48 }).map((_, i) => {
            const a = (i / 48) * Math.PI * 2;
            const r1 = radius + 26;
            const r2 = radius + (i % 4 === 0 ? 34 : 30);
            return (
              <line
                key={i}
                x1={center + r1 * Math.cos(a)}
                y1={center + r1 * Math.sin(a)}
                x2={center + r2 * Math.cos(a)}
                y2={center + r2 * Math.sin(a)}
                stroke="#a97a34"
                strokeOpacity={i % 4 === 0 ? 0.45 : 0.2}
                strokeWidth="1"
              />
            );
          })}
        </motion.g>

        {/* core */}
        <circle cx={center} cy={center} r="46" fill="url(#coreGlow)" />
        <motion.circle
          cx={center}
          cy={center}
          r="10"
          fill="#e2a343"
          animate={{ opacity: [0.7, 1, 0.7], r: [9, 11, 9] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
        />
        <circle cx={center} cy={center} r="18" fill="none" stroke="#e2a343" strokeOpacity="0.5" strokeWidth="1" />

        {/* agent nodes */}
        {nodes.map(({ agent, x, y }, i) => (
          <g key={agent.id}>
            <motion.circle
              cx={x}
              cy={y}
              r="6.5"
              fill={agent.status === "warning" ? "#c15c46" : "#14120f"}
              stroke={agent.status === "warning" ? "#c15c46" : "#e2a343"}
              strokeWidth="1.4"
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.3,
              }}
            />
            <text
              x={x}
              y={y - 14}
              textAnchor="middle"
              fontFamily="IBM Plex Mono, monospace"
              fontSize="9"
              fill="#cabfa9"
              opacity="0.75"
            >
              {agent.shortLabel}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
