import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

  try {
    const q = (req.query.q as string) || ''
    const category = (req.query.category as string) || ''
    const location = (req.query.location as string) || ''
    const minAmount = Number(req.query.minAmount || 0)
    const dateFrom = (req.query.dateFrom as string) || ''
    const dateTo = (req.query.dateTo as string) || ''
    const rawDisc = req.query.discipline
    const disciplines = Array.isArray(rawDisc) ? rawDisc : rawDisc ? [rawDisc] : []

    const where: any = {}

    if (q) {
      where.OR = [
        { name: { contains: q, mode: 'insensitive' } },
        { org: { contains: q, mode: 'insensitive' } },
        { tags: { has: q } },
      ]
    }

    if (category) where.category = category as any
    if (location) where.location = { contains: location, mode: 'insensitive' }
    if (minAmount) where.amount = { gte: minAmount }
    if (disciplines.length) where.disciplines = { hasSome: disciplines }
    if (dateFrom || dateTo) {
      where.closesOn = {}
      if (dateFrom) where.closesOn.gte = new Date(dateFrom)
      if (dateTo) where.closesOn.lte = new Date(dateTo)
    }

    const results = await prisma.opportunity.findMany({
      where,
      orderBy: [{ closesOn: 'asc' }],
      take: 200, // basic cap
    })

    res.status(200).json(results)
  } catch (e: any) {
    console.error(e)
    res.status(500).json({ error: 'Search failed' })
  }
}
