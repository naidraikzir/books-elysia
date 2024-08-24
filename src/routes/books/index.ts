import type { ElysiaApp } from '@/.'
import { FILETYPES, MAX_FILESIZE } from '@/constants'
import { db } from '@/db'
import { storeImage } from '@/lib/files'
import { jwtHandler } from '@/middlewares/jwt'
import { books } from '@/schemas/books.schema'
import { desc } from 'drizzle-orm'
import { t } from 'elysia'

export default (app: ElysiaApp) =>
  app

    .get(
      '',
      async () =>
        await db.query.books.findMany({
          orderBy: desc(books.timestamp),
        }),
      {
        query: t.Object({
          page: t.Optional(t.Integer()),
          limit: t.Optional(t.Integer()),
        }),
        response: {
          200: t.Array(
            t.Object(
              {
                id: t.String(),
                name: t.Union([t.Null(), t.String()]),
                author: t.Union([t.Null(), t.String()]),
                cover: t.Union([t.Null(), t.String()]),
                timestamp: t.Union([t.Null(), t.String()]),
              },
              {
                default: {
                  id: 'abcdefghijklmn1234567890',
                  name: 'name',
                  author: 'author',
                  cover: 'cover.webp',
                  timestamp: '2000-01-01 00:00:00',
                },
              },
            ),
            {
              description: 'OK',
            },
          ),
        },
      },
    )

    .use(jwtHandler)

    .post(
      '',
      async ({ set, body }) => {
        const { name, author, cover } = body

        let coverFilename = ''
        if (cover) {
          coverFilename = (await storeImage(cover as Blob)) as string
        }

        const inserted = await db
          .insert(books)
          .values({
            name,
            author,
            ...(cover ? { cover: coverFilename } : {}),
          })
          .returning()
          .get()

        set.status = 201
        return inserted
      },
      {
        body: t.Object({
          name: t.String(),
          author: t.String(),
          cover: t.Optional(
            t.File({
              type: FILETYPES.image,
              maxSize: MAX_FILESIZE,
            }),
          ),
        }),
        response: {
          201: t.Object(
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
              description: 'Created',
            },
          ),
          401: t.String({
            default: 'Unauthorized',
            description: 'Unauthorized',
          }),
        },
      },
    )
