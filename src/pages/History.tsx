import { useMemo, useState } from "react";
import HistoryFilters from "../components/history/HistoryFilters";
import HistoryRow from "../components/history/HistoryRow";
import { HISTORY } from "../data/history";
import type { Verdict, VerificationType } from "../types/verification";

export default function History() {
  const [search, setSearch] = useState("");
  const [type, setType] = useState<VerificationType | "all">("all");
  const [verdict, setVerdict] = useState<Verdict | "all">("all");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return HISTORY.filter((record) => {
      const matchesSearch = q.length === 0 || record.claim.toLowerCase().includes(q);
      const matchesType = type === "all" || record.type === type;
      const matchesVerdict = verdict === "all" || record.verdict === verdict;
      return matchesSearch && matchesType && matchesVerdict;
    });
  }, [search, type, verdict]);

  return (
    <div className="relative z-10">
      <section className="mx-auto max-w-7xl px-6 md:px-10 pt-16 md:pt-20 pb-10">
        <p className="font-mono text-xs text-copper mb-6">verification history</p>
        <h1 className="font-display text-4xl md:text-6xl text-ivory max-w-2xl">
          Every session, on the record.
        </h1>
        <p className="mt-6 max-w-lg text-ivory-dim text-sm leading-relaxed">
          A log of past verifications this demo has run, searchable by claim
          and filterable by type or verdict.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-6 md:px-10 pb-10">
        <HistoryFilters
          search={search}
          onSearchChange={setSearch}
          type={type}
          onTypeChange={setType}
          verdict={verdict}
          onVerdictChange={setVerdict}
        />
      </section>

      <section className="mx-auto max-w-7xl px-6 md:px-10 pb-24 md:pb-32">
        <div className="border-t border-chamber-line">
          {filtered.length === 0 ? (
            <p className="py-14 text-sm text-ivory-dim/60 font-mono text-center">
              No verifications match those filters.
            </p>
          ) : (
            filtered.map((record, i) => (
              <HistoryRow key={record.id} record={record} index={i} />
            ))
          )}
        </div>
      </section>
    </div>
  );
}
