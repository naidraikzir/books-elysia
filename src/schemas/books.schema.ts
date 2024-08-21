import { createId } from '@paralleldrive/cuid2'
import { relations, sql } from 'drizzle-orm'
import { sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { collectionsOfBooks } from './collectionsOfBooks.schema'

export const books = sqliteTable('books', {
  id: text('id').primaryKey().$defaultFn(createId),
  name: text('name'),
  author: text('author'),
  cover: text('cover'),
  timestamp: text('timestamp').default(sql`CURRENT_TIMESTAMP`),
})

export type Book = typeof books.$inferSelect

export const booksRelations = relations(books, ({ many }) => ({
  collections: many(collectionsOfBooks),
}))
