import type { ElysiaApp } from '@/.'
import { FILETYPES, MAX_FILESIZE } from '@/constants'
import { db } from '@/db'
import { deleteImage, storeImage } from '@/lib/files'
import { jwtHandler } from '@/middlewares/jwt'
import { books } from '@/schemas/books.schema'
import { eq } from 'drizzle-orm'
import { t } from 'elysia'

export default (app: ElysiaApp) =>
  app

    .get(
      '',
      async ({ set, params: { id } }) => {
        const book = await db.query.books.findFirst({
          where: eq(books.id, id),
        })

        if (!book) {
          set.status = 404
          return 'Not Found'
        }

        return book
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
              author: t.Union([t.Null(), t.String()], { default: 'author' }),
              cover: t.Union([t.Null(), t.String()], { default: 'cover.webp' }),
              timestamp: t.Union([t.Null(), t.String()], {
                default: '2000-01-01 00:00:00',
              }),
            },
            {
              description: 'OK',
            },
          ),
          404: t.String({ default: 'Not Found', description: 'Not Found' }),
        },
      },
    )

    .use(jwtHandler)

    .put(
      '',
      async ({ set, params: { id }, body }) => {
        const exist = await db.query.books.findFirst({
          where: eq(books.id, id),
        })

        if (!exist) {
          set.status = 404
          return 'Not Found'
        }

        const { name, author, cover } = body
        const coverFilename = await storeImage(cover as Blob)
        const [updated] = await db
          .update(books)
          .set({
            name: name as string,
            author: author as string,
            cover: coverFilename,
          })
          .where(eq(books.id, id))
          .returning()

        deleteImage(exist?.cover)
        return updated
      },
      {
        params: t.Object({
          id: t.String(),
        }),
        body: t.Object({
          name: t.Optional(t.String()),
          author: t.Optional(t.String()),
          cover: t.Optional(
            t.File({
              type: FILETYPES.image,
              maxSize: MAX_FILESIZE,
            }),
          ),
        }),
        response: {
          200: t.Object(
            {
              id: t.String({ default: 'abcdefghijklmn1234567890' }),
              name: t.Union([t.Null(), t.String()], { default: 'name' }),
              author: t.Union([t.Null(), t.String()], { default: 'author' }),
              cover: t.Union([t.Null(), t.String()], { default: 'cover.webp' }),
              timestamp: t.Union([t.Null(), t.String()], {
                default: '2000-01-01 00:00:00',
              }),
            },
            {
              description: 'OK',
            },
          ),
          401: t.String({
            default: 'Unauthorized',
            description: 'Unauthorized',
          }),
          404: t.String({ default: 'Not Found', description: 'Not Found' }),
        },
      },
    )

    .delete(
      '',
      async ({ set, params: { id } }) => {
        const exist = await db.query.books.findFirst({
          where: eq(books.id, id),
        })

        if (!exist) {
          set.status = 404
          return 'Not Found'
        }

        const [deleted] = await db
          .delete(books)
          .where(eq(books.id, id))
          .returning()

        deleteImage(deleted?.cover)
        return deleted
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
              author: t.Union([t.Null(), t.String()], { default: 'author' }),
              cover: t.Union([t.Null(), t.String()], { default: 'cover.webp' }),
              timestamp: t.Union([t.Null(), t.String()], {
                default: '2000-01-01 00:00:00',
              }),
            },
            {
              description: 'Deleted',
            },
          ),
          401: t.String({
            default: 'Unauthorized',
            description: 'Unauthorized',
          }),
          404: t.String({ default: 'Not Found', description: 'Not Found' }),
        },
      },
    )
