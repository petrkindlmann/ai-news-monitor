import Link from 'next/link';
import { Header, Footer } from '@/components';
import { getAllIssues, getLatestSlug, issueNo, weekNo, firstSentence, issueHref } from '@/lib/issues';

export const dynamic = 'force-static';

export const metadata = {
  title: 'Archive — AI News Monitor',
  description: 'Every back issue of AI News Monitor, by week.',
};

export default function ArchivePage() {
  const issues = getAllIssues();
  const latestSlug = getLatestSlug();
  return (
    <>
      <Header active="archive" />
      <main className="page">
        <div className="page-header">
          <div className="ph-kicker">The Archive</div>
          <h1>Every issue, by week.</h1>
          <p className="ph-lede">A running record of what mattered. Newest first — each issue is a complete weekly read, kept exactly as it was published.</p>
        </div>
        <div className="archive-list">
          {issues.map((i) => {
            const labels = [...new Set(i.sections.flatMap((s) => s.stories.map((st) => st.label)))].slice(0, 4);
            const isLatest = i.slug === latestSlug;
            return (
              <Link className="archive-item" href={issueHref(i.slug, latestSlug)} key={i.slug}>
                <div className="ai-no">No. {issueNo(i.slug)}<span className="wk">Week {weekNo(i.slug)}</span></div>
                <div>
                  <h3 className="ai-title">{i.issueTitle}</h3>
                  <p className="ai-teaser">{firstSentence(i.editorLetter)}</p>
                  <div className="ai-tags">
                    {labels.map((l) => <span className={`tag ${l}`} key={l}>{l}</span>)}
                  </div>
                </div>
                <div className="ai-read">{isLatest ? 'Current ↗' : 'Read ↗'}</div>
              </Link>
            );
          })}
        </div>
      </main>
      <Footer recent={issues} latestSlug={latestSlug} />
    </>
  );
}
