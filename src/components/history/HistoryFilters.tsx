import type { Verdict, VerificationType } from "../../types/verification";

const TYPES: VerificationType[] = [
  "Factual",
  "Statistical",
  "Historical",
  "Scientific",
  "Policy",
];

const VERDICTS: Verdict[] = ["supported", "contradicted", "inconclusive"];

interface HistoryFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  type: VerificationType | "all";
  onTypeChange: (value: VerificationType | "all") => void;
  verdict: Verdict | "all";
  onVerdictChange: (value: Verdict | "all") => void;
}

export default function HistoryFilters({
  search,
  onSearchChange,
  type,
  onTypeChange,
  verdict,
  onVerdictChange,
}: HistoryFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <input
        type="text"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search claims…"
        className="flex-1 bg-chamber border border-chamber-line rounded-sm px-4 py-2.5 text-sm text-ivory placeholder:text-ivory-dim/50 focus:border-amber/60 outline-none transition-colors"
      />
      <select
        value={type}
        onChange={(e) => onTypeChange(e.target.value as VerificationType | "all")}
        className="bg-chamber border border-chamber-line rounded-sm px-4 py-2.5 text-sm text-ivory-dim focus:border-amber/60 outline-none transition-colors"
      >
        <option value="all">All types</option>
        {TYPES.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>
      <select
        value={verdict}
        onChange={(e) => onVerdictChange(e.target.value as Verdict | "all")}
        className="bg-chamber border border-chamber-line rounded-sm px-4 py-2.5 text-sm text-ivory-dim focus:border-amber/60 outline-none transition-colors"
      >
        <option value="all">All verdicts</option>
        {VERDICTS.map((v) => (
          <option key={v} value={v}>
            {v.charAt(0).toUpperCase() + v.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
}
