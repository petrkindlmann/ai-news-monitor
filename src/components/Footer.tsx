export function Footer() {
  return (
    <footer className="border-t border-stone-300 bg-stone-50 mt-16">
      <div className="max-w-3xl mx-auto px-6 py-8 text-sm text-stone-500 flex justify-between">
        <span>Curated by Claude. Edited by a human.</span>
        <a href="https://github.com/petrkindlmann/ai-news-monitor" className="hover:text-stone-700">
          Source
        </a>
      </div>
    </footer>
  );
}
