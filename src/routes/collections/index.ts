import type { ElysiaApp } from '@/.'
import { db } from '@/db'
import {
  collections,
  insertCollectionSchema,
} from '@/schemas/collections.schema'
import { desc } from 'drizzle-orm'
import { t } from 'elysia'

export default (app: ElysiaApp) =>
  app

    .get(
      '',
      async () => {
        const collectionList = await db
          .select()
          .from(collections)
          .orderBy(desc(collections.timestamp))
        return collectionList
      },
      {
        response: {
          200: t.Array(
            t.Object(
              {
                id: t.String(),
                name: t.Union([t.Null(), t.String()]),
                userId: t.Union([t.Null(), t.String()]),
                timestamp: t.Union([t.Null(), t.String()]),
              },
              {
                default: {
                  id: '00000000-0000-0000-0000-000000000000',
                  name: 'name',
                  userId: '00000000-0000-0000-0000-000000000000',
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

        const { sub: userId } = profile
        const { name } = body
        const id = crypto.randomUUID()
        const [inserted] = await db
          .insert(collections)
          .values({
            id,
            name,
            userId,
          })
          .returning()

        set.status = 201
        return inserted
      },
      {
        body: t.Composite([t.Pick(insertCollectionSchema, ['name'])]),
        response: {
          201: t.Object(
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
