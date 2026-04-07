// Prisma 7 + Neon Serverless Adapter
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore — gerado pelo prisma generate
import { PrismaClient } from '../app/generated/prisma/client.ts'
import { neonConfig } from '@neondatabase/serverless'
import { PrismaNeon } from '@prisma/adapter-neon'
import ws from 'ws'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DbClient = any

// WebSocket para Node.js
if (typeof WebSocket === 'undefined') {
  neonConfig.webSocketConstructor = ws
}

// Singleton lazy com Neon adapter
let _db: DbClient | undefined

export function getDb(): DbClient {
  if (!_db) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const adapter = new (PrismaNeon as any)({ connectionString: process.env.DATABASE_URL! })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    _db = new (PrismaClient as any)({ adapter })
  }
  return _db
}

export const db: DbClient = new Proxy({} as DbClient, {
  get(_target, prop) {
    return getDb()[prop]
  },
})
