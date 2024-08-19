import type { ElysiaApp } from '@/.'
import { db } from '@/db'
import {
  collectionsOfBooks,
  selectCollectionOfBooksSchema,
} from '@/schemas/collectionsOfBooks.schema'
import { t } from 'elysia'

export default (app: ElysiaApp) =>
  app.post(
    '',
    async ({ params: { id }, body }) => {
      const { books } = body
      const collection = await db
        .insert(collectionsOfBooks)
        .values(
          books.map(book => ({
            collectionId: id,
            bookId: book,
          })),
        )
        .returning()
      return collection
    },
    {
      body: t.Object({
        books: t.Array(t.String()),
      }),
      response: t.Array(selectCollectionOfBooksSchema),
    },
  )
