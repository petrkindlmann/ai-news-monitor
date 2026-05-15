import { Issue } from '@/lib/types';
import { EditorLetter } from './EditorLetter';
import { StoryCard } from './StoryCard';

export function IssueView({ issue }: { issue: Issue }) {
  return (
    <article className="max-w-3xl mx-auto px-6 py-12">
      <EditorLetter
        letter={issue.editorLetter}
        issueTitle={issue.issueTitle}
        slug={issue.slug}
        weekRange={issue.weekRange}
      />

      {issue.sections.map((section, i) => (
        <section key={i} className="mb-12">
          <h2 className="text-2xl font-serif font-bold text-stone-900 mb-1">{section.title}</h2>
          <p className="text-stone-500 italic mb-4">{section.description}</p>
          {section.stories.map((story, idx) => <StoryCard key={story.url} story={story} index={idx} />)}
        </section>
      ))}

      <section className="border-t border-stone-300 pt-8 mb-12">
        <h2 className="text-xl font-serif font-bold text-stone-900 mb-4">One Thing To Try</h2>
        <p className="text-stone-700">{issue.oneThingToTry}</p>
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-serif font-bold text-stone-900 mb-4">Watch Next Week</h2>
        <ul className="space-y-2">
          {issue.watchNext.map((w, i) => (
            <li key={i} className="text-stone-700 before:content-['→'] before:mr-3 before:text-stone-400">{w}</li>
          ))}
        </ul>
      </section>

      <section className="border-t border-stone-300 pt-8">
        <h2 className="text-xl font-serif font-bold text-stone-900 mb-4">Hype I&apos;m Ignoring</h2>
        <ul className="space-y-3">
          {issue.ignoredThisWeek.map((t, i) => (
            <li key={i} className="text-stone-700">
              <strong className="text-stone-900">{t.theme}</strong> — <span className="text-stone-600">{t.reason}</span>
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}
