import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

export const metadata: Metadata = {
  title: "ABC Learning Adventure - Interactive Alphabet for Kids",
  description:
    "A vibrant, interactive alphabet learning app for children ages 3-7. Features animated letters, voice-overs, mini-games, and child-friendly navigation to make learning the ABCs fun and engaging.",
  generator: "v0.app",
  keywords: [
    "alphabet learning",
    "children education",
    "interactive learning",
    "kids games",
    "letter tracing",
    "phonics",
    "early learning",
    "educational app",
  ],
  authors: [{ name: "v0.app" }],
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
  themeColor: "#8b5cf6",
  manifest: "/manifest.json",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="ABC Learning" />
        <link rel="apple-touch-icon" href="/icon-192x192.jpg" />
      </head>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
