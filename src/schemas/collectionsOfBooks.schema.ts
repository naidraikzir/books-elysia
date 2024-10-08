import { relations } from 'drizzle-orm'
import { primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { books } from './books.schema'
import { collections } from './collections.schema'

export const collectionsOfBooks = sqliteTable(
  'collections_of_books',
  {
    collectionId: text('collection_id')
      .notNull()
      .references(() => collections.id, {
        onUpdate: 'cascade',
        onDelete: 'cascade',
      }),
    bookId: text('book_id')
      .notNull()
      .references(() => books.id, { onUpdate: 'cascade', onDelete: 'cascade' }),
  },
  t => ({
    pk: primaryKey({ columns: [t.collectionId, t.bookId] }),
  }),
)

export type CollectionOfBooks = typeof collectionsOfBooks.$inferSelect

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
