import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import CouncilChamber from "../visuals/CouncilChamber";

export default function Hero() {
  return (
    <section className="relative z-10 overflow-hidden min-h-[640px] md:min-h-[760px] flex items-center">
      <CouncilChamber />

      {/* readability wash — darkens behind the text, thins out toward the chamber */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(100deg, rgba(11,10,8,0.94) 0%, rgba(11,10,8,0.82) 32%, rgba(11,10,8,0.35) 58%, rgba(11,10,8,0.05) 78%)",
        }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-24 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, transparent, var(--color-void))" }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-10 py-24 w-full">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-xl"
        >
          <p className="text-copper font-mono text-xs mb-6">
            eight autonomous agents · one holographic chamber
          </p>
          <h1 className="font-display text-[2.6rem] leading-[1.05] sm:text-6xl md:text-[4.2rem] text-ivory">
            Don't trust one AI.
            <br />
            <span className="text-amber">Make AI verify AI.</span>
          </h1>
          <p className="mt-8 max-w-md text-ivory-dim text-base leading-relaxed">
            VERITAS puts a claim in front of a council of eight
            reasoning agents that research, challenge and cross-examine
            each other before a Judge — not a vote count — decides
            what holds up.
          </p>
          <div className="mt-10 flex items-center gap-5">
            <Link
              to="/verify"
              className="bg-amber text-void font-medium text-sm px-6 py-3 rounded-sm hover:bg-ivory transition-colors"
            >
              Begin a verification
            </Link>
            <Link
              to="/agents"
              className="text-sm text-ivory-dim hover:text-ivory transition-colors border-b border-transparent hover:border-amber/60 pb-0.5"
            >
              Meet the council
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
