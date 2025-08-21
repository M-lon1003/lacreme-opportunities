"use client"

import React, { useEffect, useState } from 'react'

export default function SavedPage() {
  const [items, setItems] = useState<any[]>([])

  useEffect(() => {
    fetch('/api/saved')
      .then((res) => res.json())
      .then(setItems)
      .catch(() => setItems([]))
  }, [])

  const updateStatus = (id: string, status: string) => {
    fetch('/api/saved', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ opportunityId: id, status }),
    }).then(() => {
      setItems((prev) => prev.map((it) => (it.opportunityId === id ? { ...it, status } : it)))
    })
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">My Saved Opportunities</h1>
      {items.length === 0 && <p>You haven’t saved any opportunities yet.</p>}
      {items.length > 0 && (
        <table className="min-w-full text-sm divide-y divide-neutral-300">
          <thead>
            <tr>
              <th className="p-3 text-left font-semibold text-neutral-700">Name</th>
              <th className="p-3 text-left font-semibold text-neutral-700">Status</th>
              <th className="p-3 text-left font-semibold text-neutral-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200">
            {items.map((item) => (
              <tr key={item.id}>
                <td className="p-3">{item.opportunity?.name ?? item.name}</td>
                <td className="p-3">{item.status}</td>
                <td className="p-3 space-x-2">
                  {item.status !== 'Applied' && (
                    <button
                      className="bg-secondary text-secondary-contrast px-3 py-1 rounded-md text-xs"
                      onClick={() => updateStatus(item.opportunityId, 'Applied')}
                    >
                      Mark as Applied
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}