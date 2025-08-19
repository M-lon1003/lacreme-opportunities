import React from 'react'

export interface OpportunityRow {
  id: string
  name: string
  opensOn?: string | null
  closesOn?: string | null
  amount?: number | null
  category: string
  location: string
  fitScore: number
  source: string
}

interface Props {
  opportunities: OpportunityRow[]
  onRowClick?: (opportunity: OpportunityRow) => void
  onSave?: (opportunityId: string) => void
  onSend?: (opportunityId: string) => void
}

const OpportunityTable: React.FC<Props> = ({ opportunities, onRowClick, onSave, onSend }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm divide-y divide-neutral-300">
        <thead className="bg-background-dark">
          <tr>
            <th className="p-3 text-left font-semibold text-neutral-700">Name</th>
            <th className="p-3 text-left font-semibold text-neutral-700">Opens</th>
            <th className="p-3 text-left font-semibold text-neutral-700">Closes</th>
            <th className="p-3 text-left font-semibold text-neutral-700">Amount</th>
            <th className="p-3 text-left font-semibold text-neutral-700">Category</th>
            <th className="p-3 text-left font-semibold text-neutral-700">Location</th>
            <th className="p-3 text-left font-semibold text-neutral-700">Fit</th>
            <th className="p-3 text-left font-semibold text-neutral-700">Source</th>
            <th className="p-3 text-left font-semibold text-neutral-700">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-200">
          {opportunities.map((op) => (
            <tr
              key={op.id}
              className="cursor-pointer hover:bg-background-dark focus-within:bg-background-dark"
              onClick={() => onRowClick?.(op)}
            >
              <td className="p-3 whitespace-nowrap">{op.name}</td>
              <td className="p-3 whitespace-nowrap">
                {op.opensOn ? new Date(op.opensOn).toLocaleDateString() : '—'}
              </td>
              <td className="p-3 whitespace-nowrap">
                {op.closesOn ? new Date(op.closesOn).toLocaleDateString() : '—'}
              </td>
              <td className="p-3 whitespace-nowrap">
                {op.amount != null ? op.amount.toLocaleString() : '—'}
              </td>
              <td className="p-3 whitespace-nowrap">{op.category}</td>
              <td className="p-3 whitespace-nowrap">{op.location}</td>
              <td className="p-3 whitespace-nowrap">{op.fitScore}</td>
              <td className="p-3 whitespace-nowrap">{op.source}</td>
              <td className="p-3 space-x-2 whitespace-nowrap">
                {onSave && (
                  <button
                    className="bg-primary text-white px-3 py-1 rounded-md text-xs"
                    onClick={(e) => {
                      e.stopPropagation()
                      onSave(op.id)
                    }}
                  >
                    Save
                  </button>
                )}
                {onSend && (
                  <button
                    className="bg-secondary text-secondary-contrast px-3 py-1 rounded-md text-xs"
                    onClick={(e) => {
                      e.stopPropagation()
                      onSend(op.id)
                    }}
                  >
                    Send
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default OpportunityTable