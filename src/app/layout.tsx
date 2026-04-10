import type { Metadata } from 'next'
import ClientLayout from '@/components/ClientLayout'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: 'AJ Auto Detailing | San Fernando, CA',
    template: '%s | AJ Auto Detailing'
  },
  description: "San Fernando's premier auto detailing service. Professional car detailing, paint correction, ceramic coating, and more. Mobile service available within 50 miles. Book online today!",
  keywords: ['auto detailing', 'car detailing', 'San Fernando', 'mobile detailing', 'paint correction', 'ceramic coating', 'interior detailing', 'exterior detailing', 'Los Angeles'],
  authors: [{ name: 'AJ Auto Detailing' }],
  creator: 'AJ Auto Detailing',
  publisher: 'AJ Auto Detailing',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'AJ Auto Detailing | San Fernando, CA',
    description: "San Fernando's premier auto detailing service. Professional mobile detailing within 50 miles.",
    url: '/',
    siteName: 'AJ Auto Detailing',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AJ Auto Detailing | San Fernando, CA',
    description: "San Fernando's premier auto detailing service.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add google verification code when available
    // google: 'google-site-verification-code',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}
