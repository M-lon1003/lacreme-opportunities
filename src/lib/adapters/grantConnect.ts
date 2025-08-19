import type { Opportunity } from '@/lib/scoring'

/**
 * Adapter for GrantConnect / grants.gov.au search.  Because GrantConnect
 * requires authentication and has rate limits, this stub does not call
 * the service.  A real implementation would query the API or scrape
 * search results with arts/creative keywords.
 */
export async function fetchOpportunities({ since, disciplines, locations }: {
  since?: Date
  disciplines?: string[]
  locations?: string[]
}): Promise<Opportunity[]> {
  // TODO: implement real search integration
  return []
}