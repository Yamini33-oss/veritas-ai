import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { AGENTS } from "../../data/agents";
import type { Agent, AgentRole } from "../../types/agent";

const TABLE_CENTER = { x: 500, y: 372 };
const TABLE_RX = 360;
const TABLE_RY = 104;

const RING_CENTER = { x: 500, y: 356 };
const RING_RX = 430;
const RING_RY = 208;

const HOLO_LABELS = [
  "CLAIMS",
  "EVIDENCE",
  "REASONING",
  "CONTRADICTIONS",
  "CONFIDENCE",
  "VERDICT",
];

interface Placed {
  agent: Agent;
  index: number;
  x: number;
  y: number;
  scale: number;
  accent: string;
}

function accentFor(agent: Agent): string {
  if (agent.status === "warning" || agent.status === "failed") {
    return "#c15c46"; // coral
  }
  return "#e2a343"; // amber
}

function placeAgents(agents: Agent[]): Placed[] {
  return agents.map((agent, i) => {
    const angle = -Math.PI / 2 + i * (Math.PI / 4);
    const x = RING_CENTER.x + RING_RX * Math.cos(angle);
    const y = RING_CENTER.y + RING_RY * Math.sin(angle);
    const t = (y - (RING_CENTER.y - RING_RY)) / (RING_RY * 2);
    const scale = 0.6 + t * 0.5;
    return { agent, index: i, x, y, scale, accent: accentFor(agent) };
  });
}

/** One of eight hand-built silhouettes, drawn in local space with the
 *  ground-contact point at (0,0), growing upward (negative y). */
function RobotHead({ variant, accent }: { variant: number; accent: string }) {
  switch (variant) {
    case 0: // Orchestrator — hexagonal head, halo ring (coordinator)
      return (
        <g>
          <ellipse cx="0" cy="-40" rx="15" ry="9" fill="none" stroke={accent} strokeOpacity="0.5" strokeWidth="1" />
          <polygon points="0,-50 10,-45 10,-35 0,-30 -10,-35 -10,-45" fill="#1d1a15" stroke={accent} strokeWidth="1.4" />
        </g>
      );
    case 1: // Reasoner — dome head
      return (
        <path d="M -10,-32 A 10,14 0 0 1 10,-32 L 10,-32 L -10,-32 Z" fill="#1d1a15" stroke={accent} strokeWidth="1.4" />
      );
    case 2: // Researcher — angular scanner head with antenna
      return (
        <g>
          <line x1="0" y1="-46" x2="0" y2="-56" stroke={accent} strokeWidth="1.2" />
          <circle cx="0" cy="-57" r="2" fill={accent} />
          <polygon points="-9,-30 -11,-42 0,-48 11,-42 9,-30" fill="#1d1a15" stroke={accent} strokeWidth="1.4" />
        </g>
      );
    case 3: // Analyzer — cube head, grid lines
      return (
        <g>
          <rect x="-10" y="-46" width="20" height="16" fill="#1d1a15" stroke={accent} strokeWidth="1.4" />
          <line x1="-10" y1="-38" x2="10" y2="-38" stroke={accent} strokeOpacity="0.4" strokeWidth="0.8" />
          <line x1="0" y1="-46" x2="0" y2="-30" stroke={accent} strokeOpacity="0.4" strokeWidth="0.8" />
        </g>
      );
    case 4: // Critic — spiked, challenging silhouette
      return (
        <polygon points="0,-52 11,-32 -11,-32" fill="#1d1a15" stroke={accent} strokeWidth="1.4" />
      );
    case 5: // Evidence Verifier — faceted diamond, small holo panel
      return (
        <g>
          <rect x="-14" y="-64" width="20" height="11" rx="1" fill="#221d16" stroke={accent} strokeOpacity="0.6" strokeWidth="1" />
          <line x1="-11" y1="-61" x2="1" y2="-61" stroke={accent} strokeOpacity="0.7" strokeWidth="0.8" />
          <line x1="-11" y1="-58" x2="-2" y2="-58" stroke={accent} strokeOpacity="0.5" strokeWidth="0.8" />
          <polygon points="0,-46 9,-38 0,-30 -9,-38" fill="#1d1a15" stroke={accent} strokeWidth="1.4" />
        </g>
      );
    case 6: // Contradiction Detector — twin-blade split head
      return (
        <g>
          <polygon points="-2,-46 -12,-36 -2,-30" fill="#1d1a15" stroke={accent} strokeWidth="1.3" />
          <polygon points="2,-46 12,-36 2,-30" fill="#1d1a15" stroke={accent} strokeWidth="1.3" />
        </g>
      );
    default: // Judge — tall staggered crown, most authoritative
      return (
        <g>
          <rect x="-11" y="-54" width="22" height="10" fill="#1d1a15" stroke={accent} strokeWidth="1.4" />
          <rect x="-7" y="-62" width="14" height="9" fill="#1d1a15" stroke={accent} strokeWidth="1.4" />
          <rect x="-13" y="-44" width="26" height="10" fill="#1d1a15" stroke={accent} strokeWidth="1.4" />
        </g>
      );
  }
}

function Robot({
  placed,
  active,
  running,
  waiting,
  onEnter,
  onLeave,
  onClick,
}: {
  placed: Placed;
  active: boolean;
  running: boolean;
  waiting: boolean;
  onEnter: () => void;
  onLeave: () => void;
  onClick?: () => void;
}) {
  const { agent, index, x, y, scale, accent } = placed;
  const facing = x >= TABLE_CENTER.x ? -6 : 6; // lean slightly toward the table
  const glowing = active || running;
  const bodyOpacity = waiting ? 0.4 : active ? 1 : 0.75;

  return (
    <motion.g
      transform={`translate(${x} ${y}) scale(${scale})`}
      animate={{ y: [0, -3, 0] }}
      transition={{
        duration: 4.5 + (index % 3),
        repeat: Infinity,
        ease: "easeInOut",
        delay: index * 0.35,
      }}
      role="button"
      tabIndex={0}
      aria-label={`${agent.name} — ${agent.role}. Status ${agent.status}.`}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onFocus={onEnter}
      onBlur={onLeave}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
      style={{ cursor: onClick ? "pointer" : "default", outline: "none" }}
    >
      {/* contact shadow */}
      <ellipse cx="0" cy="2" rx="16" ry="4" fill="#000" opacity="0.35" />

      {glowing && <circle cx="0" cy="-38" r="34" fill={accent} opacity="0.14" />}

      <g opacity={bodyOpacity}>
        <g transform={`rotate(${facing})`}>
          {/* legs */}
          <polygon points="-6,0 6,0 9,-18 -9,-18" fill="#161310" stroke={accent} strokeOpacity="0.5" strokeWidth="1" />
          {/* torso */}
          <polygon
            points="-11,-18 11,-18 9,-32 -9,-32"
            fill="#1d1a15"
            stroke={accent}
            strokeOpacity={glowing ? 1 : 0.75}
            strokeWidth={glowing ? 1.8 : 1.3}
          />
          {/* head unit (variant) */}
          <RobotHead variant={index} accent={accent} />
          {/* sensor eye */}
          <motion.circle
            cx="0"
            cy="-38"
            r={glowing ? 2.6 : 2}
            fill={accent}
            animate={{ opacity: running ? [0.5, 1, 0.5] : [0.55, 1, 0.55] }}
            transition={{
              duration: running ? 0.9 : 2.6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: index * 0.2,
            }}
          />
        </g>
      </g>
    </motion.g>
  );
}

interface CouncilChamberProps {
  /** Live agent data — defaults to the static mock roster. Pass a
   *  simulation-driven array to reflect waiting/running/completed. */
  agents?: Agent[];
  /** "compact" is the hero treatment (small hover tooltip, no click-to-pin).
   *  "full" adds click-to-pin selection and a richer panel for the /agents page. */
  variant?: "compact" | "full";
  /** Controlled selection, used by "full" variant. */
  selectedId?: AgentRole | null;
  onSelectAgent?: (id: AgentRole | null) => void;
}

export default function CouncilChamber({
  agents = AGENTS,
  variant = "compact",
  selectedId = null,
  onSelectAgent,
}: CouncilChamberProps) {
  const placed = useMemo(() => placeAgents(agents), [agents]);
  const [hoveredId, setHoveredId] = useState<AgentRole | null>(null);
  const drawOrder = useMemo(() => [...placed].sort((a, b) => a.y - b.y), [placed]);

  const effectiveId = hoveredId ?? selectedId;
  const active = effectiveId ? placed.find((p) => p.agent.id === effectiveId) ?? null : null;

  return (
    <div
      className="absolute inset-0 overflow-hidden select-none"
      onClick={() => onSelectAgent?.(null)}
    >
      {/* chamber walls */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(90% 80% at 50% 25%, rgba(67, 48, 28, 0.9) 0%, #17130e 48%, #090807 100%)",
        }}
      />
          <div className="chamber-grid absolute inset-0 opacity-50" />
          <div className="chamber-orbit chamber-orbit-one absolute left-1/2 top-[48%]" />
          <div className="chamber-orbit chamber-orbit-two absolute left-1/2 top-[48%]" />
      {/* floor */}
      <div
        className="absolute inset-x-0 bottom-0 h-[46%]"
        style={{
          background:
            "linear-gradient(to top, #080706 0%, rgba(20,18,15,0.92) 45%, rgba(20,18,15,0) 100%)",
        }}
      />
      {/* volumetric light shafts */}
      <div
        className="absolute -top-10 left-1/3 w-[40%] h-[80%] opacity-[0.14]"
        style={{
          background: "linear-gradient(200deg, #e2a343, transparent 65%)",
          filter: "blur(18px)",
        }}
      />
      <div
        className="absolute -top-10 right-1/4 w-[30%] h-[70%] opacity-[0.11]"
        style={{
          background: "linear-gradient(160deg, #b96b3f, transparent 65%)",
          filter: "blur(22px)",
        }}
      />

      <svg
        viewBox="0 0 1000 620"
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="xMidYMax slice"
        aria-label="The eight VERITAS agents gathered around the holographic council table"
      >
        <defs>
          <radialGradient id="chamberCore" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#e2a343" stopOpacity="0.6" />
            <stop offset="55%" stopColor="#b96b3f" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#b96b3f" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="chamberTable" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#241f17" stopOpacity="0.95" />
            <stop offset="75%" stopColor="#1d1a15" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#1d1a15" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* table */}
        <ellipse cx={TABLE_CENTER.x} cy={TABLE_CENTER.y} rx={TABLE_RX} ry={TABLE_RY} fill="url(#chamberTable)" />
        <ellipse
          cx={TABLE_CENTER.x}
          cy={TABLE_CENTER.y}
          rx={TABLE_RX}
          ry={TABLE_RY}
          fill="none"
          stroke="#3a3226"
          strokeWidth="1"
        />
        <motion.ellipse
          cx={TABLE_CENTER.x}
          cy={TABLE_CENTER.y}
          rx={TABLE_RX - 30}
          ry={TABLE_RY - 9}
          fill="none"
          stroke="#e2a343"
          strokeOpacity="0.18"
          strokeDasharray="2 6"
          animate={{ rotate: 360 }}
          transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: `${TABLE_CENTER.x}px ${TABLE_CENTER.y}px` }}
        />

        {/* data streams: robot -> core */}
        {placed.map((p) => {
          const isRunning = p.agent.status === "running";
          const isHighlighted = effectiveId === p.agent.id || isRunning;
          return (
            <motion.line
              key={`stream-${p.agent.id}`}
              x1={p.x}
              y1={p.y - 20}
              x2={TABLE_CENTER.x}
              y2={TABLE_CENTER.y}
              stroke={p.accent}
              strokeWidth={isHighlighted ? 1.4 : 0.7}
              strokeOpacity={isHighlighted ? 0.65 : 0.22}
              strokeDasharray="3 7"
              animate={{ strokeDashoffset: [0, -20] }}
              transition={{
                duration: isRunning ? 1 : 2.2,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          );
        })}

        {/* floating holographic concept labels */}
        {HOLO_LABELS.map((label, i) => {
          const a = (i / HOLO_LABELS.length) * Math.PI * 2;
          const lx = TABLE_CENTER.x + (TABLE_RX - 90) * Math.cos(a);
          const ly = TABLE_CENTER.y + (TABLE_RY - 22) * Math.sin(a) - 6;
          return (
            <motion.text
              key={label}
              x={lx}
              y={ly}
              textAnchor="middle"
              fontFamily="IBM Plex Mono, monospace"
              fontSize="9"
              fill="#cabfa9"
              animate={{ opacity: [0.15, 0.4, 0.15], y: [ly, ly - 5, ly] }}
              transition={{
                duration: 5 + i,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.6,
              }}
            >
              {label}
            </motion.text>
          );
        })}

        {/* core */}
        <circle cx={TABLE_CENTER.x} cy={TABLE_CENTER.y} r="58" fill="url(#chamberCore)" />
        <motion.circle
          cx={TABLE_CENTER.x}
          cy={TABLE_CENTER.y}
          r="9"
          fill="#e2a343"
          animate={{ opacity: [0.7, 1, 0.7], r: [8, 10.5, 8] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
        />
        <text
          x={TABLE_CENTER.x}
          y={TABLE_CENTER.y + 26}
          textAnchor="middle"
          fontFamily="IBM Plex Mono, monospace"
          fontSize="8"
          letterSpacing="1.5"
          fill="#cabfa9"
          opacity="0.55"
        >
          VERITAS CORE
        </text>

        {/* robots, back to front */}
        {drawOrder.map((p) => (
          <Robot
            key={p.agent.id}
            placed={p}
            active={effectiveId === p.agent.id}
            running={p.agent.status === "running"}
            waiting={p.agent.status === "waiting"}
            onEnter={() => setHoveredId(p.agent.id)}
            onLeave={() => setHoveredId((current) => (current === p.agent.id ? null : current))}
            onClick={
              onSelectAgent
                ? () => onSelectAgent(selectedId === p.agent.id ? null : p.agent.id)
                : undefined
            }
          />
        ))}
      </svg>

      {/* identity panel on hover/focus/selection */}
      {active && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className={`absolute pointer-events-none bg-chamber/90 border border-chamber-line rounded-sm px-4 py-3 backdrop-blur-sm ${
            variant === "full" ? "max-w-[260px]" : "max-w-[220px]"
          }`}
          style={{
            left: `${(active.x / 1000) * 100}%`,
            top: `${(active.y / 620) * 100}%`,
            transform: "translate(-50%, -140%)",
          }}
        >
          <p className="font-mono text-[10px] tracking-wide" style={{ color: active.accent }}>
            {active.agent.name.toUpperCase()}
          </p>
          <p className="text-xs text-ivory-dim mt-1 leading-snug">
            {active.agent.description}
          </p>
          {variant === "full" && (
            <p className="text-[11px] text-ivory-dim/80 mt-2 leading-snug font-mono">
              {active.agent.currentTask}
            </p>
          )}
          <div className="flex items-center justify-between mt-2 font-mono text-[10px] text-ivory-dim/70">
            <span>{active.agent.status.toUpperCase()}</span>
            {active.agent.confidence !== null && (
              <span>{Math.round(active.agent.confidence * 100)}%</span>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
