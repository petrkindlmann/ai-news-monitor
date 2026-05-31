import Link from 'next/link';
import { Header, Footer } from '@/components';
import { SubscribeForm } from '@/components/SubscribeForm';
import { getAllIssues, getLatestSlug } from '@/lib/issues';

export const dynamic = 'force-static';

export const metadata = {
  title: 'Subscribe — AI News Monitor',
  description: 'Get AI News Monitor by email every week, or subscribe via RSS.',
};

export default function SubscribePage() {
  const issues = getAllIssues();
  return (
    <>
      <Header active="subscribe" />
      <main className="page">
        <div className="page-header">
          <div className="ph-kicker">Subscribe</div>
          <h1>One issue a week. Nothing else.</h1>
          <p className="ph-lede">No drip campaigns, no upsells, no &ldquo;you might also like.&rdquo; The week&apos;s AI news, compressed to what matters, delivered once and done.</p>
        </div>

        <div className="sub-card">
          <div className="el-label" style={{ color: 'var(--accent)', marginBottom: 14 }}>By Email</div>
          <p style={{ margin: 0, color: 'var(--ink-soft)', maxWidth: '52ch' }}>Drop your address below. You&apos;ll get each new issue the morning it&apos;s published, plus nothing in between.</p>
          <SubscribeForm />
          <div className="sub-note">Free · Unsubscribe in one click · No spam, ever</div>

          <div className="rss-row" id="rss">
            <div>
              <div style={{ fontFamily: 'var(--display)', fontSize: '1.3rem', color: 'var(--ink)' }}>Prefer a reader?</div>
              <p style={{ margin: '4px 0 0', color: 'var(--muted)', fontSize: '.96rem' }}>Pull every issue into your RSS client. Same content, no inbox.</p>
            </div>
            <a className="btn ghost" href="/feed.xml" style={{ marginLeft: 'auto' }}>RSS Feed</a>
          </div>
        </div>

        <div className="prose-col" style={{ marginTop: 48 }}>
          <h3>What you&apos;re signing up for</h3>
          <p>Every issue follows the same shape: an editor&apos;s letter, the five stories that matter most, builder notes, a policy and infrastructure watch, one concrete thing to try, what to watch next week — and an honest list of the hype we&apos;re ignoring. You can see exactly what that looks like in the <Link href="/" style={{ color: 'var(--accent)' }}>latest issue</Link> or the <Link href="/archive/" style={{ color: 'var(--accent)' }}>archive</Link>.</p>
        </div>
      </main>
      <Footer recent={issues} latestSlug={getLatestSlug()} />
    </>
  );
}
