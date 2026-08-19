import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Hello, world.',
  description: 'A tiny, thoughtful hello world website.',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
