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

export const metadata = {
  title: 'AI News Monitor — Weekly field notes from the AI firehose',
  description: 'A weekly AI news zine for builders who want signal, not another firehose.',
};

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
