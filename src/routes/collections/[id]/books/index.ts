import type { ElysiaApp } from '@/.'
import { db } from '@/db'
import { jwtHandler } from '@/middlewares/jwt'
import { selectBookSchema } from '@/schemas/books.schema'
import { collections } from '@/schemas/collections.schema'
import { collectionsOfBooks } from '@/schemas/collectionsOfBooks.schema'
import { eq } from 'drizzle-orm'
import { t } from 'elysia'

export default (app: ElysiaApp) =>
  app

    .use(jwtHandler)

    .get(
      '',
      async ({ set, params: { id } }) => {
        const collection = await db.query.collections.findFirst({
          where: eq(collections.id, id),
          with: {
            books: {
              with: {
                book: true,
              },
            },
          },
        })

        if (!collection) {
          set.status = 404
          return 'Not Found'
        }

        return collection
      },
      {
        params: t.Object({
          id: t.String(),
        }),
        response: {
          200: t.Object(
            {
              id: t.String({ default: '00000000-0000-0000-0000-000000000000' }),
              name: t.Union([t.Null(), t.String()], { default: 'name' }),
              userId: t.Union([t.Null(), t.String()], {
                default: '00000000-0000-0000-0000-000000000000',
              }),
              timestamp: t.Union([t.Null(), t.String()], {
                default: '2000-01-01 00:00:00',
              }),
              books: t.Array(
                t.Object(
                  {
                    collectionId: t.String(),
                    bookId: t.String(),
                    book: selectBookSchema,
                  },
                  {
                    default: {
                      collectionId: '00000000-0000-0000-0000-000000000000',
                      bookId: '00000000-0000-0000-0000-000000000000',
                      book: {
                        id: '00000000-0000-0000-0000-000000000000',
                        name: 'name',
                        author: 'author',
                        cover: 'cover.webp',
                        timestamp: '2000-01-01 00:00:00',
                      },
                    },
                  },
                ),
              ),
            },
            {
              description: 'OK',
            },
          ),
          404: t.String({ default: 'Not Found', description: 'Not Found' }),
        },
      },
    )

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
