import type { ElysiaApp } from '@/.'
import { db } from '@/db'
import { users } from '@/schemas/users.schema'
import { eq } from 'drizzle-orm'
import { t } from 'elysia'

export default (app: ElysiaApp) =>
  app.post(
    '',
    async ({ set, body }) => {
      const exist = await db.query.users.findFirst({
        where: eq(users.username, body.username),
      })

      if (exist) {
        set.status = 409
        return 'User already exists'
      }

      const password = await Bun.password.hash(body.password)

      await db.insert(users).values({ ...body, password })
      set.status = 201
      return 'Created'
    },
    {
      body: t.Object({
        username: t.String(),
        password: t.String(),
      }),
      response: {
        201: t.String({ default: 'Created', description: 'Created' }),
        409: t.String({ default: 'Conflict', description: 'Conflict' }),
      },
    },
  )
