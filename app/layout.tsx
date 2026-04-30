import type { Metadata } from 'next'
import { Toaster } from 'sonner'
import './globals.css'
import { Providers } from './providers'

export const metadata: Metadata = {
  title: 'Be A Pro — Intelligence for Grappling',
  description: 'AI-powered competitive intelligence platform for BJJ and grappling athletes.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased bg-[var(--color-bg-base)]">
        <Providers>
          {children}
          <Toaster
            theme="dark"
            position="top-right"
            toastOptions={{
              style: {
                background: 'var(--color-bg-elevated)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text-primary)',
              },
            }}
          />
        </Providers>
      </body>
    </html>
  )
}
