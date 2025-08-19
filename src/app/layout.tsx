import React from 'react'
import './globals.css'

export const metadata = {
  title: 'La Crème Opportunities',
  description: 'Discover and manage creative opportunities tailored to you',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-background text-neutral-700 min-h-screen antialiased">
        {children}
      </body>
    </html>
  )
}