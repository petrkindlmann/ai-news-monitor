'use client';

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface SentimentChartProps {
  data: Array<{
    date: string;
    positive: number;
    negative: number;
    neutral: number;
  }>;
}

export function SentimentChart({ data }: SentimentChartProps) {
  return (
    <div className="bg-surface border border-border rounded-lg p-5">
      <h3 className="font-display text-sm text-muted uppercase tracking-wider mb-4">
        Sentiment Over Time
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="positiveGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00ff88" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#00ff88" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="negativeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ff4466" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#ff4466" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="neutralGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6b8aff" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6b8aff" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="date" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6b6b70', fontSize: 10 }}
              tickFormatter={(value) => value.slice(5)}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6b6b70', fontSize: 10 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1a1a1d',
                border: '1px solid #2a2a2d',
                borderRadius: '8px',
                fontSize: '12px',
              }}
              labelStyle={{ color: '#e5e5e5' }}
            />
            <Area
              type="monotone"
              dataKey="positive"
              stackId="1"
              stroke="#00ff88"
              fill="url(#positiveGradient)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="neutral"
              stackId="1"
              stroke="#6b8aff"
              fill="url(#neutralGradient)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="negative"
              stackId="1"
              stroke="#ff4466"
              fill="url(#negativeGradient)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="flex items-center justify-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-positive" />
          <span className="text-xs text-muted">Positive</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-neutral" />
          <span className="text-xs text-muted">Neutral</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-negative" />
          <span className="text-xs text-muted">Negative</span>
        </div>
      </div>
    </div>
  );
}
