import { Link } from "react-router-dom";
import type { VerificationRecord } from "../../types/verification";
import { VERDICT_DOT, VERDICT_TEXT } from "../history/verdictStyles";
import { accentForAgentId, agentNameForId } from "../../utils/agentAccent";

export default function ReportView({ record }: { record: VerificationRecord }) {
  return (
    <div>
      <p className="font-mono text-xs text-copper mb-4">
        {record.id} · {record.date} · {record.type}
      </p>
      <h1 className="font-display text-3xl md:text-5xl text-ivory max-w-2xl leading-tight">
        {record.claim}
      </h1>

      <div className="flex flex-wrap items-center gap-6 mt-8">
        <span className={`inline-flex items-center gap-2 text-sm font-mono ${VERDICT_TEXT[record.verdict]}`}>
          <span className={`w-2 h-2 rounded-full ${VERDICT_DOT[record.verdict]}`} />
          {record.verdict.toUpperCase()}
        </span>
        <div className="flex items-center gap-2">
          <div className="w-32 h-1 bg-chamber-line rounded-full overflow-hidden">
            <div className="h-full bg-amber" style={{ width: `${Math.round(record.confidence * 100)}%` }} />
          </div>
          <span className="font-mono text-xs text-ivory-dim">
            {Math.round(record.confidence * 100)}% confidence
          </span>
        </div>
      </div>

      <div className="mt-10">
        <p className="font-mono text-[11px] text-ivory-dim/60 mb-3 tracking-wide">
          AGENTS USED
        </p>
        <div className="flex flex-wrap gap-2">
          {record.agentsUsed.map((id) => (
            <span
              key={id}
              className="inline-flex items-center gap-1.5 font-mono text-[10px] px-2.5 py-1 border rounded-full"
              style={{ borderColor: `${accentForAgentId(id)}55`, color: accentForAgentId(id) }}
            >
              <span className="w-1 h-1 rounded-full" style={{ backgroundColor: accentForAgentId(id) }} />
              {agentNameForId(id).toUpperCase()}
            </span>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-10 mt-10">
        <div>
          <p className="font-mono text-[11px] text-ivory-dim/60 mb-3 tracking-wide">
            FINDINGS
          </p>
          <div className="space-y-5">
            {record.findings.map((f) => (
              <div key={f.agentId} className="border-l-2 pl-4" style={{ borderColor: `${accentForAgentId(f.agentId)}70` }}>
                <p className="font-mono text-[10px] mb-1" style={{ color: accentForAgentId(f.agentId) }}>
                  {agentNameForId(f.agentId).toUpperCase()} · {Math.round(f.confidence * 100)}%
                </p>
                <p className="text-sm text-ivory-dim leading-relaxed">{f.note}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="font-mono text-[11px] text-ivory-dim/60 mb-3 tracking-wide">
            CONTRADICTIONS
          </p>
          {record.contradictions.length === 0 ? (
            <p className="text-sm text-ivory-dim/60">None flagged in this session.</p>
          ) : (
            <ul className="space-y-3">
              {record.contradictions.map((c) => (
                <li key={c} className="text-sm text-coral leading-relaxed flex gap-2">
                  <span className="mt-1">·</span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-6 mt-14 pt-8 border-t border-chamber-line">
        <Link
          to="/history"
          className="text-sm text-ivory-dim hover:text-ivory transition-colors"
        >
          ← Back to history
        </Link>
        <Link
          to="/verify"
          className="text-sm text-copper hover:text-amber transition-colors"
        >
          Run another verification
        </Link>
      </div>
    </div>
  );
}
