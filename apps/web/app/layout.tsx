import { Inter } from "next/font/google"

import "@ramu/ui/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@ramu/ui/lib/utils"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })


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
        "font-sans",
        inter.variable
      )}
    >
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
