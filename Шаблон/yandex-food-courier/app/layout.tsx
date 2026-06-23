import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Manrope, Geist } from 'next/font/google'
import './globals.css'

const manrope = Manrope({
  variable: '--font-heading',
  subsets: ['latin', 'cyrillic'],
  weight: ['500', '600', '700', '800'],
})
const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin', 'cyrillic'],
})

export const metadata: Metadata = {
  title: 'Курьер Яндекс Еды — работа курьером с гибким графиком',
  description:
    'Станьте курьером Яндекс Еды: свободный график, быстрый старт, ежедневные выплаты и доставки рядом с домом. Пешком, на велосипеде, самокате или авто.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#ffde40',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="ru"
      className={`${geistSans.variable} ${manrope.variable} bg-background`}
    >
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
