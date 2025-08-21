import type { Opportunity } from '@/lib/scoring'

/**
 * Adapter for the City of Sydney creative grants pages.
 * Currently returns an empty array as a stub.  A real implementation would
 * scrape `https://www.cityofsydney.nsw.gov.au/creative-grants` and
 * extract fields like title, dates, amount, category and eligibility.
 */
export async function fetchOpportunities({ since, disciplines, locations }: {
  since?: Date
  disciplines?: string[]
  locations?: string[]
}): Promise<Opportunity[]> {
  // TODO: implement real scraping
  return []
}