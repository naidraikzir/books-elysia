import type { ElysiaApp } from '@/.'
import { db } from '@/db'
import { insertUserSchema, users } from '@/schemas/users.schema'
import { eq } from 'drizzle-orm'
import { t } from 'elysia'

const schema = {
  body: t.Pick(insertUserSchema, ['username', 'password']),
  response: {
    201: t.Undefined(),
    409: t.String(),
  },
}

export default (app: ElysiaApp) =>
  app.post(
    '',
    async ({ set, body }) => {
      const exist = (
        await db.select().from(users).where(eq(users.username, body.username))
      ).at(0)

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
    schema,
  )
