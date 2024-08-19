import { relations } from 'drizzle-orm'
import { primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-typebox'
import { books } from './books.schema'
import { collections } from './collections.schema'

export const collectionsOfBooks = sqliteTable(
  'collections_of_books',
  {
    collectionId: text('collection_id')
      .notNull()
      .references(() => collections.id),
    bookId: text('book_id')
      .notNull()
      .references(() => books.id),
  },
  t => ({
    pk: primaryKey({ columns: [t.collectionId, t.bookId] }),
  }),
)

export type CollectionOfBooks = typeof collectionsOfBooks.$inferSelect

export const insertCollectionOfBooksSchema =
  createInsertSchema(collectionsOfBooks)
export const selectCollectionOfBooksSchema =
  createSelectSchema(collectionsOfBooks)

export const collectionsOfBooksRelations = relations(
  collectionsOfBooks,
  ({ one }) => ({
    collection: one(collections, {
      fields: [collectionsOfBooks.collectionId],
      references: [collections.id],
    }),
    book: one(books, {
      fields: [collectionsOfBooks.bookId],
      references: [books.id],
    }),
  }),
)
