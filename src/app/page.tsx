import { IssueView } from '@/components/IssueView';
import { Header, Footer } from '@/components';
import { getAllIssues, getLatestSlug } from '@/lib/issues';

export const dynamic = 'force-static';

export default function Home() {
  const issues = getAllIssues();
  const issue = issues[0];
  const latestSlug = getLatestSlug();
  return (
    <>
      <Header active="home" issue={issue} />
      <IssueView issue={issue} />
      <Footer recent={issues} latestSlug={latestSlug} />
    </>
  );
}
