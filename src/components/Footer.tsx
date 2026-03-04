'use client';

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h4 className="font-display text-sm text-white mb-3">About</h4>
            <p className="text-sm text-muted leading-relaxed">
              Automated AI/LLM news aggregation with sentiment analysis. 
              Built with n8n, Playwright, and Claude API to demonstrate 
              content monitoring and workflow automation capabilities.
            </p>
          </div>

          <div>
            <h4 className="font-display text-sm text-white mb-3">Data Sources</h4>
            <ul className="text-sm text-muted space-y-1">
              <li>Hacker News</li>
              <li>TechCrunch AI</li>
              <li>Anthropic, OpenAI, DeepMind Blogs</li>
              <li>Reddit r/MachineLearning, r/LocalLLaMA</li>
              <li>arXiv cs.AI, cs.LG</li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-sm text-white mb-3">Tech Stack</h4>
            <ul className="text-sm text-muted space-y-1">
              <li>n8n — Workflow orchestration</li>
              <li>Playwright — Web crawling</li>
              <li>Claude API — Sentiment & summarization</li>
              <li>Next.js — Dashboard</li>
              <li>PostgreSQL — Data storage</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-muted">
            Built by{' '}
            <a 
              href="https://kindlmann.com" 
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Petr Kindlmann
            </a>
            {' '}— QA Automation Engineer & AI Developer
          </div>
          <div className="text-xs text-muted font-display">
            Prague, Czech Republic
          </div>
        </div>
      </div>
    </footer>
  );
}
