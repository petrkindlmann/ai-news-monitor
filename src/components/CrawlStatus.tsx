'use client';

import { CrawlStatus as CrawlStatusType } from '@/lib/types';
import { formatRelativeTime, getSourceLabel } from '@/lib/utils';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

interface CrawlStatusProps {
  statuses: CrawlStatusType[];
}

export function CrawlStatus({ statuses }: CrawlStatusProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="bg-surface border border-border rounded-lg p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-sm text-muted uppercase tracking-wider">
          Crawler Status
        </h3>
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
          </span>
          <span className="text-xs text-accent font-display">LIVE</span>
        </div>
      </div>

      <div className="space-y-3">
        {statuses.map((status) => (
          <div 
            key={status.source}
            className="flex items-center justify-between p-3 bg-surface-light rounded border border-border"
          >
            <div className="flex items-center gap-3">
              {status.status === 'success' && (
                <CheckCircle className="w-4 h-4 text-positive" />
              )}
              {status.status === 'error' && (
                <XCircle className="w-4 h-4 text-negative" />
              )}
              {status.status === 'running' && (
                <Loader2 className="w-4 h-4 text-accent animate-spin" />
              )}
              <span className="text-sm text-white">
                {getSourceLabel(status.source)}
              </span>
            </div>

            <div className="text-right">
              <div className="text-xs text-muted">
                {mounted ? formatRelativeTime(status.lastRun) : '...'}
              </div>
              {status.status === 'success' && (
                <div className="text-xs text-positive">
                  +{status.itemsCollected} items
                </div>
              )}
              {status.status === 'error' && (
                <div className="text-xs text-negative truncate max-w-32">
                  {status.errorMessage}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
