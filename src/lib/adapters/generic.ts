import type { Opportunity } from '@/lib/scoring'

/**
 * Generic web search adapter.  This stub demonstrates the interface but
 * returns no results.  A real implementation would accept a list of sites
 * and patterns and perform `site:` queries using a search API.
 */
export async function fetchOpportunities({ since, disciplines, locations }: {
  since?: Date
  disciplines?: string[]
  locations?: string[]
}): Promise<Opportunity[]> {
  // TODO: implement generic search scraping
  return []
}