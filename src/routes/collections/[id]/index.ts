import type { ElysiaApp } from '@/.'
import { db } from '@/db'
import { jwtHandler } from '@/middlewares/jwt'
import { collections } from '@/schemas/collections.schema'
import { and, eq } from 'drizzle-orm'
import { t } from 'elysia'

export default (app: ElysiaApp) =>
  app

    .use(jwtHandler)

    .get(
      '',
      async ({ profile, set, params: { id } }) => {
        const { sub: userId } = profile

        const collection = await db.query.collections.findFirst({
          where: and(
            eq(collections.id, id),
            eq(collections.userId, userId as string),
          ),
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
            },
            {
              description: 'OK',
            },
          ),
          404: t.String({ default: 'Not Found', description: 'Not Found' }),
        },
      },
    )

    .put(
      '',
      async ({ set, profile, params: { id }, body }) => {
        const { sub: userId } = profile

        const exist = await db.query.collections.findFirst({
          where: and(
            eq(collections.id, id),
            eq(collections.userId, userId as string),
          ),
        })

        if (!exist) {
          set.status = 404
          return 'Not Found'
        }

        if (exist && exist.userId !== userId) {
          set.status = 401
          return 'Unauthorized'
        }

        const { name } = body
        const [updated] = await db
          .update(collections)
          .set({
            name: name as string,
          })
          .where(eq(collections.id, id))
          .returning()

        return updated
      },
      {
        params: t.Object({
          id: t.String(),
        }),
        body: t.Object({
          name: t.String(),
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
      async ({ set, profile, params: { id } }) => {
        const { sub: userId } = profile

        const exist = await db.query.collections.findFirst({
          where: eq(collections.id, id),
        })

        if (!exist) {
          set.status = 404
          return 'Not Found'
        }

        if (exist && exist.userId !== userId) {
          set.status = 401
          return 'Unauthorized'
        }

        const [deleted] = await db
          .delete(collections)
          .where(eq(collections.id, id))
          .returning()

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
              userId: t.Union([t.Null(), t.String()], {
                default: 'abcdefghijklmn1234567890',
              }),
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
