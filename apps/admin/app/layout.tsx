import { Geist_Mono, Inter } from "next/font/google"

import "@ramu/ui/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { TooltipProvider } from "@ramu/ui/components/tooltip"
import { Toaster } from "@ramu/ui/components/sonner"
import { cn } from "@ramu/ui/lib/utils"
import NextTopLoader from 'nextjs-toploader'

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata = {
  title: {
    template: "%s | Ramu Admin",
    default: "Ramu Admin Dashboard",
  },
  description: "Administrator dashboard for Ramu ecosystem.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        inter.variable
      )}
    >
      <body>
        <NextTopLoader color="#d97706" showSpinner={false} />
        <ThemeProvider>
          <TooltipProvider>{children}</TooltipProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
