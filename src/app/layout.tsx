import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AJ Auto Detailing | San Fernando, CA',
  description: "San Fernando's premier auto detailing service. Book your appointment online.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
