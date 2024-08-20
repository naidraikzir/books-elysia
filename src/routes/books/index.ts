import type { ElysiaApp } from '@/.'
import { FILETYPES, MAX_FILESIZE } from '@/constants'
import { db } from '@/db'
import { storeImage } from '@/lib/files'
import {
  books,
  insertBookSchema,
  selectBookSchema,
} from '@/schemas/books.schema'
import { desc } from 'drizzle-orm'
import { t } from 'elysia'

export default (app: ElysiaApp) =>
  app

    .get(
      '',
      async () => {
        const bookList = await db
          .select()
          .from(books)
          .orderBy(desc(books.timestamp))
        return bookList
      },
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
                  id: '00000000-0000-0000-0000-000000000000',
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

    .post(
      '',
      async ({ set, cookie: { accessToken }, jwt, body }) => {
        const profile = await jwt.verify(accessToken.value)
        if (!profile) {
          set.status = 401
          return 'Unauthorized'
        }

        const { name, author, cover } = body
        const id = crypto.randomUUID()
        const coverFilename = await storeImage(cover as Blob)
        const [inserted] = await db
          .insert(books)
          .values({
            id,
            name,
            author,
            cover: coverFilename,
          })
          .returning()

        set.status = 201
        return inserted
      },
      {
        body: t.Composite([
          t.Pick(insertBookSchema, ['name', 'author']),
          t.Object({
            cover: t.Optional(
              t.File({
                type: FILETYPES.image,
                maxSize: MAX_FILESIZE,
              }),
            ),
          }),
        ]),
        response: {
          201: t.Object(
            {
              id: t.String({ default: '00000000-0000-0000-0000-000000000000' }),
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
