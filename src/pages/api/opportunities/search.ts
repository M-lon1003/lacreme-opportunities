import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET'])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  }
  try {
    const { q, category, discipline, location, dateFrom, dateTo, minAmount } = req.query
    // Fetch all opportunities
    let opportunities = await prisma.opportunity.findMany()
    // Filter in memory
    if (q && typeof q === 'string' && q.trim()) {
      const term = q.toLowerCase()
      opportunities = opportunities.filter((op) =>
        op.name.toLowerCase().includes(term) || op.org.toLowerCase().includes(term)
      )
    }
    if (category && typeof category === 'string' && category.trim()) {
      opportunities = opportunities.filter((op) => op.category === category)
    }
    if (discipline && typeof discipline === 'string' && discipline.trim()) {
      const d = discipline.toLowerCase()
      opportunities = opportunities.filter((op) =>
        op.disciplines.some((disc) => disc.toLowerCase().includes(d))
      )
    }
    if (location && typeof location === 'string' && location.trim()) {
      const loc = location.toLowerCase()
      opportunities = opportunities.filter((op) => op.location.toLowerCase().includes(loc))
    }
    if (dateFrom && typeof dateFrom === 'string') {
      const fromDate = new Date(dateFrom)
      opportunities = opportunities.filter((op) => {
        const closes = op.closesOn
        return closes ? new Date(closes) >= fromDate : true
      })
    }
    if (dateTo && typeof dateTo === 'string') {
      const toDate = new Date(dateTo)
      opportunities = opportunities.filter((op) => {
        const closes = op.closesOn
        return closes ? new Date(closes) <= toDate : true
      })
    }
    if (minAmount && typeof minAmount === 'string' && minAmount.trim()) {
      const min = parseFloat(minAmount)
      opportunities = opportunities.filter((op) => (op.amount ?? 0) >= min)
    }
    // Limit to 50 results for performance
    opportunities = opportunities.slice(0, 50)
    // Return minimal fields to client
    const result = opportunities.map((op) => ({
      id: op.id,
      name: op.name,
      opensOn: op.opensOn?.toISOString() ?? null,
      closesOn: op.closesOn?.toISOString() ?? null,
      amount: op.amount,
      category: op.category,
      location: op.location,
      fitScore: op.fitScore,
      source: op.source,
      disciplines: op.disciplines,
      org: op.org,
      eligibility: op.eligibility,
      tags: op.tags,
      url: op.url,
      currency: op.currency,
      fee: op.fee,
    }))
    res.status(200).json(result)
  } catch (error: any) {
    console.error(error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}