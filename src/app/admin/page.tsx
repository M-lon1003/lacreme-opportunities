"use client"

import React, { useState } from 'react'

export default function AdminPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ inserted: number; updated: number; errors: number } | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleRefresh = async () => {
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const res = await fetch('/api/opportunities/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sources: [] }),
      })
      if (!res.ok) {
        throw new Error(await res.text())
      }
      const data = await res.json()
      setResult(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Admin Tools</h1>
      <p className="mb-4">Trigger data refresh from live sources.</p>
      <button
        onClick={handleRefresh}
        className="bg-primary text-primary-contrast px-4 py-2 rounded-md"
        disabled={loading}
      >
        {loading ? 'Refreshing…' : 'Refresh Opportunities'}
      </button>
      {error && <p className="text-red-600 mt-4">{error}</p>}
      {result && (
        <div className="mt-4 space-y-1">
          <p>Inserted: {result.inserted}</p>
          <p>Updated: {result.updated}</p>
          <p>Errors: {result.errors}</p>
        </div>
      )}
    </div>
  )
}