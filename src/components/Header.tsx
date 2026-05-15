import Link from 'next/link';

export function Header() {
  return (
    <header className="border-b border-stone-300 bg-stone-50">
      <div className="max-w-3xl mx-auto px-6 py-6 flex items-baseline justify-between">
        <Link href="/" className="font-serif text-2xl font-bold text-stone-900 hover:text-stone-700">
          AI News Monitor
        </Link>
        <span className="text-xs uppercase tracking-widest text-stone-500">
          Weekly field notes from the AI firehose
        </span>
      </div>
    </header>
  );
}
