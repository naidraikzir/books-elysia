import type { ElysiaApp } from '@/.'
import { db } from '@/db'
import {
  collections,
  insertCollectionSchema,
} from '@/schemas/collections.schema'
import { eq } from 'drizzle-orm'
import { t } from 'elysia'

export default (app: ElysiaApp) =>
  app

    .get(
      '',
      async ({ set, params: { id } }) => {
        const [collection] = await db
          .select()
          .from(collections)
          .where(eq(collections.id, id))

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
      async ({ set, jwt, cookie: { accessToken }, params: { id }, body }) => {
        const profile = await jwt.verify(accessToken.value)
        if (!profile) {
          set.status = 401
          return 'Unauthorized'
        }

        const [exist] = await db
          .select()
          .from(collections)
          .where(eq(collections.id, id))

        if (!exist) {
          set.status = 404
          return 'Not Found'
        }

        if (exist && exist.userId !== profile.sub) {
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
        body: t.Composite([t.Pick(insertCollectionSchema, ['name'])]),
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
      async ({ set, jwt, cookie: { accessToken }, params: { id } }) => {
        const profile = await jwt.verify(accessToken.value)
        if (!profile) {
          set.status = 401
          return 'Unauthorized'
        }

        const [exist] = await db
          .select()
          .from(collections)
          .where(eq(collections.id, id))

        if (!exist) {
          set.status = 404
          return 'Not Found'
        }

        if (exist && exist.userId !== profile.sub) {
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
              id: t.String({ default: '00000000-0000-0000-0000-000000000000' }),
              name: t.Union([t.Null(), t.String()], { default: 'name' }),
              userId: t.Union([t.Null(), t.String()], {
                default: '00000000-0000-0000-0000-000000000000',
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
