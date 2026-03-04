'use client';

import { DailySummary as DailySummaryType } from '@/lib/types';
import { Sparkles } from 'lucide-react';

interface DailySummaryProps {
  summary: DailySummaryType;
}

export function DailySummary({ summary }: DailySummaryProps) {
  return (
    <div className="bg-surface border border-accent/30 rounded-lg p-5 glow-accent">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-accent" />
        <h3 className="font-display text-sm text-accent uppercase tracking-wider">
          AI Summary — Today
        </h3>
      </div>

      <div className="space-y-3">
        {summary.highlights.map((highlight, index) => (
          <div 
            key={index}
            className="flex items-start gap-3 text-sm"
          >
            <span className="text-accent font-display mt-0.5">→</span>
            <span className="text-gray-300 leading-relaxed">{highlight}</span>
          </div>
        ))}
      </div>

      <div className="mt-5 pt-4 border-t border-border">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted">Sentiment breakdown</span>
          <div className="flex items-center gap-4">
            <span className="text-positive">
              ↑ {summary.sentimentBreakdown.positive}
            </span>
            <span className="text-neutral">
              → {summary.sentimentBreakdown.neutral}
            </span>
            <span className="text-negative">
              ↓ {summary.sentimentBreakdown.negative}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
