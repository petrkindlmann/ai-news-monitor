import { IssueView } from '@/components/IssueView';
import { Header, Footer } from '@/components';
import { getAllIssues, getIssue, getLatestSlug, issueNo } from '@/lib/issues';
import { notFound } from 'next/navigation';

export function generateStaticParams() {
  return getAllIssues().map((i) => ({ slug: i.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const issue = getIssue(params.slug);
  if (!issue) return {};
  return {
    title: `No. ${issueNo(issue.slug)} — ${issue.issueTitle} · AI News Monitor`,
    description: issue.editorLetter.slice(0, 155),
  };
}

export default function IssuePage({ params }: { params: { slug: string } }) {
  const issue = getIssue(params.slug);
  if (!issue) notFound();
  const issues = getAllIssues();
  const latestSlug = getLatestSlug();
  return (
    <>
      <Header active="archive" issue={issue} />
      <IssueView issue={issue} />
      <Footer recent={issues} latestSlug={latestSlug} />
    </>
  );
}
