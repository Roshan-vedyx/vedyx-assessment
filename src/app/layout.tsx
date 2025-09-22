import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "Vedyx Leap Learning Assessment - Discover Your Child's Learning Style",
  description: "Free assessment to discover how your child learns best...",
  openGraph: {
    title: "Vedyx Leap Learning Assessment",
    description: "Discover how your child learns best with our free assessment",
    images: ["/og-image.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.png", type: "image/png", sizes: "32x32" },
    ],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* 👇 Force favicon load */}
        <link rel="icon" href="/favicon.png" type="image/png" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
