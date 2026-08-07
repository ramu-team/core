import { Geist_Mono, Inter } from "next/font/google"

import "@ramu/ui/globals.css"

import { cn } from "@ramu/ui/lib/utils"
import NextTopLoader from 'nextjs-toploader'
import { KioskWrapper } from "@/components/kiosk-wrapper"

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
        "dark",
        "antialiased",
        fontMono.variable,
        "font-sans",
        inter.variable
      )}
    >
      <body className="bg-stone-950 text-stone-50 overflow-hidden">
        <NextTopLoader color="#f59e0b" showSpinner={false} />
          <KioskWrapper>
            {children}
          </KioskWrapper>
      </body>
    </html>
  )
}
