'use client';

import OpportunityTable from '@/components/OpportunityTable';
import OpportunityDrawer from '@/components/OpportunityDrawer';

export default function AppPage() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="mx-auto max-w-6xl p-6">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Opportunities
          </h1>
          <a
            href="/api/auth/signin"
            className="rounded-lg border px-3 py-2 text-sm hover:bg-black hover:text-white transition"
          >
            Sign in
          </a>
        </header>

        <div className="mt-8 grid gap-6 md:grid-cols-[280px_1fr]">
          <aside className="rounded-2xl border bg-white p-4">
            <OpportunityDrawer />
          </aside>
          <main className="rounded-2xl border bg-white p-4">
            <OpportunityTable />
          </main>
        </div>
      </div>
    </div>
  );
}
