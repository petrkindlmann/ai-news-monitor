import Link from 'next/link';
import { Header, Footer } from '@/components';
import { getAllIssues, getLatestSlug } from '@/lib/issues';

export const dynamic = 'force-static';

export const metadata = {
  title: 'About — AI News Monitor',
  description: "Signal, not firehose. Who's behind AI News Monitor and the editorial promise.",
};

const PROMISES = [
  { num: '01', title: 'One read a week', body: 'A single, finite issue. No infinite feed, no notifications, no fear of missing out engineered into the product.' },
  { num: '02', title: 'Ruthless cuts', body: "If it doesn't change what you build or decide, it doesn't make the issue — and we say what we skipped." },
  { num: '03', title: 'So what, now what', body: 'Every story ends with why it matters and a concrete takeaway. Analysis you can act on, not just absorb.' },
  { num: '04', title: 'No hype tax', body: "We're not selling a model, a fund, or a course. The only incentive is being right enough that you keep reading." },
];

export default function AboutPage() {
  const issues = getAllIssues();
  return (
    <>
      <Header active="about" />
      <main className="page">
        <div className="page-header">
          <div className="ph-kicker">About</div>
          <h1>Signal, not firehose.</h1>
          <p className="ph-lede">There is no shortage of AI news. There is a desperate shortage of judgment about which of it matters. That gap is the whole job.</p>
        </div>

        <div className="prose-col" style={{ marginTop: 40 }}>
          <p>Every week, hundreds of model releases, funding rounds, benchmark papers, and product launches cross the wire. Most of it is noise dressed as news — demo videos, roadmap items, case studies where the ROI math is left as an exercise for the reader. <em>AI News Monitor</em> reads all of it so you don&apos;t have to, and then throws almost all of it away.</p>
          <p>What&apos;s left is the handful of developments that actually change what a builder or a decision-maker should do this week. Each one comes with a plain answer to two questions you&apos;re already asking: <strong>why does this matter</strong>, and <strong>what should I do about it</strong>.</p>

          <h3>How it&apos;s made</h3>
          <p>Stories are gathered and clustered from a wide net of feeds, then ranked by signal. A human editor makes the final cut, writes the letter, and is accountable for every call — including the ones in &ldquo;Hype I&apos;m Ignoring,&rdquo; where we show our work on what got cut and why. The voice is single and opinionated on purpose. You can disagree with it; you&apos;ll always know where it stands.</p>
        </div>

        <div className="promise-grid">
          {PROMISES.map((p) => (
            <div className="promise-cell" key={p.num}>
              <div className="pc-num">{p.num}</div>
              <h4>{p.title}</h4>
              <p>{p.body}</p>
            </div>
          ))}
        </div>

        <div className="prose-col">
          <h3>Who&apos;s behind it</h3>
          <p>A small editorial operation: research curated by Claude, edited by a human who&apos;s been shipping software through every hype cycle since the last one. Independent and reader-supported — the archive stays free, and it always will.</p>
          <p className="lead">If you want the week&apos;s AI news compressed to what&apos;s worth your attention, you&apos;re in the right place.</p>
          <p style={{ marginTop: 28 }}>
            <Link className="btn" href="/subscribe/">Subscribe — it&apos;s free</Link>
            <Link className="btn ghost" href="/archive/" style={{ marginLeft: 8 }}>Read the archive</Link>
          </p>
        </div>
      </main>
      <Footer recent={issues} latestSlug={getLatestSlug()} />
    </>
  );
}
