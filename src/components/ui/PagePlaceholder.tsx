interface PagePlaceholderProps {
  title: string;
  note: string;
}

export default function PagePlaceholder({ title, note }: PagePlaceholderProps) {
  return (
    <section className="relative z-10 mx-auto max-w-7xl px-6 md:px-10 py-28 md:py-40">
      <p className="font-mono text-xs text-copper mb-6">under construction</p>
      <h1 className="font-display text-4xl md:text-6xl text-ivory max-w-2xl">
        {title}
      </h1>
      <p className="mt-6 text-ivory-dim max-w-md">{note}</p>
    </section>
  );
}
