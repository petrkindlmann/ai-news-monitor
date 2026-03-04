import type { Metadata } from 'next'
import { IBM_Plex_Sans, Space_Mono } from 'next/font/google'
import './globals.css'

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-body',
  display: 'swap',
})

const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-display',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'AI News Monitor | Petr Kindlmann',
  description: 'Real-time AI/LLM news aggregation with sentiment analysis. Built with n8n, RSS feeds, and Claude API.',
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
    <html lang="en" className={`${ibmPlexSans.variable} ${spaceMono.variable}`}>
      <body className="bg-void min-h-screen bg-grid">
        {children}
      </body>
    </html>
  )
}
