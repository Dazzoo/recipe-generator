import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI-Powered Recipe Generator',
  description: 'Generate recipes based on your ingredients and preferences',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
