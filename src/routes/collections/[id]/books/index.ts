import type { ElysiaApp } from '@/.'
import { db } from '@/db'
import { jwtHandler } from '@/middlewares/jwt'
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
              id: t.String({ default: 'abcdefghijklmn1234567890' }),
              name: t.Union([t.Null(), t.String()], { default: 'name' }),
              userId: t.Union([t.Null(), t.String()], {
                default: 'abcdefghijklmn1234567890',
              }),
              timestamp: t.Union([t.Null(), t.String()], {
                default: '2000-01-01 00:00:00',
              }),
              books: t.Array(
                t.Object(
                  {
                    collectionId: t.String(),
                    bookId: t.String(),
                    book: t.Object({
                      id: t.String(),
                      name: t.Nullable(t.String()),
                      author: t.Nullable(t.String()),
                      cover: t.Nullable(t.String()),
                      timestamp: t.Nullable(t.String()),
                    }),
                  },
                  {
                    default: {
                      collectionId: 'abcdefghijklmn1234567890',
                      bookId: 'abcdefghijklmn1234567890',
                      book: {
                        id: 'abcdefghijklmn1234567890',
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
              default: 'abcdefghijklmn1234567890',
            }),
            bookId: t.String({
              default: 'abcdefghijklmn1234567890',
            }),
          }),
        ),
      },
    )
