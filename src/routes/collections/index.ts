import type { ElysiaApp } from '@/.'
import { db } from '@/db'
import { jwtHandler } from '@/guards/jwt'
import { collections } from '@/schemas/collections.schema'
import type { JWTPayloadSpec } from '@elysiajs/jwt'
import { desc, eq } from 'drizzle-orm'
import { t } from 'elysia'

export default (app: ElysiaApp) =>
  app

    .use(jwtHandler)

    .get(
      '',
      async ({ profile: { sub: userId } }: { profile: JWTPayloadSpec }) =>
        await db.query.collections.findMany({
          where: eq(collections.userId, userId as string),
          orderBy: desc(collections.timestamp),
        }),
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
                  id: 'abcdefghijklmn1234567890',
                  name: 'name',
                  userId: 'abcdefghijklmn1234567890',
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
      async ({ profile, set, body }) => {
        const { sub: userId } = profile
        const { name } = body
        const inserted = await db
          .insert(collections)
          .values({
            name,
            userId,
          })
          .returning()
          .get()

        set.status = 201
        return inserted
      },
      {
        body: t.Object({
          name: t.String(),
        }),
        response: {
          201: t.Object(
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
              description: 'Created',
            },
          ),
        },
      },
    )
