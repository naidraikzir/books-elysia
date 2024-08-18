import type { ElysiaApp } from '@/.'
import { db } from '@/db'
import { books, selectBookSchema } from '@/schemas/books.schema'
import { eq } from 'drizzle-orm'
import { t } from 'elysia'

export default (app: ElysiaApp) =>
  app.get(
    '',
    async ({ set, params: { id } }) => {
      const [book] = await db.select().from(books).where(eq(books.id, id))

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
            id: t.String({ default: '00000000-0000-0000-0000-000000000000' }),
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
