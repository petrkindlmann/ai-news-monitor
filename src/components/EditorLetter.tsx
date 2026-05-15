interface Props {
  letter: string;
  issueTitle: string;
  slug: string;
  weekRange: { start: string; end: string };
}

function formatRange(start: string, end: string): string {
  const s = new Date(start);
  const e = new Date(end);
  const fmt = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  return `${fmt(s)} – ${fmt(e)}, ${e.getUTCFullYear()}`;
}

export function EditorLetter({ letter, issueTitle, slug, weekRange }: Props) {
  return (
    <section className="border-b border-stone-300 pb-10 mb-12">
      <div className="text-xs uppercase tracking-widest text-stone-500 mb-2">
        Issue {slug.replace('-W', ' · Week ')} · {formatRange(weekRange.start, weekRange.end)}
      </div>
      <h1 className="text-4xl md:text-5xl font-serif font-bold text-stone-900 mb-6 leading-tight">
        {issueTitle}
      </h1>
      <div className="prose prose-stone max-w-prose text-stone-700 text-lg leading-relaxed whitespace-pre-wrap">
        {letter}
      </div>
    </section>
  );
}
