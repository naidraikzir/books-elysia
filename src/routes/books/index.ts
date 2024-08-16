import type { ElysiaApp } from '@/.'
import { FILETYPES, MAX_FILESIZE } from '@/constants'
import { db } from '@/db'
import { storeImage } from '@/libs/storeFiles'
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
      async () => await db.select().from(books).orderBy(desc(books.timestamp)),
      {
        query: t.Object({
          page: t.Optional(t.Integer()),
          limit: t.Optional(t.Integer()),
        }),
        response: {
          200: t.Array(selectBookSchema, { description: 'OK' }),
        },
      },
    )
    .post(
      '',
      async ({ set, body }) => {
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
        type: 'multipart/form-data',
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
          200: t.Partial(selectBookSchema, {
            examples: {
              Created: {
                id: 'qwerty',
                name: 'name',
                author: 'author',
                cover: 'cover.jpg',
                timestamp: '2000-01-01 00:00:00',
              },
            },
          }),
        },
      },
    )
