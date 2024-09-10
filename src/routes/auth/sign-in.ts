import type { ElysiaApp } from '@/.'
import { ACCESS_TOKEN_EXP } from '@/constants'
import { db } from '@/db'
import { users } from '@/schemas/users.schema'
import { eq } from 'drizzle-orm'
import { t } from 'elysia'

export default (app: ElysiaApp) =>
  app.post(
    '',
    async ({ set, jwt, cookie: { accessToken }, body }) => {
      const user = await db.query.users.findFirst({
        where: eq(users.username, body.username),
      })

      if (!user) {
        set.status = 401
        return
      }

      const isPasswordMatched = await Bun.password.verify(
        body.password,
        user.password,
      )

      if (!isPasswordMatched) {
        set.status = 401
        return
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
    {
      body: t.Object({
        username: t.String(),
        password: t.String(),
      }),
      response: {
        200: t.Object({
          accessToken: t.String({ default: 'abcdefghijklmnopqrstuvwxyz' }),
        }),
        401: t.Undefined({ description: 'Unauthorized' }),
      },
    },
  )
