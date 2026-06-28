import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { NotificationProvider } from '@/components/notification-provider'
import { NotificationToast } from '@/components/notification-toast'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'QueueBridge - Queue Management System',
  description: 'Manage office queues with real-time tracking',
  generator: 'QueueBridge',
  icons: {
    icon: [
      {
        url: '/letter-q.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/letter-q.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/letter-q.png',
        type: 'image/svg+xml',
      },
    ],
    apple: '/letter-q.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} bg-background`}>
      <body className="font-sans antialiased">
        <NotificationProvider>
          {children}
          <NotificationToast />
        </NotificationProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
