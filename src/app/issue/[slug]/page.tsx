import { IssueView } from '@/components/IssueView';
import { Header, Footer } from '@/components';
import { Issue } from '@/lib/types';
import { readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { notFound } from 'next/navigation';

const ISSUES_DIR = resolve(process.cwd(), 'content/issues');

export function generateStaticParams() {
  return readdirSync(ISSUES_DIR)
    .filter(f => /^\d{4}-W\d{2}\.json$/.test(f))
    .map(f => ({ slug: f.replace('.json', '') }));
}

export default function IssuePage({ params }: { params: { slug: string } }) {
  try {
    const raw = readFileSync(resolve(ISSUES_DIR, `${params.slug}.json`), 'utf8');
    const issue = JSON.parse(raw) as Issue;
    return (
      <main className="min-h-screen bg-stone-50">
        <Header />
        <IssueView issue={issue} />
        <Footer />
      </main>
    );
  } catch {
    notFound();
  }
}
