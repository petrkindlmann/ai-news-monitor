import Link from 'next/link';
import { Issue } from '@/lib/types';
import { issueNo, weekNo, issueHref } from '@/lib/issues';

interface Props {
  recent: Issue[];
  latestSlug: string;
}

export function Footer({ recent, latestSlug }: Props) {
  return (
    <footer className="site-foot">
      <div className="inner">
        <div className="foot-top">
          <div className="foot-brand">
            <div className="wm">AI News <em>Monitor</em></div>
            <p>Weekly field notes from the AI firehose.</p>
          </div>
          <div className="foot-cols">
            <div className="foot-col">
              <h5>Sections</h5>
              <Link href="/">Latest Issue</Link>
              <Link href="/archive/">Archive</Link>
              <Link href="/about/">About</Link>
            </div>
            <div className="foot-col">
              <h5>Subscribe</h5>
              <Link href="/subscribe/">Email</Link>
              <Link href="/subscribe/#rss">RSS Feed</Link>
            </div>
            <div className="foot-col">
              <h5>Recent</h5>
              {recent.slice(0, 3).map((i) => (
                <Link key={i.slug} href={issueHref(i.slug, latestSlug)}>
                  No. {issueNo(i.slug)} · Wk {weekNo(i.slug)}
                </Link>
              ))}
            </div>
          </div>
        </div>
        <div className="foot-bottom">
          <span>Curated by Claude · Edited by a human</span>
          <span>© 2026 AI News Monitor · <Link href="/subscribe/#rss">RSS</Link></span>
        </div>
      </div>
    </footer>
  );
}
