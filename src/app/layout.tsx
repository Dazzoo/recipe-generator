import { Footer } from '@/components/Footer'
import { ThemeProvider } from '@/components/Theme/ThemeProvider'
import { ThemeToggle } from '@/components/Theme/ThemeToggle'
import { Toaster } from "@/components/shadcn/toaster"
import '@/styles/globals.css'
import type { Metadata } from 'next'
import { Inter, VT323 } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })
const vt323 = VT323({ 
  weight: '400',
  subsets: ['latin'],
  variable: '--font-vt323',
})

export const metadata: Metadata = {
  title: 'Recipe Generator',
  description: 'Generate recipes based on your ingredients',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} ${vt323.variable} flex flex-col min-h-screen`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="fixed top-4 right-4 z-50">
            <ThemeToggle />
          </div>
          <div className="flex-1 flex flex-col">
            {children}
            <Toaster />
          </div>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}
