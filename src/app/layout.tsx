import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AI News Monitor | Petr Kindlmann',
  description: 'Real-time AI/LLM news aggregation with sentiment analysis. Built with n8n, Playwright, and Claude API.',
  keywords: ['AI news', 'LLM', 'machine learning', 'sentiment analysis', 'n8n', 'automation'],
  authors: [{ name: 'Petr Kindlmann' }],
  openGraph: {
    title: 'AI News Monitor',
    description: 'Real-time AI/LLM news aggregation with sentiment analysis',
    url: 'https://ai-news.kindlmann.com',
    siteName: 'AI News Monitor',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-void min-h-screen bg-grid">
        {children}
      </body>
    </html>
  )
}
