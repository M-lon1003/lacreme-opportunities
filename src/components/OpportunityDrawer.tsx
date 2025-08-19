import React from 'react'

export interface OpportunityDetail {
  id: string
  name: string
  category: string
  disciplines: string[]
  location: string
  org: string
  amount?: number | null
  currency?: string | null
  opensOn?: string | null
  closesOn?: string | null
  url: string
  eligibility: string[]
  fee?: number | null
  tags: string[]
  description?: string
}

interface Props {
  opportunity: OpportunityDetail | null
  onClose: () => void
  onSave?: (id: string) => void
  onSend?: (id: string) => void
}

const OpportunityDrawer: React.FC<Props> = ({ opportunity, onClose, onSave, onSend }) => {
  if (!opportunity) return null
  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex justify-end bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md h-full bg-white shadow-xl rounded-l-lg overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-neutral-300 flex justify-between items-center">
          <h2 className="text-lg font-semibold">{opportunity.name}</h2>
          <button
            aria-label="Close"
            className="text-neutral-500 hover:text-neutral-700"
            onClick={onClose}
          >
            ✕
          </button>
        </div>
        <div className="p-4 space-y-4">
          <div>
            <span className="font-semibold">Organisation:</span> {opportunity.org}
          </div>
          <div>
            <span className="font-semibold">Category:</span> {opportunity.category}
          </div>
          <div>
            <span className="font-semibold">Disciplines:</span> {opportunity.disciplines.join(', ')}
          </div>
          <div>
            <span className="font-semibold">Location:</span> {opportunity.location}
          </div>
          <div>
            <span className="font-semibold">Opens:</span>{' '}
            {opportunity.opensOn ? new Date(opportunity.opensOn).toLocaleDateString() : '—'}
          </div>
          <div>
            <span className="font-semibold">Closes:</span>{' '}
            {opportunity.closesOn ? new Date(opportunity.closesOn).toLocaleDateString() : '—'}
          </div>
          <div>
            <span className="font-semibold">Amount:</span>{' '}
            {opportunity.amount != null ? `${opportunity.amount.toLocaleString()} ${opportunity.currency ?? ''}` : '—'}
          </div>
          <div>
            <span className="font-semibold">Eligibility:</span>
            <ul className="list-disc pl-5 space-y-1">
              {opportunity.eligibility.map((rule, idx) => (
                <li key={idx}>{rule}</li>
              ))}
            </ul>
          </div>
          {opportunity.tags.length > 0 && (
            <div>
              <span className="font-semibold">Tags:</span> {opportunity.tags.join(', ')}
            </div>
          )}
          {opportunity.description && (
            <div>
              <span className="font-semibold">Description:</span>
              <p className="mt-1 whitespace-pre-wrap">{opportunity.description}</p>
            </div>
          )}
          <div className="mt-4 space-x-2">
            {onSave && (
              <button
                className="bg-primary text-white px-4 py-2 rounded-md"
                onClick={() => onSave(opportunity.id)}
              >
                Save
              </button>
            )}
            {onSend && (
              <button
                className="bg-secondary text-secondary-contrast px-4 py-2 rounded-md"
                onClick={() => onSend(opportunity.id)}
              >
                Send to Grant‑Writer
              </button>
            )}
            <a
              href={opportunity.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-4 py-2 bg-neutral-700 text-white rounded-md"
            >
              View Source
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OpportunityDrawer