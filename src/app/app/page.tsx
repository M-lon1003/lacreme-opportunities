'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import OpportunityTable from '@/components/OpportunityTable';
import OpportunityDrawer from '@/components/OpportunityDrawer';

type Filters = {
  q: string;
  category: string;
  discipline: string;
  location: string;
};

export default function AppPage() {
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState<Filters>({
    q: '',
    category: '',
    discipline: '',
    location: '',
  });

  // Sincroniza los filtros con los query params de forma segura
  useEffect(() => {
    setFilters({
      q: searchParams?.get('q') ?? '',
      category: searchParams?.get('category') ?? '',
      discipline: searchParams?.get('discipline') ?? '',
      location: searchParams?.get('location') ?? '',
    });
  }, [searchParams]);

  return (
    <main className="p-6">
      {/* Puedes pasar 'filters' a tus componentes si los usan */}
      <OpportunityDrawer />
      <div className="mt-6">
        <OpportunityTable />
      </div>
    </main>
  );
}
