import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Vedyx Leap Learning Assessment - Discover Your Child\'s Learning Style',
  description: 'Free assessment to discover how your child learns best. Get personalized recommendations for supporting their literacy journey.',
  openGraph: {
    title: 'Vedyx Leap Learning Assessment',
    description: 'Discover how your child learns best with our free assessment',
    images: ['/og-image.png'],
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}