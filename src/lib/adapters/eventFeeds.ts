import type { Opportunity } from '../scoring'

/**
 * Adapter for Eventbrite and Humanitix feeds.  For the MVP we don’t
 * implement actual RSS parsing; this function returns an empty array.
 * A real implementation would poll keyword feeds (e.g. 'EOI', 'public art',
 * 'mural', 'residency', 'artist call') and normalise the events to the
 * Opportunity shape.
 */
export async function fetchOpportunities({ since, disciplines, locations }: {
  since?: Date
  disciplines?: string[]
  locations?: string[]
}): Promise<Opportunity[]> {
  // TODO: implement RSS/feed parsing
  return []
}
