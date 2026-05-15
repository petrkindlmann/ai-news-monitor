import { IssueView } from '@/components/IssueView';
import { Header, Footer } from '@/components';
import { Issue } from '@/lib/types';
import latest from '../../content/issues/latest.json';

export default function Home() {
  const issue = latest as Issue;
  return (
    <main className="min-h-screen bg-stone-50">
      <Header />
      <IssueView issue={issue} />
      <Footer />
    </main>
  );
}

export const dynamic = 'force-static';
