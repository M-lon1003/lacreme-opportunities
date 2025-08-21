import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  }
  try {
    const { frequency } = req.body as { frequency: 'daily' | 'weekly' }
    if (!frequency) {
      return res.status(400).json({ error: 'frequency is required' })
    }
    // Find users with matching frequency
    const users = await prisma.userProfile.findMany({ where: { notifyFrequency: frequency } })
    let sent = 0
    const today = new Date()
    const upcoming = new Date(today.getTime() + (frequency === 'daily' ? 24 : 7 * 24) * 60 * 60 * 1000)
    const opportunities = await prisma.opportunity.findMany({
      where: {
        closesOn: {
          gte: today,
          lte: upcoming,
        },
      },
    })
    // Stub: just increase sent count for each user if there are opportunities
    if (opportunities.length > 0) {
      sent = users.length
    }
    // In production, send emails via Resend using RESEND_API_KEY
    res.status(200).json({ sent })
  } catch (error: any) {
    console.error(error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}