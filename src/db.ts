import { Database } from 'bun:sqlite'
import { DB_NAME } from '@/constants'
import { schema } from '@/schemas'
import { drizzle } from 'drizzle-orm/bun-sqlite'

const sqlite = new Database(DB_NAME)
export const db = drizzle(sqlite, { schema })
