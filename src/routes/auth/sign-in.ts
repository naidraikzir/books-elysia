import type { ElysiaApp } from '@/.'
import { ACCESS_TOKEN_EXP } from '@/constants'
import { db } from '@/db'
import { selectUserSchema, users } from '@/schemas/users.schema'
import { eq } from 'drizzle-orm'
import { t } from 'elysia'

const schema = {
  body: t.Pick(selectUserSchema, ['username', 'password']),
  response: {
    200: t.Object({
      accessToken: t.String(),
    }),
    401: t.String({ examples: ['Unauthorized'], description: 'Unauthorized' }),
    404: t.String({ examples: ['Not Found'], description: 'Not Found' }),
  },
}

export default (app: ElysiaApp) =>
  app.post(
    '',
    async ({ set, jwt, cookie: { accessToken }, body }) => {
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

      accessToken.set({
        value: await jwt.sign({
          sub: user.id,
          name: user.username,
          iat: Math.round(new Date().getTime() / 1000),
        }),
        httpOnly: true,
        maxAge: ACCESS_TOKEN_EXP,
        path: '/',
      })

      return {
        accessToken: accessToken.value as string,
      }
    },
    schema,
  )
