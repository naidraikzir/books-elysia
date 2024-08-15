import type { ElysiaApp } from '@/.'
import { db } from '@/db'
import { selectUserSchema, users } from '@/schemas/users.schema'
import { eq } from 'drizzle-orm'
import { t } from 'elysia'

const schema = {
  body: t.Pick(selectUserSchema, ['username', 'password']),
  response: {
    200: t.Object({
      token: t.String(),
    }),
    401: t.String(),
    404: t.String(),
  },
}

export default (app: ElysiaApp) =>
  app.post(
    '',
    async ({ set, body, jwt }) => {
      const user = (
        await db.select().from(users).where(eq(users.username, body.username))
      ).at(0)

      if (!user) {
        set.status = 404
        return 'No such user!'
      }

      const isPasswordMatched = await Bun.password.verify(
        body.password,
        user.password,
      )

      if (!isPasswordMatched) {
        set.status = 401
        return 'Wrong password buddy!'
      }

      const token = await jwt.sign({
        name: user.username,
        iat: Math.round(new Date().getTime() / 1000),
      })

      return { token }
    },
    schema,
  )
