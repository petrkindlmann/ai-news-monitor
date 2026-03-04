'use client';

import { TrendData } from '@/lib/types';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface TrendCardProps {
  trend: TrendData;
  rank: number;
}

export function TrendCard({ trend, rank }: TrendCardProps) {
  const TrendIcon = trend.change > 0 ? TrendingUp : trend.change < 0 ? TrendingDown : Minus;
  const trendColor = trend.change > 0 ? 'text-positive' : trend.change < 0 ? 'text-negative' : 'text-muted';

  return (
    <div className="flex items-center gap-4 p-3 bg-surface-light rounded-lg border border-border card-hover">
      <div className="w-8 h-8 flex items-center justify-center bg-surface rounded font-display text-accent text-sm">
        {rank}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="font-medium text-white truncate">{trend.topic}</div>
        <div className="text-sm text-muted">{trend.count} mentions</div>
      </div>

      <div className={`flex items-center gap-1 ${trendColor}`}>
        <TrendIcon className="w-4 h-4" />
        <span className="text-sm font-display">
          {trend.change > 0 ? '+' : ''}{trend.change}%
        </span>
      </div>
    </div>
  );
}
