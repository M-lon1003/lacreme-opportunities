import { PrismaClient } from '@prisma/client'

// Instantiate a single PrismaClient.  In serverless environments the client
// might be re‑created on each request; here we reuse a global instance when
// available to avoid exhausting database connections.
declare global {
  // eslint-disable-next-line no-var
  var __prisma__: PrismaClient | undefined
}

const prisma = global.__prisma__ || new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
  global.__prisma__ = prisma
}

export default prisma