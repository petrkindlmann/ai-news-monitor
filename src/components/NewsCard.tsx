'use client';

import { useState, useEffect } from 'react';
import { NewsItem, SOURCE_COLORS } from '@/lib/types';
import { formatRelativeTime, formatNumber, getSourceLabel } from '@/lib/utils';
import { ExternalLink, MessageCircle, ArrowUp } from 'lucide-react';

interface NewsCardProps {
  item: NewsItem;
}

export function NewsCard({ item }: NewsCardProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const sentimentClass =
    item.sentiment === 'positive' ? 'sentiment-positive' :
    item.sentiment === 'negative' ? 'sentiment-negative' : 'sentiment-neutral';

  return (
    <article className="bg-surface border border-border rounded-lg p-5 card-hover">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-center gap-2">
          <span
            className="source-badge px-2 py-1 rounded"
            style={{
              backgroundColor: `${SOURCE_COLORS[item.source]}15`,
              color: SOURCE_COLORS[item.source],
              border: `1px solid ${SOURCE_COLORS[item.source]}40`
            }}
          >
            {getSourceLabel(item.source)}
          </span>
          <span className="text-muted text-sm">
            {mounted ? formatRelativeTime(item.publishedAt) : '...'}
          </span>
        </div>
        <span className={`text-xs px-2 py-1 rounded ${sentimentClass}`}>
          {item.sentiment}
        </span>
      </div>

      <a 
        href={item.url} 
        target="_blank" 
        rel="noopener noreferrer"
        className="group"
      >
        <h3 className="text-lg font-medium text-white mb-2 group-hover:text-accent transition-colors flex items-start gap-2">
          {item.title}
          <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-1" />
        </h3>
      </a>

      {item.summary && (
        <p className="text-muted text-sm mb-4 leading-relaxed">
          {item.summary}
        </p>
      )}

      <div className="flex flex-wrap gap-2 mb-4">
        {item.topics.slice(0, 4).map((topic) => (
          <span 
            key={topic}
            className="text-xs px-2 py-1 bg-surface-light text-muted rounded border border-border"
          >
            #{topic}
          </span>
        ))}
      </div>

      {item.engagement && (
        <div className="flex items-center gap-4 text-sm text-muted">
          {item.engagement.upvotes && (
            <div className="flex items-center gap-1">
              <ArrowUp className="w-4 h-4" />
              <span>{formatNumber(item.engagement.upvotes)}</span>
            </div>
          )}
          {item.engagement.comments && (
            <div className="flex items-center gap-1">
              <MessageCircle className="w-4 h-4" />
              <span>{formatNumber(item.engagement.comments)}</span>
            </div>
          )}
        </div>
      )}
    </article>
  );
}
