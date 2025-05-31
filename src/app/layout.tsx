import './globals.css'
import type { Metadata } from 'next'
import { Inter, VT323 } from 'next/font/google'
import '@/styles/pixel.css'

const inter = Inter({ subsets: ['latin'] })
const vt323 = VT323({ 
  weight: '400',
  subsets: ['latin'],
  variable: '--font-vt323',
})

export const metadata: Metadata = {
  title: 'Recipe Generator',
  description: 'Generate recipes based on your preferences',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${vt323.variable}`}>{children}</body>
    </html>
  )
}
