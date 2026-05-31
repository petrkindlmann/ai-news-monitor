import { Story } from '@/lib/types';
import { fmtMonthDay } from '@/lib/format';
import { Heat } from './Heat';

interface Props {
  story: Story;
  index: number;
}

export function StoryCard({ story, index }: Props) {
  return (
    <article className="story reveal" data-label={story.label} data-heat={story.heat} data-idx={index}>
      <div className="story-meta">
        <span className={`tag ${story.label}`}>{story.label}</span>
        <span className="src">{story.source}</span>
        <span className="dot-sep">·</span>
        <span className="src">{fmtMonthDay(story.publishedAt)}</span>
        <Heat heat={story.heat} />
      </div>
      <h3>
        <a href={story.url} target="_blank" rel="noopener noreferrer">
          {story.title} <span className="arrow">↗</span>
        </a>
      </h3>
      <p className="blurb">{story.blurb}</p>
      <p className="note"><b>Why it matters</b>&nbsp; {story.whyItMatters}</p>
      <p className="takeaway"><span className="lbl">Takeaway</span>{story.takeaway}</p>
    </article>
  );
}
