"use client"

import React, { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import OpportunityTable, { OpportunityRow } from '@/components/OpportunityTable'
import OpportunityDrawer, { OpportunityDetail } from '@/components/OpportunityDrawer'

// Replicate computeFitScore in client for on‑the‑fly scoring.  The logic mirrors
// src/lib/scoring.ts but avoids server imports.
function computeFit(op: any, prefs: any) {
  const WEIGHTS = {
    disciplineMatch: 0.4,
    locationMatch: 0.25,
    amountPreference: 0.15,
    deadlineProximity: 0.15,
    eligibilityKeywords: 0.05,
  }
  const KEYWORDS = ['emerging', 'mid-career', 'public art', 'mural', 'game', 'film', 'digital', 'AR/VR', 'residency']
  let score = 0
  let weightSum = 0
  // discipline match
  weightSum += WEIGHTS.disciplineMatch
  if (prefs.disciplines && prefs.disciplines.length > 0) {
    const matches = op.disciplines.filter((d: string) => prefs.disciplines.map((p: string) => p.toLowerCase()).includes(d.toLowerCase())).length
    const ratio = matches / prefs.disciplines.length
    score += ratio * 100 * WEIGHTS.disciplineMatch
  }
  // location match
  weightSum += WEIGHTS.locationMatch
  if (prefs.locations && prefs.locations.length > 0) {
    const locMatch = prefs.locations.some((loc: string) => op.location.toLowerCase().includes(loc.toLowerCase()))
    score += (locMatch ? 100 : 0) * WEIGHTS.locationMatch
  }
  // amount preference
  weightSum += WEIGHTS.amountPreference
  if (prefs.minAmount && op.amount != null) {
    const meets = op.amount >= prefs.minAmount
    score += (meets ? 100 : 0) * WEIGHTS.amountPreference
  } else {
    score += 50 * WEIGHTS.amountPreference
  }
  // deadline proximity
  weightSum += WEIGHTS.deadlineProximity
  if (op.closesOn) {
    const today = new Date()
    const diffMs = new Date(op.closesOn).getTime() - today.getTime()
    const days = diffMs / (1000 * 60 * 60 * 24)
    const buffer = prefs.deadlineBufferDays ?? 0
    if (days <= buffer || days > 120) {
      score += 0
    } else {
      const proximity = (120 - (days - buffer)) / 120
      score += proximity * 100 * WEIGHTS.deadlineProximity
    }
  } else {
    score += 50 * WEIGHTS.deadlineProximity
  }
  // eligibility keywords
  weightSum += WEIGHTS.eligibilityKeywords
  const text = [...(op.eligibility || []), ...(op.tags || []), ...(op.disciplines || [])].join(' ').toLowerCase()
  const keywordMatches = KEYWORDS.filter((kw) => text.includes(kw.toLowerCase())).length
  const keywordRatio = KEYWORDS.length > 0 ? keywordMatches / KEYWORDS.length : 0
  score += keywordRatio * 100 * WEIGHTS.eligibilityKeywords
  return Math.round(score / weightSum)
}

export default function AppPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [filters, setFilters] = useState({
    q: searchParams.get('q') || '',
    category: searchParams.get('category') || '',
    discipline: searchParams.get('discipline') || '',
    location: searchParams.get('location') || '',
    dateFrom: searchParams.get('dateFrom') || '',
    dateTo: searchParams.get('dateTo') || '',
    minAmount: searchParams.get('minAmount') || '',
    sort: searchParams.get('sort') || 'closesOn',
  })
  const [results, setResults] = useState<OpportunityRow[]>([])
  const [drawer, setDrawer] = useState<OpportunityDetail | null>(null)

  // Load preferences from localStorage
  const [prefs, setPrefs] = useState<any>({
    disciplines: [],
    locations: [],
    minAmount: null,
    deadlineBufferDays: 0,
  })
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('userPreferences')
      if (stored) {
        try {
          setPrefs(JSON.parse(stored))
        } catch {
          /* ignore */
        }
      }
    }
  }, [])

  // Fetch opportunities whenever query parameters change
  useEffect(() => {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value as string)
    })
    const qs = params.toString()
    router.replace(`/app?${qs}`)
    fetch(`/api/opportunities/search?${qs}`)
      .then((res) => res.json())
      .then((data) => {
        // Compute fit score using stored prefs on client side
        const mapped: OpportunityRow[] = data.map((op: any) => {
          const fit = computeFit(op, prefs)
          return {
            id: op.id,
            name: op.name,
            opensOn: op.opensOn,
            closesOn: op.closesOn,
            amount: op.amount,
            category: op.category,
            location: op.location,
            fitScore: fit,
            source: op.source,
          }
        })
        // Optionally sort by selected sort key
        const sorted = mapped.sort((a, b) => {
          if (filters.sort === 'amount') {
            return (b.amount || 0) - (a.amount || 0)
          }
          if (filters.sort === 'fitScore') {
            return b.fitScore - a.fitScore
          }
          // default: closesOn
          const aDate = a.closesOn ? new Date(a.closesOn).getTime() : Infinity
          const bDate = b.closesOn ? new Date(b.closesOn).getTime() : Infinity
          return aDate - bDate
        })
        setResults(sorted)
      })
      .catch((err) => {
        console.error(err)
        setResults([])
      })
  }, [filters, prefs, router])

  const handleFilterChange = (field: string, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = (id: string) => {
    fetch('/api/saved', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ opportunityId: id, status: 'Saved' }),
    }).then(() => {
      alert('Saved!')
    })
  }

  const handleSend = (id: string) => {
    const op = results.find((o) => o.id === id)
    if (!op) return
    // For the sample we send a minimal payload; a real implementation would
    // include full opportunity and artist profile details.
    fetch('/api/grant-writer/queue', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        opportunity: op,
        artist_profile: {},
        notes: '',
      }),
    }).then(() => alert('Queued for Grant‑Writer'))
  }

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Find Opportunities</h1>
      {/* Filters */}
      <form
        onSubmit={(e) => {
          e.preventDefault()
          // Trigger fetch through filter state update (already happening via onChange)
        }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <input
          type="text"
          placeholder="Search by name/org"
          value={filters.q}
          onChange={(e) => handleFilterChange('q', e.target.value)}
          className="p-2 border border-neutral-300 rounded-md w-full"
        />
        <select
          value={filters.category}
          onChange={(e) => handleFilterChange('category', e.target.value)}
          className="p-2 border border-neutral-300 rounded-md w-full"
        >
          <option value="">All categories</option>
          <option value="Grant">Grant</option>
          <option value="EOI">EOI</option>
          <option value="Residency">Residency</option>
          <option value="Award">Award</option>
        </select>
        <input
          type="text"
          placeholder="Discipline"
          value={filters.discipline}
          onChange={(e) => handleFilterChange('discipline', e.target.value)}
          className="p-2 border border-neutral-300 rounded-md w-full"
        />
        <input
          type="text"
          placeholder="Location"
          value={filters.location}
          onChange={(e) => handleFilterChange('location', e.target.value)}
          className="p-2 border border-neutral-300 rounded-md w-full"
        />
        <div className="flex space-x-2">
          <input
            type="date"
            value={filters.dateFrom}
            onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
            className="p-2 border border-neutral-300 rounded-md w-full"
          />
          <input
            type="date"
            value={filters.dateTo}
            onChange={(e) => handleFilterChange('dateTo', e.target.value)}
            className="p-2 border border-neutral-300 rounded-md w-full"
          />
        </div>
        <input
          type="number"
          placeholder="Min amount"
          value={filters.minAmount}
          onChange={(e) => handleFilterChange('minAmount', e.target.value)}
          className="p-2 border border-neutral-300 rounded-md w-full"
        />
        <select
          value={filters.sort}
          onChange={(e) => handleFilterChange('sort', e.target.value)}
          className="p-2 border border-neutral-300 rounded-md w-full"
        >
          <option value="closesOn">Sort by closing date</option>
          <option value="fitScore">Sort by fit</option>
          <option value="amount">Sort by amount</option>
        </select>
      </form>
      {/* Results Table */}
      <OpportunityTable
        opportunities={results}
        onRowClick={(op) => {
          // Fetch full opportunity details for drawer.  For the MVP we reuse the row.
          const detail: OpportunityDetail = {
            ...op,
            disciplines: [],
            org: '',
            currency: undefined,
            eligibility: [],
            fee: undefined,
            tags: [],
            url: '',
            description: undefined,
          }
          setDrawer(detail)
        }}
        onSave={handleSave}
        onSend={handleSend}
      />
      <OpportunityDrawer
        opportunity={drawer}
        onClose={() => setDrawer(null)}
        onSave={handleSave}
        onSend={handleSend}
      />
    </div>
  )
}