import type { ElysiaApp } from '@/.'
import { db } from '@/db'
import { jwtHandler } from '@/middlewares/jwt'
import { collectionsOfBooks } from '@/schemas/collectionsOfBooks.schema'
import { t } from 'elysia'

export default (app: ElysiaApp) =>
  app

    .use(jwtHandler)

    .post(
      '',
      async ({ params: { id }, body }) => {
        const { bookIds } = body
        const collection = await db
          .insert(collectionsOfBooks)
          .values(
            bookIds.map(bookId => ({
              collectionId: id,
              bookId,
            })),
          )
          .returning()
        return collection
      },
      {
        body: t.Object({
          bookIds: t.Array(t.String()),
        }),
        response: t.Array(
          t.Object({
            collectionId: t.String({
              default: '00000000-0000-0000-0000-000000000000',
            }),
            bookId: t.String({
              default: '00000000-0000-0000-0000-000000000000',
            }),
          }),
        ),
      },
    )
