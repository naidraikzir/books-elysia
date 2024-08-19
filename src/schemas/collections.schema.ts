import { relations, sql } from 'drizzle-orm'
import { sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-typebox'
import { collectionsOfBooks } from './collectionsOfBooks.schema'
import { users } from './users.schema'

export const collections = sqliteTable('collections', {
  id: text('id').primaryKey(),
  name: text('name'),
  userId: text('user_id'),
  timestamp: text('timestamp').default(sql`CURRENT_TIMESTAMP`),
})

export type Collection = typeof collections.$inferSelect

export const insertCollectionSchema = createInsertSchema(collections)
export const selectCollectionSchema = createSelectSchema(collections)

export const collectionsRelations = relations(collections, ({ one, many }) => ({
  user: one(users, {
    fields: [collections.userId],
    references: [users.id],
  }),
  books: many(collectionsOfBooks),
}))
