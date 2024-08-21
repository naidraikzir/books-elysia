import { createId } from '@paralleldrive/cuid2'
import { relations, sql } from 'drizzle-orm'
import { sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { collections } from './collections.schema'

export const users = sqliteTable('users', {
  id: text('id').primaryKey().$defaultFn(createId),
  username: text('username').unique().notNull(),
  password: text('password').notNull(),
  timestamp: text('timestamp').default(sql`CURRENT_TIMESTAMP`),
})

export const User = typeof users.$inferSelect

export const usersRelations = relations(users, ({ many }) => ({
  collections: many(collections),
}))
