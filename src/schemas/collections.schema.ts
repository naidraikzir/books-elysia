import { createId } from '@paralleldrive/cuid2'
import { relations, sql } from 'drizzle-orm'
import { sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { collectionsOfBooks } from './collectionsOfBooks.schema'
import { users } from './users.schema'

export const collections = sqliteTable('collections', {
  id: text('id').primaryKey().$defaultFn(createId),
  name: text('name'),
  userId: text('user_id'),
  timestamp: text('timestamp').default(sql`CURRENT_TIMESTAMP`),
})

export type Collection = typeof collections.$inferSelect

export const collectionsRelations = relations(collections, ({ one, many }) => ({
  user: one(users, {
    fields: [collections.userId],
    references: [users.id],
  }),
  books: many(collectionsOfBooks),
}))
