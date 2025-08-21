import React from 'react'
import Link from 'next/link'
import './globals.css'

export const metadata = {
  title: "La Crème's Opportunities Finder",
  description: 'Discover and manage creative opportunities tailored to you',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-background text-neutral-700 min-h-screen antialiased">
        {/* Primary site navigation */}
        <header className="px-6 py-3 border-b bg-white sticky top-0 z-10">
          <nav className="flex gap-4 text-sm font-medium">
            <Link href="/" className="hover:underline">Home</Link>
            <Link href="/app" className="hover:underline">Find</Link>
            <Link href="/app/saved" className="hover:underline">Saved</Link>
            <Link href="/admin" className="hover:underline">Admin</Link>
          </nav>
        </header>
        {/* Main content area */}
        <main className="p-6">{children}</main>
      </body>
    </html>
  )
}
