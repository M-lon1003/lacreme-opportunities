import crypto from 'crypto'
import { Opportunity } from '@prisma/client'

/**
 * Compute a unique checksum for an opportunity based on name, normalised URL and organisation.
 * Lower‑case the name and organisation and use the origin of the URL to reduce tracker noise.
 */
export function computeChecksumFor(name: string, url: string, org: string): string {
  let origin: string
  try {
    const parsed = new URL(url)
    origin = parsed.origin
  } catch {
    origin = url
  }
  const input = name.toLowerCase() + origin.toLowerCase() + org.toLowerCase()
  return crypto.createHash('sha256').update(input).digest('hex')
}

/**
 * Merge an existing opportunity with a new record.  If the checksum matches, update
 * fields with the incoming values and preserve the original `createdAt`.  The
 * `updatedAt` timestamp will be handled by Prisma.
 */
export function mergeOpportunity(existing: Opportunity, incoming: Opportunity): Opportunity {
  return {
    ...existing,
    ...incoming,
    id: existing.id,
    createdAt: existing.createdAt,
  }
}