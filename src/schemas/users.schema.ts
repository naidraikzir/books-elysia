import { sql } from 'drizzle-orm'
import { sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-typebox'

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  username: text('username').unique().notNull(),
  password: text('password').notNull(),
  timestamp: text('timestamp').default(sql`CURRENT_TIMESTAMP`),
})

export const User = typeof users.$inferSelect
export const selectUserSchema = createSelectSchema(users)
export const insertUserSchema = createInsertSchema(users)
