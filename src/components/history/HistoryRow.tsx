import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import type { VerificationRecord } from "../../types/verification";
import { VERDICT_DOT, VERDICT_TEXT } from "./verdictStyles";

export default function HistoryRow({
  record,
  index,
}: {
  record: VerificationRecord;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.4, delay: index * 0.03 }}
      className="grid grid-cols-12 gap-4 items-center py-6 border-b border-chamber-line px-2 -mx-2 hover:bg-chamber/40 transition-colors"
    >
      <div className="col-span-6 sm:col-span-1 font-mono text-xs text-ivory-dim/60">
        {record.id}
      </div>
      <div className="hidden sm:block sm:col-span-2 font-mono text-xs text-ivory-dim/60">
        {record.date}
      </div>
      <div className="col-span-6 sm:col-span-1">
        <span className="font-mono text-[10px] text-copper border border-copper/40 rounded-full px-2 py-0.5">
          {record.type}
        </span>
      </div>
      <div className="col-span-12 sm:col-span-4 mt-2 sm:mt-0">
        <p className="text-sm text-ivory-dim leading-relaxed">{record.claim}</p>
      </div>
      <div className="col-span-6 sm:col-span-2 mt-2 sm:mt-0">
        <span className={`inline-flex items-center gap-2 text-xs font-mono ${VERDICT_TEXT[record.verdict]}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${VERDICT_DOT[record.verdict]}`} />
          {record.verdict}
        </span>
        <span className="block font-mono text-[10px] text-ivory-dim/50 mt-1">
          {Math.round(record.confidence * 100)}% confidence
          {record.contradictions.length > 0 && ` · ${record.contradictions.length} flagged`}
        </span>
      </div>
      <div className="col-span-6 sm:col-span-2 flex justify-end mt-2 sm:mt-0">
        <Link
          to={`/report/${record.id}`}
          className="text-xs text-copper hover:text-amber transition-colors whitespace-nowrap"
        >
          View report
        </Link>
      </div>
    </motion.div>
  );
}
