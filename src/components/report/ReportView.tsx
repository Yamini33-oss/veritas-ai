import { Link } from "react-router-dom";
import type { VerificationRecord } from "../../types/verification";
import { VERDICT_DOT, VERDICT_TEXT } from "../history/verdictStyles";
import {
  accentForAgentId,
  agentNameForId,
} from "../../utils/agentAccent";

export default function ReportView({
  record,
}: {
  record: VerificationRecord;
}) {
  return (
    <div>
      <p className="font-mono text-xs text-copper mb-4">
        {record.id} · {record.date} · {record.type}
      </p>

      <h1 className="font-display text-3xl md:text-5xl text-ivory max-w-2xl leading-tight">
        {record.claim}
      </h1>

      <div className="flex flex-wrap items-center gap-6 mt-8">
        <span
          className={`inline-flex items-center gap-2 text-sm font-mono ${VERDICT_TEXT[record.verdict]}`}
        >
          <span
            className={`w-2 h-2 rounded-full ${VERDICT_DOT[record.verdict]}`}
          />
          {record.verdict.toUpperCase()}
        </span>

        <div className="flex items-center gap-2">
          <div className="w-32 h-1 bg-chamber-line rounded-full overflow-hidden">
            <div
              className="h-full bg-amber"
              style={{
                width: `${Math.round(
                  record.confidence * 100
                )}%`,
              }}
            />
          </div>

          <span className="font-mono text-xs text-ivory-dim">
            {Math.round(record.confidence * 100)}%
            confidence
          </span>
        </div>
      </div>

      {/* AGENTS USED */}
      <div className="mt-10">
        <p className="font-mono text-[11px] text-ivory-dim/60 mb-3 tracking-wide">
          AGENTS USED
        </p>

        <div className="flex flex-wrap gap-2">
          {record.agentsUsed.map((id) => (
            <span
              key={id}
              className="inline-flex items-center gap-1.5 font-mono text-[10px] px-2.5 py-1 border rounded-full"
              style={{
                borderColor: `${accentForAgentId(id)}55`,
                color: accentForAgentId(id),
              }}
            >
              <span
                className="w-1 h-1 rounded-full"
                style={{
                  backgroundColor: accentForAgentId(id),
                }}
              />

              {agentNameForId(id).toUpperCase()}
            </span>
          ))}
        </div>
      </div>

      {/* CONFIDENCE BREAKDOWN */}
      <div className="mt-10 pt-8 border-t border-chamber-line">
        <p className="font-mono text-[11px] text-ivory-dim/60 mb-5 tracking-wide">
          CONFIDENCE BREAKDOWN
        </p>

        <div className="space-y-4 max-w-3xl">
          {record.findings.map((finding) => {
            const percentage = Math.round(
              finding.confidence * 100
            );

            return (
              <div key={finding.agentId}>
                <div className="flex items-center justify-between mb-1.5">
                  <span
                    className="font-mono text-[10px]"
                    style={{
                      color: accentForAgentId(finding.agentId),
                    }}
                  >
                    {agentNameForId(
                      finding.agentId
                    ).toUpperCase()}
                  </span>

                  <span className="font-mono text-[10px] text-ivory-dim/60">
                    {percentage}%
                  </span>
                </div>

                <div className="h-1 bg-chamber-line rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber"
                    style={{
                      width: `${percentage}%`,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex items-center justify-between max-w-3xl pt-4 border-t border-chamber-line">
          <span className="font-mono text-[10px] text-ivory-dim/60 tracking-wide">
            FINAL JUDGE CONFIDENCE
          </span>

          <span
            className={`font-mono text-sm ${VERDICT_TEXT[record.verdict]}`}
          >
            {Math.round(record.confidence * 100)}%
          </span>
        </div>
      </div>

      {/* FINDINGS + CONTRADICTIONS */}
      <div className="grid md:grid-cols-2 gap-10 mt-10">
        <div>
          <p className="font-mono text-[11px] text-ivory-dim/60 mb-3 tracking-wide">
            FINDINGS
          </p>

          <div className="space-y-5">
            {record.findings.map((f) => (
              <div
                key={f.agentId}
                className="border-l-2 pl-4"
                style={{
                  borderColor: `${accentForAgentId(
                    f.agentId
                  )}70`,
                }}
              >
                <p
                  className="font-mono text-[10px] mb-1"
                  style={{
                    color: accentForAgentId(f.agentId),
                  }}
                >
                  {agentNameForId(f.agentId).toUpperCase()} ·{" "}
                  {Math.round(f.confidence * 100)}%
                </p>

                <p className="text-sm text-ivory-dim leading-relaxed">
                  {f.note}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="font-mono text-[11px] text-ivory-dim/60 mb-3 tracking-wide">
            CONTRADICTIONS
          </p>

          {record.contradictions.length === 0 ? (
            <p className="text-sm text-ivory-dim/60">
              None flagged in this session.
            </p>
          ) : (
            <ul className="space-y-3">
              {record.contradictions.map((c) => (
                <li
                  key={c}
                  className="text-sm text-coral leading-relaxed flex gap-2"
                >
                  <span className="mt-1">·</span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* SOURCES */}
      {record.sources && record.sources.length > 0 && (
        <div className="mt-14 pt-8 border-t border-chamber-line">
          <p className="font-mono text-[11px] text-ivory-dim/60 mb-4 tracking-wide">
            RESEARCH SOURCES
          </p>

          <div className="space-y-4">
            {record.sources.map((source, index) => {
              const separator = " — ";
              const separatorIndex =
                source.lastIndexOf(separator);

              const title =
                separatorIndex !== -1
                  ? source.slice(0, separatorIndex)
                  : source;

              const url =
                separatorIndex !== -1
                  ? source.slice(
                      separatorIndex + separator.length
                    )
                  : "";

              return (
                <div
                  key={`${source}-${index}`}
                  className="flex gap-3 text-sm"
                >
                  <span className="font-mono text-[10px] text-copper">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <div className="min-w-0">
                    <p className="text-ivory-dim leading-relaxed">
                      {title}
                    </p>

                    {url && (
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 block text-xs text-copper hover:text-amber transition-colors break-all"
                      >
                        {url}
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* JUDGE READOUT */}
      {record.judgeDetails && (
        <div className="mt-14 pt-8 border-t border-chamber-line">
          <p className="font-mono text-[11px] text-ivory-dim/60 mb-6 tracking-wide">
            JUDGE READOUT
          </p>

          <div className="grid md:grid-cols-2 gap-10">
            {/* Supporting findings */}
            <div>
              <p className="font-mono text-[10px] text-copper tracking-wide mb-3">
                KEY SUPPORTING FINDINGS
              </p>

              {record.judgeDetails.keySupportingFindings
                .length === 0 ? (
                <p className="text-sm text-ivory-dim/60">
                  None recorded.
                </p>
              ) : (
                <ul className="space-y-3">
                  {record.judgeDetails.keySupportingFindings.map(
                    (finding, index) => (
                      <li
                        key={`${finding}-${index}`}
                        className="text-sm text-ivory-dim leading-relaxed flex gap-2"
                      >
                        <span className="text-copper">
                          +
                        </span>

                        <span>{finding}</span>
                      </li>
                    )
                  )}
                </ul>
              )}
            </div>

            {/* Concerns */}
            <div>
              <p className="font-mono text-[10px] text-coral tracking-wide mb-3">
                KEY CONCERNS
              </p>

              {record.judgeDetails.keyConcerns.length === 0 ? (
                <p className="text-sm text-ivory-dim/60">
                  None recorded.
                </p>
              ) : (
                <ul className="space-y-3">
                  {record.judgeDetails.keyConcerns.map(
                    (concern, index) => (
                      <li
                        key={`${concern}-${index}`}
                        className="text-sm text-ivory-dim leading-relaxed flex gap-2"
                      >
                        <span className="text-coral">
                          !
                        </span>

                        <span>{concern}</span>
                      </li>
                    )
                  )}
                </ul>
              )}
            </div>
          </div>

          <div className="mt-8 flex items-center gap-3">
            <span className="font-mono text-[10px] text-ivory-dim/60 tracking-wide">
              CONTRADICTIONS RESOLVED
            </span>

            <span
              className={
                record.judgeDetails.contradictionsResolved
                  ? "font-mono text-xs text-copper"
                  : "font-mono text-xs text-coral"
              }
            >
              {record.judgeDetails.contradictionsResolved
                ? "YES"
                : "NO"}
            </span>
          </div>
        </div>
      )}

      {/* NAVIGATION */}
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