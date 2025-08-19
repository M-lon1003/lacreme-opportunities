import { OpportunityCategory } from '@prisma/client'
import type { Opportunity } from '@/lib/scoring'
import { computeChecksumFor } from '../dedupe'

/**
 * Adapter for CreateNSW website.  This is a stub implementation that
 * demonstrates the expected return shape.  In production you would fetch
 * pages, parse HTML and extract the relevant fields.
 */
export async function fetchOpportunities({ since, disciplines, locations }: {
  since?: Date
  disciplines?: string[]
  locations?: string[]
}): Promise<Opportunity[]> {
  // TODO: implement real scraping of https://www.create.nsw.gov.au/
  // For the MVP we return an empty array so that the refresh endpoint still works.
  return []
}

// Optional helper to normalise currency, dates etc.  Not used in stub.
function normalise(op: any) {
  return op
}