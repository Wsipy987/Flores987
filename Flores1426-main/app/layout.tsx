import type { Metadata, Viewport } from 'next'
import { Playfair_Display, Cormorant_Garamond } from 'next/font/google'

import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-cormorant',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Para Ti - 14 de Febrero',
  description: 'Un regalo especial para el dia de San Valentin',
}

export const viewport: Viewport = {
  themeColor: '#1a0a0a',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`${playfair.variable} ${cormorant.variable} font-serif antialiased`}>
        {children}
      </body>
    </html>
  )
}
