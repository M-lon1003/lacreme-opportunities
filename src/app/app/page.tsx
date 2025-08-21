"use client"

import React, { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import OpportunityTable, { OpportunityRow } from '../../components/OpportunityTable'
import OpportunityDrawer, { OpportunityDetail } from '../../components/OpportunityDrawer'
import { DISCIPLINES, LOCATIONS, MIN_AMOUNTS, amountLabel } from '../../lib/filters'

// Client-side fit score (mirrors server weights for now)
function computeFit(op: any, prefs: any) {
  const WEIGHTS = {
    disciplineMatch: 0.4,
    locationMatch: 0.25,
    amountPreference: 0.15,
    deadlineProximity: 0.15,
    eligibilityKeywords: 0.05,
  }
  const KEYWORDS = ['emerging', 'mid-career', 'public art', 'mural', 'game', 'film', 'digital', 'AR/VR', 'residency']
  let score = 0, weightSum = 0

  weightSum += WEIGHTS.disciplineMatch
  if (prefs.disciplines?.length) {
    const matches = (op.disciplines || []).filter((d: string) =>
      prefs.disciplines.map((p: string) => p.toLowerCase()).includes(d?.toLowerCase())
    ).length
    score += (matches / prefs.disciplines.length) * 100 * WEIGHTS.disciplineMatch
  }

  weightSum += WEIGHTS.locationMatch
  if (prefs.locations?.length) {
    const m = prefs.locations.some((loc: string) => (op.location || '').toLowerCase().includes(loc.toLowerCase()))
    score += (m ? 100 : 0) * WEIGHTS.locationMatch
  }

  weightSum += WEIGHTS.amountPreference
  if (prefs.minAmount && op.amount != null) {
    score += (op.amount >= prefs.minAmount ? 100 : 0) * WEIGHTS.amountPreference
  } else {
    score += 50 * WEIGHTS.amountPreference
  }

  weightSum += WEIGHTS.deadlineProximity
  if (op.closesOn) {
    const today = new Date()
    const days = (new Date(op.closesOn).getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    const buffer = prefs.deadlineBufferDays ?? 0
    if (days > buffer && days <= 120) {
      const proximity = (120 - (days - buffer)) / 120
      score += proximity * 100 * WEIGHTS.deadlineProximity
    }
  } else {
    score += 50 * WEIGHTS.deadlineProximity
  }

  weightSum += WEIGHTS.eligibilityKeywords
  const text = [...(op.eligibility || []), ...(op.tags || []), ...(op.disciplines || [])].join(' ').toLowerCase()
  const keywordMatches = KEYWORDS.filter((kw) => text.includes(kw.toLowerCase())).length
  score += ((KEYWORDS.length ? keywordMatches / KEYWORDS.length : 0) * 100) * WEIGHTS.eligibilityKeywords

  return Math.round(score / weightSum)
}

export default function AppPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // URL-driven simple filters
  const [filters, setFilters] = useState({
    q: searchParams.get('q') || '',
    category: searchParams.get('category') || '',
    dateFrom: searchParams.get('dateFrom') || '',
    dateTo: searchParams.get('dateTo') || '',
    sort: searchParams.get('sort') || 'closesOn',
  })

  // New chooser-driven filters
  const [disciplines, setDisciplines] = useState<string[]>(searchParams.getAll('discipline'))
  const [location, setLocation] = useState(searchParams.get('location') || '')
  const [minAmount, setMinAmount] = useState<number>(Number(searchParams.get('minAmount') || 0))

  // Saved prefs (lightweight)
  const [prefs, setPrefs] = useState<any>({ disciplines: [], locations: [], minAmount: null, deadlineBufferDays: 0 })
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('userPreferences')
      if (stored) { try { setPrefs(JSON.parse(stored)) } catch {} }
    }
  }, [])

  const [results, setResults] = useState<OpportunityRow[]>([])
  const [drawer, setDrawer] = useState<OpportunityDetail | null>(null)

  // Build query + fetch when filters change
  useEffect(() => {
    const params = new URLSearchParams()
    if (filters.q) params.set('q', filters.q)
    if (filters.category) params.set('category', filters.category)
    if (filters.dateFrom) params.set('dateFrom', filters.dateFrom)
    if (filters.dateTo) params.set('dateTo', filters.dateTo)
    if (filters.sort) params.set('sort', filters.sort)
    if (location) params.set('location', location)
    if (minAmount) params.set('minAmount', String(minAmount))
    disciplines.forEach(d => params.append('discipline', d))

    const qs = params.toString()
    router.replace(`/app?${qs}`)

    fetch(`/api/opportunities/search?${qs}`)
      .then((r) => r.json())
      .then((data) => {
        const mapped: OpportunityRow[] = data.map((op: any) => ({
          id: op.id,
          name: op.name,
          opensOn: op.opensOn,
          closesOn: op.closesOn,
          amount: op.amount,
          category: op.category,
          location: op.location,
          fitScore: computeFit(op, { ...prefs, disciplines, locations: location ? [location] : [], minAmount }),
          source: op.source,
        }))
        const sorted = mapped.sort((a, b) => {
          if (filters.sort === 'amount') return (b.amount || 0) - (a.amount || 0)
          if (filters.sort === 'fitScore') return b.fitScore - a.fitScore
          const aDate = a.closesOn ? new Date(a.closesOn).getTime() : Infinity
          const bDate = b.closesOn ? new Date(b.closesOn).getTime() : Infinity
          return aDate - bDate
        })
        setResults(sorted)
      })
      .catch(() => setResults([]))
  }, [filters, disciplines, location, minAmount, prefs, router])

  // UI handlers
  const toggleDiscipline = (d: string) =>
    setDisciplines((prev) => (prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]))

  const handleSearch = () => setFilters((prev) => ({ ...prev })) // triggers useEffect
  const handleReset = () => {
    setFilters({ q: '', category: '', dateFrom: '', dateTo: '', sort: 'closesOn' })
    setDisciplines([]); setLocation(''); setMinAmount(0)
    router.replace('/app')
  }

  const handleSave = (id: string) => {
    fetch('/api/saved', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ opportunityId: id, status: 'Saved' }) })
      .then(() => alert('Saved!'))
  }

  const handleSend = (id: string) => {
    const op = results.find((o) => o.id === id); if (!op) return
    fetch('/api/grant-writer/queue', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ opportunity: op, artist_profile: {}, notes: '' }),
    }).then(() => alert('Queued for Grant-Writer'))
  }

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Find Opportunities</h1>

      {/* Filters */}
      <form
        onSubmit={(e) => { e.preventDefault(); handleSearch() }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-4"
      >
        {/* Disciplines */}
        <div className="border rounded-xl p-4">
          <div className="font-medium mb-2">Disciplines</div>
          <div className="grid grid-cols-2 gap-2">
            {DISCIPLINES.map(d => (
              <label key={d} className="flex items-center gap-2">
                <input type="checkbox" checked={disciplines.includes(d)} onChange={() => toggleDiscipline(d)} />
                <span>{d}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Location */}
        <div className="border rounded-xl p-4">
          <div className="font-medium mb-2">Location</div>
          <select className="w-full border rounded-md px-3 py-2" value={location} onChange={(e) => setLocation(e.target.value)}>
            <option value="">All locations</option>
            {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>

        {/* Amount + query + buttons */}
        <div className="border rounded-xl p-4">
          <div className="font-medium mb-2">Min Amount</div>
          <select className="w-full border rounded-md px-3 py-2 mb-3" value={minAmount} onChange={(e) => setMinAmount(Number(e.target.value))}>
            {MIN_AMOUNTS.map(n => <option key={n} value={n}>{amountLabel(n)}</option>)}
          </select>

          <input
            className="w-full border rounded-md px-3 py-2 mb-3"
            placeholder="Search name, org…"
            value={filters.q}
            onChange={(e) => setFilters((p) => ({ ...p, q: e.target.value }))}
          />

          <div className="flex gap-2">
            <button type="submit" className="px-4 py-2 rounded-md bg-black text-white">Search</button>
            <button type="button" onClick={handleReset} className="px-4 py-2 rounded-md border">Reset</button>
          </div>
        </div>
      </form>

      {/* Sort select */}
      <div>
        <select
          className="p-2 border rounded-md"
          value={filters.sort}
          onChange={(e) => setFilters((p) => ({ ...p, sort: e.target.value }))}
        >
          <option value="closesOn">Sort by closing date</option>
          <option value="fitScore">Sort by fit</option>
          <option value="amount">Sort by amount</option>
        </select>
      </div>

      {/* Results */}
      <OpportunityTable
        opportunities={results}
        onRowClick={(op) => {
          const detail: OpportunityDetail = {
            ...op, disciplines: [], org: '', currency: undefined, eligibility: [], fee: undefined, tags: [], url: '', description: undefined,
          }
          setDrawer(detail)
        }}
        onSave={handleSave}
        onSend={handleSend}
      />
      <OpportunityDrawer opportunity={drawer} onClose={() => setDrawer(null)} onSave={handleSave} onSend={handleSend} />
    </div>
  )
}
