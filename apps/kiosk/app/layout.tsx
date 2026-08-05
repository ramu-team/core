import { Geist_Mono, Inter } from "next/font/google"

import "@ramu/ui/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@ramu/ui/lib/utils"
import NextTopLoader from 'nextjs-toploader'

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

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
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
