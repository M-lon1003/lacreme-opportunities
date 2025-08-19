import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center py-32 px-4 text-center">
      <h1 className="text-4xl font-bold mb-4">La Crème Opportunities</h1>
      <p className="text-lg mb-8 max-w-md">
        Discover grants, residencies, EOIs and awards tailored to your creative practice.  Sign in to
        personalise your search and stay up‑to‑date with new opportunities.
      </p>
      <Link
        href="/app"
        className="bg-primary text-primary-contrast px-6 py-3 rounded-md text-lg"
      >
        Enter
      </Link>
    </main>
  )
}