import type { NextApiRequest, NextApiResponse } from 'next'
import { randomUUID } from 'crypto'

// Simple in‑memory queue for the MVP.  Each call appends to this array.
const queue: Array<{ id: string; payload: any }> = []

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  }
  try {
    const payload = req.body
    const id = randomUUID()
    queue.push({ id, payload })
    res.status(200).json({ queued: true, id })
  } catch (error: any) {
    console.error(error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}