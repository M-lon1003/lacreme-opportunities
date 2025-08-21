import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      const items = await prisma.savedItem.findMany({ include: { opportunity: true } })
      res.status(200).json(items)
      return
    }
    if (req.method === 'POST') {
      const { opportunityId, status, notes } = req.body as {
        opportunityId: string
        status?: 'New' | 'Saved' | 'Applied'
        notes?: string
      }
      // For the MVP we use a fixed user.  In production this would be session.user.id
      const user = await prisma.userProfile.findFirst()
      if (!user) {
        // create a default user if none exists
        const defaultUser = await prisma.userProfile.create({ data: { email: 'demo@example.com', disciplines: [], locations: [], blockedSources: [] } })
        const item = await prisma.savedItem.upsert({
          where: { userId_opportunityId: { userId: defaultUser.id, opportunityId } },
          update: { status: status ?? 'Saved', notes: notes ?? null },
          create: { userId: defaultUser.id, opportunityId, status: status ?? 'Saved', notes: notes ?? null },
          include: { opportunity: true },
        })
        res.status(200).json(item)
        return
      }
      const item = await prisma.savedItem.upsert({
        where: { userId_opportunityId: { userId: user.id, opportunityId } },
        update: { status: status ?? 'Saved', notes: notes ?? null },
        create: { userId: user.id, opportunityId, status: status ?? 'Saved', notes: notes ?? null },
        include: { opportunity: true },
      })
      res.status(200).json(item)
      return
    }
    res.setHeader('Allow', ['GET', 'POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  } catch (error: any) {
    console.error(error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}