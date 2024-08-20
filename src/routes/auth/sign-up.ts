import type { ElysiaApp } from '@/.'
import { db } from '@/db'
import { insertUserSchema, users } from '@/schemas/users.schema'
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

      const id = crypto.randomUUID()
      const password = await Bun.password.hash(body.password)

      await db.insert(users).values({ ...body, id, password })
      set.status = 201
      return
    },
    {
      body: t.Pick(insertUserSchema, ['username', 'password']),
      response: {
        201: t.String({ default: 'Created', description: 'Created' }),
        409: t.String({ default: 'Conflict', description: 'Conflict' }),
      },
    },
  )
