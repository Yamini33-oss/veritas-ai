const EXAMPLES = [
  "Drinking eight glasses of water a day is scientifically required for good health.",
  "Global smartphone adoption surpassed 80% of the world's population in 2025.",
  "The Amazon rainforest produces 20% of the world's oxygen.",
];

interface ClaimFormProps {
  claim: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  disabled: boolean;
}

export default function ClaimForm({ claim, onChange, onSubmit, disabled }: ClaimFormProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <label htmlFor="claim-input" className="font-mono text-[10px] text-copper tracking-[0.18em]">CLAIM INPUT</label>
        <span className="font-mono text-[10px] text-ivory-dim/40">TEXT / NATURAL LANGUAGE</span>
      </div>
      <textarea
        id="claim-input"
        value={claim}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        rows={4}
        placeholder="State a claim for the council to verify…"
        className="verify-claim-input w-full bg-transparent border-b border-chamber-line px-0 py-4 text-lg md:text-xl text-ivory placeholder:text-ivory-dim/40 focus:border-amber/70 outline-none transition-colors resize-none disabled:opacity-60"
      />

      <div className="flex flex-wrap gap-2 mt-4">
        {EXAMPLES.map((example) => (
          <button
            key={example}
            type="button"
            disabled={disabled}
            onClick={() => onChange(example)}
            className="text-left text-xs text-ivory-dim/70 hover:text-ivory border-b border-chamber-line hover:border-amber/50 px-1 py-1.5 transition-colors disabled:opacity-50"
          >
            {example.length > 52 ? `${example.slice(0, 52)}…` : example}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={onSubmit}
        disabled={disabled || claim.trim().length === 0}
        className="mt-7 bg-amber text-void font-medium text-sm px-6 py-3 rounded-sm hover:bg-ivory transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {disabled ? "Council in session…" : "Begin verification"}
      </button>
    </div>
  );
}
