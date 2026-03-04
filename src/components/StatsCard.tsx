'use client';

import { ReactNode } from 'react';

interface StatsCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  icon?: ReactNode;
  trend?: {
    value: number;
    label: string;
  };
}

export function StatsCard({ label, value, subValue, icon, trend }: StatsCardProps) {
  return (
    <div className="bg-surface border border-border rounded-lg p-5">
      <div className="flex items-start justify-between">
        <div>
          <div className="font-display text-xs text-muted uppercase tracking-wider mb-2">
            {label}
          </div>
          <div className="text-3xl font-display text-white mb-1">
            {value}
          </div>
          {subValue && (
            <div className="text-sm text-muted">{subValue}</div>
          )}
          {trend && (
            <div className={`text-sm mt-2 ${trend.value >= 0 ? 'text-positive' : 'text-negative'}`}>
              {trend.value >= 0 ? '↑' : '↓'} {Math.abs(trend.value)}% {trend.label}
            </div>
          )}
        </div>
        {icon && (
          <div className="text-accent opacity-50">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
