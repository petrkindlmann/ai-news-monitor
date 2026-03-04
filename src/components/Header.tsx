'use client';

import { Cpu, Github, ExternalLink } from 'lucide-react';

export function Header() {
  return (
    <header className="border-b border-border bg-surface/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-accent/10 border border-accent/30 rounded-lg flex items-center justify-center">
              <Cpu className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h1 className="font-display text-lg text-white tracking-tight">
                AI News Monitor
              </h1>
              <p className="text-xs text-muted">
                Real-time LLM & AI intelligence
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-xs text-muted">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
              </span>
              <span>Crawling every 2h</span>
            </div>

            <a
              href="https://github.com/petr-kin/ai-news-monitor"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-1.5 bg-surface-light border border-border rounded-lg text-sm text-muted hover:text-white hover:border-accent transition-colors"
            >
              <Github className="w-4 h-4" />
              <span className="hidden sm:inline">Source</span>
            </a>

            <a
              href="https://kindlmann.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-1.5 bg-accent/10 border border-accent/30 rounded-lg text-sm text-accent hover:bg-accent/20 transition-colors"
            >
              <span>Portfolio</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
