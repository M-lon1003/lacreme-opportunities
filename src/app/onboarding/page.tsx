"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function OnboardingPage() {
  const router = useRouter()
  const [disciplines, setDisciplines] = useState('')
  const [locations, setLocations] = useState('')
  const [minAmount, setMinAmount] = useState('')
  const [maxFee, setMaxFee] = useState('')
  const [notifyFrequency, setNotifyFrequency] = useState('weekly')
  const [deadlineBufferDays, setDeadlineBufferDays] = useState(7)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const prefs = {
      disciplines: disciplines.split(',').map((s) => s.trim()).filter(Boolean),
      locations: locations.split(',').map((s) => s.trim()).filter(Boolean),
      minAmount: minAmount ? parseFloat(minAmount) : null,
      maxFee: maxFee ? parseFloat(maxFee) : null,
      notifyFrequency,
      deadlineBufferDays,
    }
    // Store preferences locally for the MVP.  In a real implementation we
    // would POST to an API endpoint and update the user profile.
    if (typeof window !== 'undefined') {
      localStorage.setItem('userPreferences', JSON.stringify(prefs))
    }
    // Redirect to the main app
    router.push('/app')
  }

  return (
    <main className="max-w-xl mx-auto py-12 px-4">
      <h1 className="text-2xl font-bold mb-6">Tell us about your practice</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold mb-1">Disciplines (comma‑separated)</label>
          <input
            type="text"
            value={disciplines}
            onChange={(e) => setDisciplines(e.target.value)}
            className="w-full p-2 border border-neutral-300 rounded-md"
            placeholder="e.g. murals, film, digital"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Preferred locations (comma‑separated)</label>
          <input
            type="text"
            value={locations}
            onChange={(e) => setLocations(e.target.value)}
            className="w-full p-2 border border-neutral-300 rounded-md"
            placeholder="e.g. NSW, Sydney, Australia"
          />
        </div>
        <div className="flex space-x-4">
          <div className="flex-1">
            <label className="block font-semibold mb-1">Min amount (optional)</label>
            <input
              type="number"
              value={minAmount}
              onChange={(e) => setMinAmount(e.target.value)}
              className="w-full p-2 border border-neutral-300 rounded-md"
              placeholder="0"
            />
          </div>
          <div className="flex-1">
            <label className="block font-semibold mb-1">Max fee (optional)</label>
            <input
              type="number"
              value={maxFee}
              onChange={(e) => setMaxFee(e.target.value)}
              className="w-full p-2 border border-neutral-300 rounded-md"
              placeholder="0"
            />
          </div>
        </div>
        <div>
          <label className="block font-semibold mb-1">Digest frequency</label>
          <select
            value={notifyFrequency}
            onChange={(e) => setNotifyFrequency(e.target.value)}
            className="w-full p-2 border border-neutral-300 rounded-md"
          >
            <option value="off">Off</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
          </select>
        </div>
        <div>
          <label className="block font-semibold mb-1">Days before deadline for alerts</label>
          <input
            type="number"
            value={deadlineBufferDays}
            onChange={(e) => setDeadlineBufferDays(parseInt(e.target.value) || 0)}
            className="w-full p-2 border border-neutral-300 rounded-md"
          />
        </div>
        <button
          type="submit"
          className="bg-primary text-primary-contrast px-4 py-2 rounded-md"
        >
          Save preferences
        </button>
      </form>
    </main>
  )
}