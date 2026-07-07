import type { Metadata } from 'next'
import { Outfit, JetBrains_Mono, Geist } from 'next/font/google'
import Navbar from '@/components/Navbar'
import { ThemeProvider } from '@/components/ThemeProvider'
import './globals.css'
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'HardwareTracker Dashboard',
  description: 'Real-time hardware telemetry and health monitoring',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={cn(outfit.variable, jetbrainsMono.variable, "font-sans", geist.variable)}>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <Navbar />
          <div className="mx-auto flex w-full max-w-6xl flex-1 px-4">
            <main className="flex-1 pb-3">{children}</main>
          </div>
          <footer className="border-t border-border bg-background/50 py-4 text-center text-sm text-muted-foreground">
            &copy; 2026 HardwareTracker Diagnostics &mdash; Built with .NET 10 Clean Architecture
          </footer>
        </ThemeProvider>
      </body>
    </html>
  )
}
