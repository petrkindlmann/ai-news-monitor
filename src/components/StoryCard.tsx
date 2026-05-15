import { Story } from '@/lib/types';

interface Props {
  story: Story;
  index: number;
}

const labelColors: Record<Story['label'], string> = {
  Signal:   'bg-emerald-100 text-emerald-900',
  Tool:     'bg-sky-100 text-sky-900',
  Research: 'bg-violet-100 text-violet-900',
  Model:    'bg-amber-100 text-amber-900',
  Policy:   'bg-rose-100 text-rose-900',
  Drama:    'bg-orange-100 text-orange-900',
  Ignore:   'bg-stone-200 text-stone-700',
};

export function StoryCard({ story, index }: Props) {
  const date = new Date(story.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  return (
    <article className="border-b border-stone-200 py-6">
      <div className="flex items-center gap-3 mb-2 text-xs uppercase tracking-wider">
        <span className={`px-2 py-0.5 rounded ${labelColors[story.label]}`}>{story.label}</span>
        <span className="text-stone-500">{story.source}</span>
        <span className="text-stone-400">·</span>
        <span className="text-stone-500">{date}</span>
        <span className="ml-auto text-stone-400">{'•'.repeat(story.heat)}</span>
      </div>
      <h3 className="text-xl font-serif font-bold text-stone-900 mb-2">
        <a href={story.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
          {story.title}
        </a>
      </h3>
      <p className="text-stone-700 mb-3">{story.blurb}</p>
      <p className="text-sm text-stone-600 italic mb-1"><strong className="not-italic">Why it matters:</strong> {story.whyItMatters}</p>
      <p className="text-sm text-stone-600"><strong>Takeaway:</strong> {story.takeaway}</p>
    </article>
  );
}
