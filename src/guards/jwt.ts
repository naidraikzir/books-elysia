import type { ElysiaApp } from '@/.'
import type { JWTPayloadSpec } from '@elysiajs/jwt'
import { t } from 'elysia'

export const jwtHandler = (app: ElysiaApp) =>
  app
    .guard({
      response: {
        401: t.Undefined({ description: 'Unauthorized' }),
      },
    })
    .guard({
      beforeHandle: async ({ set, cookie: { accessToken }, jwt }) => {
        const profile = await jwt.verify(accessToken.value)
        if (!profile) {
          return new Response(undefined, {
            status: 401,
          })
        }
      },
    })
    .derive(async ({ jwt, cookie: { accessToken } }) => {
      const profile = await jwt.verify(accessToken.value)
      return {
        profile: profile as JWTPayloadSpec,
      }
    })
