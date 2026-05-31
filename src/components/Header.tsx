import Link from 'next/link';
import { Issue } from '@/lib/types';
import { issueNo, fmtRange } from '@/lib/issues';
import { MobileNav, NavItem } from './MobileNav';

type NavKey = 'home' | 'archive' | 'about' | 'subscribe';

const NAV: NavItem[] = [
  { key: 'home', label: 'Home', href: '/' },
  { key: 'archive', label: 'Archive', href: '/archive/' },
  { key: 'about', label: 'About', href: '/about/' },
  { key: 'subscribe', label: 'Subscribe', href: '/subscribe/' },
];

interface Props {
  active: NavKey;
  issue?: Issue;
}

export function Header({ active, issue }: Props) {
  const left = issue
    ? <span className="ht-issue">Issue No. <b>{issueNo(issue.slug)}</b> — {issue.sections[0]?.title}</span>
    : <span className="ht-issue">Independent · Reader-supported</span>;
  const right = issue
    ? <span>{fmtRange(issue.weekRange.start, issue.weekRange.end)}</span>
    : <span>Signal, not firehose</span>;

  return (
    <header className="site-head">
      <div className="inner">
        <div className="head-top">{left}{right}</div>
        <Link className="wordmark" href="/">AI News <em>Monitor</em></Link>
        <div className="head-rule" />
        <div className="head-bottom">
          <div className="tagline">Weekly field notes from the AI firehose</div>
          <nav className="mainnav" aria-label="Primary">
            {NAV.map(({ key, label, href }) => (
              <Link
                key={key}
                href={href}
                className={key === active ? 'active' : undefined}
                aria-current={key === active ? 'page' : undefined}
              >
                {label}
              </Link>
            ))}
            <Link href="/subscribe/#rss" className="nav-rss">RSS</Link>
          </nav>
          <MobileNav active={active} nav={NAV} />
        </div>
      </div>
    </header>
  );
}
