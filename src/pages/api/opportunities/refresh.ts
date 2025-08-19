import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/lib/prisma'
import { computeChecksumFor, mergeOpportunity } from '@/lib/dedupe'
import { fetchOpportunities as fetchCreateNsw } from '@/lib/adapters/createNsw'
import { fetchOpportunities as fetchCityOfSydney } from '@/lib/adapters/cityOfSydney'
import { fetchOpportunities as fetchGrantConnect } from '@/lib/adapters/grantConnect'
import { fetchOpportunities as fetchEventFeeds } from '@/lib/adapters/eventFeeds'
import { fetchOpportunities as fetchGeneric } from '@/lib/adapters/generic'

const adapters: Record<string, (args: any) => Promise<any[]>> = {
  CreateNSW: fetchCreateNsw,
  CityOfSydney: fetchCityOfSydney,
  GrantConnect: fetchGrantConnect,
  EventFeeds: fetchEventFeeds,
  GenericWebSearch: fetchGeneric,
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  }
  try {
    const { sources } = req.body as { sources?: string[] }
    const useSources = sources && Array.isArray(sources) && sources.length > 0 ? sources : Object.keys(adapters)
    let inserted = 0
    let updated = 0
    let errors = 0
    for (const source of useSources) {
      const fetcher = adapters[source]
      if (!fetcher) continue
      const items = await fetcher({ since: undefined })
      for (const item of items) {
        try {
          const checksum = computeChecksumFor(item.name, item.url, item.org)
          const existing = await prisma.opportunity.findFirst({ where: { checksum } })
          if (existing) {
            // Merge and update
            const merged = mergeOpportunity(existing, { ...item, checksum } as any)
            await prisma.opportunity.update({ where: { id: existing.id }, data: { ...merged, updatedAt: new Date() } })
            updated += 1
          } else {
            await prisma.opportunity.create({ data: { ...item, checksum, lastCheckedAt: new Date() } })
            inserted += 1
          }
        } catch (e) {
          console.error(e)
          errors += 1
        }
      }
    }
    res.status(200).json({ inserted, updated, errors })
  } catch (error: any) {
    console.error(error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}