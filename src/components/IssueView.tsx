'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Issue, StoryLabel } from '@/lib/types';
import { issueNo, weekNo, fmtRange, fmtFull } from '@/lib/format';
import { EditorLetter } from './EditorLetter';
import { StoryCard } from './StoryCard';

const LABEL_ORDER: StoryLabel[] = ['Signal', 'Tool', 'Research', 'Model', 'Policy', 'Drama', 'Ignore'];
type Sort = 'featured' | 'heat-desc' | 'heat-asc';

export function IssueView({ issue }: { issue: Issue }) {
  const [active, setActive] = useState<Set<StoryLabel>>(new Set());
  const [sort, setSort] = useState<Sort>('featured');
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const headRef = useRef<HTMLElement | null>(null);

  const present = useMemo(
    () => LABEL_ORDER.filter((l) =>
      issue.sections.some((s) => s.stories.some((st) => st.label === l))),
    [issue],
  );

  const filtering = active.size > 0 || sort !== 'featured';
  const totalStories = useMemo(
    () => issue.sections.reduce((n, s) => n + s.stories.length, 0),
    [issue],
  );

  const sectionsView = issue.sections.map((sec) => {
    let stories = sec.stories
      .map((st, j) => ({ st, idx: j }))
      .filter(({ st }) => active.size === 0 || active.has(st.label));
    if (sort !== 'featured') {
      stories = [...stories].sort((a, b) =>
        sort === 'heat-desc' ? b.st.heat - a.st.heat : a.st.heat - b.st.heat);
    }
    return { sec, stories };
  });
  const shown = sectionsView.reduce((n, s) => n + s.stories.length, 0);

  /* sticky brand appears after the masthead scrolls away */
  useEffect(() => {
    headRef.current = document.querySelector('.site-head');
    const onScroll = () => {
      const h = headRef.current?.offsetHeight ?? 200;
      setScrolled(window.scrollY > h - 40);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* scroll-spy over sections + callouts */
  useEffect(() => {
    const ids = [
      ...issue.sections.map((_, i) => `sec-${i}`),
      'try', 'watch',
    ];
    const targets = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el);
    if (!targets.length || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver((entries) => {
      const vis = entries.filter((e) => e.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (vis.length) setActiveSection(vis[0].target.id);
    }, { rootMargin: '-58px 0px -65% 0px', threshold: 0 });
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, [issue, shown]);

  /* reveal-on-scroll */
  useEffect(() => {
    const els = [...document.querySelectorAll('.reveal')] as HTMLElement[];
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduce || !('IntersectionObserver' in window)) {
      els.forEach((e) => e.classList.add('no-anim', 'in'));
      return;
    }
    const vh = window.innerHeight;
    els.forEach((e) => { if (e.getBoundingClientRect().top < vh * 0.95) e.classList.add('in'); });
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.04 });
    els.forEach((e) => { if (!e.classList.contains('in')) io.observe(e); });
    return () => io.disconnect();
  });

  /* close filter popover on outside click */
  useEffect(() => {
    if (!filterOpen) return;
    const close = () => setFilterOpen(false);
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, [filterOpen]);

  function toggleLabel(l: StoryLabel) {
    setActive((prev) => {
      const next = new Set(prev);
      if (next.has(l)) next.delete(l); else next.add(l);
      return next;
    });
  }
  function reset() { setActive(new Set()); setSort('featured'); }

  const jumpLinks = [
    ...issue.sections.map((s, i) => ({ target: `sec-${i}`, label: s.title })),
    { target: 'try', label: 'One Thing' },
    { target: 'watch', label: 'Watch Next' },
  ];

  return (
    <>
      <div className={`jumpnav${scrolled ? ' scrolled' : ''}`}>
        <div className="inner">
          <a className="jn-brand" href="/">AI News <em>M</em></a>
          <nav className="jn-links" aria-label="Sections">
            {jumpLinks.map((l) => {
              const isEmptySection = l.target.startsWith('sec-')
                && sectionsView[parseInt(l.target.slice(4), 10)]?.stories.length === 0;
              if (isEmptySection) return null;
              return (
                <a
                  key={l.target}
                  href={`#${l.target}`}
                  className={activeSection === l.target ? 'active' : undefined}
                >
                  {l.label}
                </a>
              );
            })}
          </nav>
          <div className="jn-tools">
            <button
              className={`tool-btn${filtering ? ' active' : ''}`}
              aria-haspopup="true"
              aria-expanded={filterOpen}
              onClick={(e) => { e.stopPropagation(); setFilterOpen((o) => !o); }}
            >
              <span className="tool-label">Filter &amp; Sort</span><span className="caret">▾</span>
            </button>
          </div>
          <div
            className={`filter-pop${filterOpen ? ' open' : ''}`}
            role="dialog"
            aria-label="Filter and sort"
            onClick={(e) => e.stopPropagation()}
          >
            <h4>Filter by label</h4>
            <div className="chip-row">
              {present.map((l) => (
                <span
                  key={l}
                  className={`chip${active.has(l) ? ' on' : ''}`}
                  onClick={() => toggleLabel(l)}
                >
                  {l}
                </span>
              ))}
            </div>
            <h4>Sort stories</h4>
            <div>
              {([
                ['featured', 'Featured order'],
                ['heat-desc', 'Heat — high to low'],
                ['heat-asc', 'Heat — low to high'],
              ] as [Sort, string][]).map(([key, label]) => (
                <div
                  key={key}
                  className={`sort-opt${sort === key ? ' on' : ''}`}
                  onClick={() => setSort(key)}
                >
                  <span className="radio" /> {label}
                </div>
              ))}
            </div>
            <button className="filter-clear" onClick={reset}>Reset</button>
          </div>
        </div>
      </div>

      <main className="issue">
        <header className="issue-header reveal">
          <div className="ih-meta">
            <span className="iss-no">Issue No. {issueNo(issue.slug)}</span><span className="sep">/</span>
            <span>Week {weekNo(issue.slug)}</span><span className="sep">/</span>
            <span>{fmtRange(issue.weekRange.start, issue.weekRange.end)}</span><span className="sep">/</span>
            <span>Published {fmtFull(issue.publishedAt)}</span>
          </div>
          <h1>{issue.issueTitle}</h1>
        </header>

        <EditorLetter letter={issue.editorLetter} />

        {filtering && (
          <div className="filter-status show">
            Showing <b>{shown}</b> of {totalStories} stories
            {active.size > 0 && <> · labels: {[...active].join(', ')}</>}
            {sort !== 'featured' && <> · {sort === 'heat-desc' ? 'sorted by heat ↓' : 'sorted by heat ↑'}</>}
          </div>
        )}

        {sectionsView.map(({ sec, stories }, i) => (
          <section className="issue-section" id={`sec-${i}`} key={i}>
            <div className="section-head">
              <div className="sh-kicker"><span>{String(i + 1).padStart(2, '0')}</span><span className="line" /></div>
              <h2>{sec.title}</h2>
              <p className="sh-desc">{sec.description}</p>
            </div>
            <div className="section-stories">
              {stories.length === 0
                ? <p className="section-empty">No stories match the current filter.</p>
                : stories.map(({ st, idx }) => <StoryCard key={st.url} story={st} index={i * 100 + idx} />)}
            </div>
          </section>
        ))}

        <div className="callout reveal" id="try">
          <div className="try-box">
            <span className="tb-mark">✻</span>
            <div className="tb-label">One Thing To Try This Week</div>
            <p>{issue.oneThingToTry}</p>
          </div>
        </div>

        <div className="callout reveal" id="watch">
          <div className="callout-head"><h2>Watch Next Week</h2><span className="ch-rule" /></div>
          <ul className="watch-list">
            {issue.watchNext.map((w, i) => {
              const idx = w.indexOf(':');
              const split = idx > 0 && idx < 64;
              return (
                <li key={i}>
                  <span>
                    {split ? <><b>{w.slice(0, idx)}</b>{w.slice(idx)}</> : w}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

      </main>
    </>
  );
}
